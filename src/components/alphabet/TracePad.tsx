import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import { markSection } from "@/lib/progress";
import { getGfxSnapshot } from "@/lib/gfx-pref";
import { speak } from "@/lib/speak";

const COLS = 32;
const ROWS = 26;
/** Share of the visible letter that ink must touch. Tracing, not coloring in. */
const COVER_THRESHOLD = 0.48;
const INK_WIDTH = 18;
const START_HINT: Record<string, { x: number; y: number }> = {
  A: { x: 50, y: 22 },
  B: { x: 32, y: 22 },
  C: { x: 68, y: 28 },
  D: { x: 32, y: 22 },
  E: { x: 32, y: 22 },
  F: { x: 32, y: 22 },
  G: { x: 70, y: 30 },
  H: { x: 30, y: 22 },
  I: { x: 50, y: 20 },
  J: { x: 58, y: 20 },
  K: { x: 32, y: 22 },
  L: { x: 34, y: 22 },
  M: { x: 26, y: 78 },
  N: { x: 30, y: 22 },
  O: { x: 50, y: 20 },
  P: { x: 32, y: 22 },
  Q: { x: 50, y: 20 },
  R: { x: 32, y: 22 },
  S: { x: 66, y: 26 },
  T: { x: 28, y: 22 },
  U: { x: 30, y: 24 },
  V: { x: 28, y: 24 },
  W: { x: 24, y: 24 },
  X: { x: 30, y: 24 },
  Y: { x: 30, y: 24 },
  Z: { x: 30, y: 24 },
};

function idx(c: number, r: number) {
  return r * COLS + c;
}

function letterFont(h: number) {
  // System stack first so the coverage mask always paints, even before webfonts.
  return `700 ${Math.floor(h * 0.62)}px system-ui, Nunito, Fredoka, sans-serif`;
}

export function TracePad({
  letter,
  accent,
  onDone,
}: {
  letter: string;
  accent: string;
  onDone?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPt = useRef<{ x: number; y: number } | null>(null);
  const letterMask = useRef<Uint8Array>(new Uint8Array(COLS * ROWS));
  const coreMask = useRef<Uint8Array>(new Uint8Array(COLS * ROWS));
  const inkMask = useRef<Uint8Array>(new Uint8Array(COLS * ROWS));
  const letterCellCount = useRef(0);
  const finishedRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });
  const [cover, setCover] = useState(0);
  const [done, setDone] = useState(false);
  const guideLetter = letter.toUpperCase();

  const paintGuide = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      ctx.clearRect(0, 0, w, h);
      const dark = document.documentElement.classList.contains("theme-dark");
      ctx.fillStyle = dark ? "#1e2030" : "#fffdf9";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = dark ? "rgba(80, 84, 110, 0.9)" : "rgba(240, 217, 200, 0.9)";
      ctx.lineWidth = 1;
      for (let y = h * 0.25; y < h; y += h * 0.2) {
        ctx.beginPath();
        ctx.moveTo(16, y);
        ctx.lineTo(w - 16, y);
        ctx.stroke();
      }

      ctx.font = letterFont(h);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const cx = w / 2;
      const cy = h / 2 + 4;

      // Soft body — the letter to color in
      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.16;
      ctx.fillText(guideLetter, cx, cy);

      // Still outline on the glyph rim (same font + origin as the fill)
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.setLineDash([]);
      ctx.strokeText(guideLetter, cx, cy);
      ctx.globalAlpha = 1;
    },
    [accent, guideLetter],
  );

  const rebuildLetterMask = useCallback(
    (w: number, h: number) => {
      const off = document.createElement("canvas");
      off.width = Math.max(8, Math.round(w));
      off.height = Math.max(8, Math.round(h));
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.clearRect(0, 0, off.width, off.height);
      octx.fillStyle = "#000";
      octx.font = letterFont(h);
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(guideLetter, off.width / 2, off.height / 2 + 4);

      const img = octx.getImageData(0, 0, off.width, off.height).data;
      const raw = new Uint8Array(COLS * ROWS);
      const cellW = off.width / COLS;
      const cellH = off.height / ROWS;
      let painted = 0;

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const x0 = Math.floor(c * cellW);
          const y0 = Math.floor(r * cellH);
          const x1 = Math.min(off.width, Math.ceil((c + 1) * cellW));
          const y1 = Math.min(off.height, Math.ceil((r + 1) * cellH));
          let hit = 0;
          for (let y = y0; y < y1 && !hit; y += 2) {
            for (let x = x0; x < x1 && !hit; x += 2) {
              if (img[(y * off.width + x) * 4 + 3] > 8) hit = 1;
            }
          }
          raw[idx(c, r)] = hit;
          if (hit) painted += 1;
        }
      }

      // If the glyph didn't rasterize, fall back to a fat A-shaped center band
      if (painted < 10) {
        for (let r = 3; r < ROWS - 3; r++) {
          for (let c = 5; c < COLS - 5; c++) {
            raw[idx(c, r)] = 1;
          }
        }
      }

      const dilated = new Uint8Array(COLS * ROWS);
      let count = 0;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const on = raw[idx(c, r)];
          dilated[idx(c, r)] = on;
          if (on) count += 1;
        }
      }
      const core = new Uint8Array(COLS * ROWS);
      let coreCount = 0;
      for (let r = 1; r < ROWS - 1; r++) {
        for (let c = 1; c < COLS - 1; c++) {
          if (!dilated[idx(c, r)]) continue;
          if (
            dilated[idx(c - 1, r)] &&
            dilated[idx(c + 1, r)] &&
            dilated[idx(c, r - 1)] &&
            dilated[idx(c, r + 1)]
          ) {
            core[idx(c, r)] = 1;
            coreCount += 1;
          }
        }
      }
      letterMask.current = dilated;
      coreMask.current = coreCount >= 12 ? core : dilated;
      letterCellCount.current = Math.max(count, 1);
    },
    [guideLetter],
  );

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    if (w < 8) return;
    const h = Math.min(Math.max(w * 0.85, 240), 420);
    const cap = getGfxSnapshot().resolved === "lite" ? 1.25 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, cap);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const sizeChanged = sizeRef.current.w !== w || sizeRef.current.h !== h;
    const hasInk = inkMask.current.some((v) => v === 1);
    sizeRef.current = { w, h };
    rebuildLetterMask(w, h);
    if (sizeChanged || !hasInk) {
      paintGuide(ctx, w, h);
    }
    if (sizeChanged) {
      inkMask.current.fill(0);
      finishedRef.current = false;
      setCover(0);
      setDone(false);
    }
  }, [paintGuide, rebuildLetterMask]);

  useEffect(() => {
    setupCanvas();
    const onResize = () => setupCanvas();
    window.addEventListener("resize", onResize);
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) setupCanvas();
    });
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [setupCanvas]);

  function stampInk(x: number, y: number, w: number, h: number) {
    const c = Math.max(0, Math.min(COLS - 1, Math.floor((x / w) * COLS)));
    const r = Math.max(0, Math.min(ROWS - 1, Math.floor((y / h) * ROWS)));
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const rr = r + dr;
        const cc = c + dc;
        if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) continue;
        inkMask.current[idx(cc, rr)] = 1;
      }
    }
  }

  function coverageRatio() {
    const total = letterCellCount.current;
    if (total <= 0) return 0;
    let hit = 0;
    const letterBits = letterMask.current;
    const ink = inkMask.current;
    for (let i = 0; i < letterBits.length; i++) {
      if (letterBits[i] && ink[i]) hit += 1;
    }
    return hit / total;
  }

  /**
   * The middle of the letter (A/H bar, B/R bowls, etc.).
   * Side strokes must not count as the bar — only ink in the inner box.
   */
  function connectorComplete() {
    const bits = letterMask.current;
    const ink = inkMask.current;
    let minC = COLS;
    let maxC = -1;
    let minR = ROWS;
    let maxR = -1;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!bits[idx(c, r)]) continue;
        if (c < minC) minC = c;
        if (c > maxC) maxC = c;
        if (r < minR) minR = r;
        if (r > maxR) maxR = r;
      }
    }
    if (maxC < minC) return true;
    const bw = maxC - minC + 1;
    const bh = maxR - minR + 1;
    const c0 = minC + Math.floor(bw * 0.36);
    const c1 = minC + Math.floor(bw * 0.64);
    const r0 = minR + Math.floor(bh * 0.32);
    const r1 = minR + Math.floor(bh * 0.68);
    let cells = 0;
    let hit = 0;
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) {
        if (!bits[idx(c, r)]) continue;
        cells += 1;
        if (ink[idx(c, r)]) hit += 1;
      }
    }
    // Open letters (C, L) have no interior bar — skip.
    if (cells < 6) return true;
    return hit / cells >= 0.4;
  }

  function publishCover(ratio: number) {
    setCover((prev) => (Math.abs(prev - ratio) >= 0.01 ? ratio : prev));
    if (finishedRef.current) return;
    if (ratio < COVER_THRESHOLD || !connectorComplete()) return;
    finishedRef.current = true;
    setDone(true);
    markSection(letter, "trace");
    onDone?.();
    void speak(`Nice tracing! You can keep filling letter ${guideLetter} if you want.`);
  }

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function pointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    e.preventDefault();
    drawing.current = true;
    canvas.setPointerCapture(e.pointerId);
    const p = pos(e);
    lastPt.current = p;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.strokeStyle = accent;
    ctx.lineWidth = INK_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    stampInk(p.x, p.y, canvas.clientWidth, canvas.clientHeight);
  }

  function pointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const prev = lastPt.current ?? p;
    const dx = p.x - prev.x;
    const dy = p.y - prev.y;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 5));
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      stampInk(prev.x + dx * t, prev.y + dy * t, w, h);
    }
    lastPt.current = p;
    publishCover(coverageRatio());
  }

  function pointerUp() {
    if (!drawing.current) return;
    drawing.current = false;
    lastPt.current = null;
    publishCover(coverageRatio());
  }

  function clear() {
    finishedRef.current = false;
    inkMask.current.fill(0);
    setCover(0);
    setDone(false);
    sizeRef.current = { w: 0, h: 0 };
    setupCanvas();
  }

  const shown = Math.min(100, Math.round(cover * 100));
  const showGhost = cover < 0.06;
  const start = START_HINT[guideLetter] ?? { x: 32, y: 22 };
  const filled = cover >= 0.96;

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-[var(--radius-lg)] border-2 border-border shadow-[var(--shadow-card)]">
        {showGhost && (
          <span
            className="trace-start-dot"
            style={{ left: `${start.x}%`, top: `${start.y}%`, background: accent }}
          >
            1
          </span>
        )}
        <canvas
          ref={canvasRef}
          className="relative block w-full touch-none"
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerUp}
          aria-label={`Trace the letter ${guideLetter}`}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted">
          <span>
            {filled
              ? "All filled"
              : done
                ? "Keep going if you want"
                : "Keep tracing"}
          </span>
          <span>{shown}%</span>
        </div>
        <div
          className="h-2.5 overflow-hidden rounded-full bg-surface-soft"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={shown}
          aria-label="Tracing progress"
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${shown}%`,
              background: filled
                ? "var(--color-success)"
                : done
                  ? "var(--color-success)"
                  : accent,
              transition: "width 160ms ease-out",
            }}
          />
        </div>
        <p className="text-sm font-semibold text-ink-soft">
          {filled
            ? `Beautiful! Letter ${guideLetter} is all filled in.`
            : done
              ? `Nice tracing! You can keep filling ${guideLetter} if you want.`
              : "Start at the 1. Trace every part of the letter — bars, bowls, and stems."}
        </p>
      </div>

      <button
        type="button"
        onClick={clear}
        className="pressable inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-4 text-sm font-bold"
      >
        <Eraser className="size-4" /> {done ? "Trace again" : "Clear"}
      </button>
    </div>
  );
}
