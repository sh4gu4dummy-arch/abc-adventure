import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Eraser } from "lucide-react";
import { markSection } from "@/lib/progress";
import { getGfxSnapshot } from "@/lib/gfx-pref";
import { speak } from "@/lib/speak";

/** Fraction of the letter body a kid must color. Close is enough. */
const COVER_THRESHOLD = 0.26;
const INK_WIDTH = 36;

function letterFont(h: number, lower: boolean) {
  return `800 ${Math.floor(h * (lower ? 0.86 : 0.76))}px system-ui, Nunito, Fredoka, sans-serif`;
}

function paintGlyph(
  ctx: CanvasRenderingContext2D,
  letter: string,
  w: number,
  h: number,
  mode: "fill" | "stroke" | "both",
  lower: boolean,
) {
  ctx.font = letterFont(h, lower);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const x = w / 2;
  const y = h * (lower ? 0.7 : 0.72);
  if (mode === "stroke" || mode === "both") ctx.strokeText(letter, x, y);
  if (mode === "fill" || mode === "both") ctx.fillText(letter, x, y);
}

type TraceDebug = {
  cover: number;
  done: boolean;
  letter: string;
  threshold: number;
};

declare global {
  interface Window {
    __tracePad?: TraceDebug;
  }
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
  const inkRef = useRef<HTMLCanvasElement | null>(null);
  const maskVisRef = useRef<HTMLCanvasElement | null>(null);
  const tmpRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const lastPt = useRef<{ x: number; y: number } | null>(null);
  const letterBits = useRef<Uint8Array>(new Uint8Array(0));
  const inkedBits = useRef<Uint8Array>(new Uint8Array(0));
  const letterCount = useRef(1);
  const inkedCount = useRef(0);
  const pxW = useRef(0);
  const pxH = useRef(0);
  const dprRef = useRef(1);
  const cssRef = useRef({ w: 0, h: 0 });
  const finishedRef = useRef(false);
  const [cover, setCover] = useState(0);
  const [done, setDone] = useState(false);
  const [startPct, setStartPct] = useState({ x: 50, y: 18 });
  const [caseKind, setCaseKind] = useState<"upper" | "lower">("upper");
  const upper = letter.toUpperCase();
  const lowerCh = letter.toLowerCase();
  const guideLetter = caseKind === "upper" ? upper : lowerCh;
  const isLower = caseKind === "lower";
  const spokenName = caseKind === "upper" ? `big ${upper}` : `little ${lowerCh}`;

  const publishDebug = useCallback(
    (ratio: number, finished: boolean) => {
      window.__tracePad = {
        cover: ratio,
        done: finished,
        letter: guideLetter,
        threshold: COVER_THRESHOLD,
      };
    },
    [guideLetter],
  );

  const paintPaper = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, filled: boolean) => {
      const dark = document.documentElement.classList.contains("theme-dark");
      ctx.fillStyle = dark ? "#1e2030" : "#fffdf9";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = dark ? "rgba(80, 84, 110, 0.9)" : "rgba(240, 217, 200, 0.9)";
      ctx.lineWidth = 1;
      for (let y = h * 0.2; y < h; y += h * 0.16) {
        ctx.beginPath();
        ctx.moveTo(16, y);
        ctx.lineTo(w - 16, y);
        ctx.stroke();
      }

      if (filled) {
        ctx.fillStyle = accent;
        ctx.globalAlpha = 1;
        ctx.strokeStyle = accent;
        ctx.lineWidth = 8;
        ctx.setLineDash([]);
        paintGlyph(ctx, guideLetter, w, h, "both", isLower);
        return;
      }

      ctx.fillStyle = accent;
      ctx.globalAlpha = 0.14;
      paintGlyph(ctx, guideLetter, w, h, "fill", isLower);
      ctx.globalAlpha = 0.7;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 6;
      ctx.setLineDash([12, 9]);
      paintGlyph(ctx, guideLetter, w, h, "stroke", isLower);
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
    },
    [accent, guideLetter, isLower],
  );

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ink = inkRef.current;
    const mask = maskVisRef.current;
    if (!canvas || !ink || !mask) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { w, h } = cssRef.current;
    if (w < 8) return;
    paintPaper(ctx, w, h, finishedRef.current);
    if (finishedRef.current) return;
    const tmp = tmpRef.current;
    if (!tmp) return;
    const tctx = tmp.getContext("2d");
    if (!tctx) return;
    tctx.globalCompositeOperation = "copy";
    tctx.drawImage(ink, 0, 0);
    tctx.globalCompositeOperation = "destination-in";
    tctx.drawImage(mask, 0, 0);
    tctx.globalCompositeOperation = "source-over";
    ctx.drawImage(tmp, 0, 0, w, h);
  }, [paintPaper]);

  const stamp = useCallback((cssX: number, cssY: number) => {
    const dpr = dprRef.current;
    const w = pxW.current;
    const h = pxH.current;
    const bits = letterBits.current;
    const inked = inkedBits.current;
    if (!w || bits.length !== w * h) return;
    const cx = Math.round(cssX * dpr);
    const cy = Math.round(cssY * dpr);
    const rad = Math.max(10, Math.round((INK_WIDTH / 2) * dpr));
    const r2 = rad * rad;
    for (let dy = -rad; dy <= rad; dy++) {
      const y = cy + dy;
      if (y < 0 || y >= h) continue;
      for (let dx = -rad; dx <= rad; dx++) {
        if (dx * dx + dy * dy > r2) continue;
        const x = cx + dx;
        if (x < 0 || x >= w) continue;
        const i = y * w + x;
        if (!bits[i] || inked[i]) continue;
        inked[i] = 1;
        inkedCount.current += 1;
      }
    }
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setCover(1);
    setDone(true);
    publishDebug(1, true);
    redraw();
    try {
      markSection(letter, "trace");
      onDone?.();
    } catch {
      /* progress is optional */
    }
    void speak(`You traced ${spokenName}!`);
  }, [guideLetter, letter, onDone, publishDebug, redraw, spokenName]);

  const publishCover = useCallback(() => {
    const ratio = inkedCount.current / letterCount.current;
    if (!finishedRef.current) {
      setCover((prev) => (Math.abs(prev - ratio) >= 0.01 ? ratio : prev));
      publishDebug(ratio, false);
    }
    if (ratio >= COVER_THRESHOLD) finish();
  }, [finish, publishDebug]);

  const setupCanvas = useCallback(
    (mode: "reset" | "resize" = "reset") => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      if (w < 8) return;
      const h = Math.min(Math.max(w * 0.88, 280), 460);
      const cap = getGfxSnapshot().resolved === "lite" ? 1.25 : 2;
      const dpr = Math.min(window.devicePixelRatio || 1, cap);
      const pw = Math.max(8, Math.floor(w * dpr));
      const ph = Math.max(8, Math.floor(h * dpr));

      const sizeChanged = cssRef.current.w !== w || cssRef.current.h !== h;
      if (
        mode === "resize" &&
        !sizeChanged &&
        inkRef.current &&
        (inkedCount.current > 0 || finishedRef.current)
      ) {
        redraw();
        return;
      }

      canvas.width = pw;
      canvas.height = ph;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const ink = document.createElement("canvas");
      ink.width = pw;
      ink.height = ph;
      const ictx = ink.getContext("2d");
      if (!ictx) return;
      ictx.setTransform(dpr, 0, 0, dpr, 0, 0);
      inkRef.current = ink;

      const glyph = document.createElement("canvas");
      glyph.width = pw;
      glyph.height = ph;
      const gctx = glyph.getContext("2d", { willReadFrequently: true });
      if (!gctx) return;
      gctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gctx.fillStyle = "#000";
      paintGlyph(gctx, guideLetter, w, h, "fill", isLower);
      const img = gctx.getImageData(0, 0, pw, ph).data;
      const bits = new Uint8Array(pw * ph);
      let count = 0;
      let topX = 0;
      let topY = ph;
      let topN = 0;
      for (let i = 0; i < pw * ph; i++) {
        if (img[i * 4 + 3] > 24) {
          bits[i] = 1;
          count += 1;
          const y = (i / pw) | 0;
          const x = i % pw;
          if (y < topY) {
            topY = y;
            topX = x;
            topN = 1;
          } else if (y === topY) {
            topX += x;
            topN += 1;
          }
        }
      }
      letterBits.current = bits;
      inkedBits.current = new Uint8Array(pw * ph);
      letterCount.current = Math.max(count, 1);
      inkedCount.current = 0;
      pxW.current = pw;
      pxH.current = ph;
      dprRef.current = dpr;
      cssRef.current = { w, h };
      if (topN > 0) {
        setStartPct({
          x: ((topX / topN) / pw) * 100,
          y: (topY / ph) * 100,
        });
      }

      const vis = document.createElement("canvas");
      vis.width = pw;
      vis.height = ph;
      const vctx = vis.getContext("2d");
      if (!vctx) return;
      vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      vctx.fillStyle = "#fff";
      vctx.strokeStyle = "#fff";
      vctx.lineWidth = 26;
      paintGlyph(vctx, guideLetter, w, h, "both", isLower);
      maskVisRef.current = vis;

      const tmp = document.createElement("canvas");
      tmp.width = pw;
      tmp.height = ph;
      tmpRef.current = tmp;

      finishedRef.current = false;
      setCover(0);
      setDone(false);
      publishDebug(0, false);
      redraw();
    },
    [guideLetter, isLower, publishDebug, redraw],
  );

  useEffect(() => {
    setupCanvas("reset");
    const onResize = () => setupCanvas("resize");
    window.addEventListener("resize", onResize);
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) setupCanvas("resize");
    });
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      if (window.__tracePad?.letter === guideLetter) delete window.__tracePad;
    };
  }, [guideLetter, setupCanvas]);

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function drawSegment(from: { x: number; y: number }, to: { x: number; y: number }) {
    const ink = inkRef.current;
    const ictx = ink?.getContext("2d");
    if (!ink || !ictx) return;
    ictx.strokeStyle = accent;
    ictx.lineWidth = INK_WIDTH;
    ictx.lineCap = "round";
    ictx.lineJoin = "round";
    ictx.beginPath();
    ictx.moveTo(from.x, from.y);
    ictx.lineTo(to.x, to.y);
    ictx.stroke();
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 4));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      stamp(from.x + dx * t, from.y + dy * t);
    }
  }

  function pointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    drawing.current = true;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic / already captured */
    }
    const p = pos(e);
    lastPt.current = p;
    if (!finishedRef.current) {
      drawSegment(p, p);
      redraw();
      publishCover();
    }
  }

  function pointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || finishedRef.current) return;
    const p = pos(e);
    const prev = lastPt.current ?? p;
    drawSegment(prev, p);
    lastPt.current = p;
    redraw();
    publishCover();
  }

  function pointerUp() {
    drawing.current = false;
    lastPt.current = null;
    if (!finishedRef.current) publishCover();
  }

  function clear() {
    setupCanvas("reset");
  }

  const shown = Math.min(100, Math.round(cover * 100));
  const showGhost = !done && cover < 0.03;

  return (
    <div className="space-y-3">
      <div className="flex gap-1.5" role="tablist" aria-label="Big or little letter">
        <button
          type="button"
          role="tab"
          aria-selected={caseKind === "upper"}
          onClick={() => setCaseKind("upper")}
          className="pressable min-h-11 flex-1 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 text-sm font-bold text-ink"
          style={
            caseKind === "upper"
              ? { borderColor: accent, color: accent, background: `${accent}18` }
              : undefined
          }
        >
          Big {upper}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={caseKind === "lower"}
          onClick={() => setCaseKind("lower")}
          className="pressable min-h-11 flex-1 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 text-sm font-bold text-ink"
          style={
            caseKind === "lower"
              ? { borderColor: accent, color: accent, background: `${accent}18` }
              : undefined
          }
        >
          little {lowerCh}
        </button>
      </div>

      <div
        className={`relative overflow-hidden rounded-[var(--radius-lg)] border-2 border-border shadow-[var(--shadow-card)] ${done ? "trace-pad-done" : ""}`}
      >
        {showGhost && (
          <span
            className="trace-start-dot"
            style={{ left: `${startPct.x}%`, top: `${startPct.y}%`, background: accent }}
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
          aria-label={`Trace ${spokenName}`}
        />
        {done && (
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-end p-3">
            <span className="trace-done-badge inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--color-success)] px-3 py-1.5 text-sm font-bold text-white shadow-[var(--shadow-card)]">
              <Check className="size-4" strokeWidth={3} />
              You traced {spokenName}!
            </span>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wide text-muted">
          <span>{done ? "You did it" : "Color the letter"}</span>
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
              background: done ? "var(--color-success)" : accent,
              transition: "width 160ms ease-out",
            }}
          />
        </div>
        <p className="text-sm font-semibold text-ink-soft">
          {done
            ? `You traced ${spokenName}!`
            : `Start at the 1 and color in ${caseKind === "upper" ? "the big letter" : "the little letter"}.`}
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
