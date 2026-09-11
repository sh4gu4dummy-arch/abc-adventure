import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Eraser } from "lucide-react";
import { markSection } from "@/lib/progress";
import { getGfxSnapshot } from "@/lib/gfx-pref";
import { speak } from "@/lib/speak";
import { traceStrokes, type TracePt } from "@/data/trace-guides";

/** Must color most of the glyph — a K spine alone must not pass. */
const COVER_THRESHOLD = 0.5;
const INK_WIDTH = 36;
const GRID_COLS = 3;
const GRID_ROWS = 3;
const CELL_MIN_SHARE = 0.04;
const CELL_COVER = 0.32;

type GlyphBox = { x0: number; y0: number; x1: number; y1: number };

function cellAt(x: number, y: number, box: GlyphBox): number {
  const bw = Math.max(1, box.x1 - box.x0 + 1);
  const bh = Math.max(1, box.y1 - box.y0 + 1);
  const c = Math.min(GRID_COLS - 1, Math.max(0, Math.floor(((x - box.x0) / bw) * GRID_COLS)));
  const r = Math.min(GRID_ROWS - 1, Math.max(0, Math.floor(((y - box.y0) / bh) * GRID_ROWS)));
  return r * GRID_COLS + c;
}

function cellsReady(letterN: number, cellLetter: Uint32Array, cellInked: Uint32Array): boolean {
  for (let i = 0; i < cellLetter.length; i++) {
    if (cellLetter[i] / letterN < CELL_MIN_SHARE) continue;
    if (cellInked[i] / cellLetter[i] < CELL_COVER) return false;
  }
  return true;
}

function mapGuide(
  nx: number,
  ny: number,
  box: GlyphBox,
  dpr: number,
): { x: number; y: number } {
  return {
    x: (box.x0 + nx * (box.x1 - box.x0 + 1)) / dpr,
    y: (box.y0 + ny * (box.y1 - box.y0 + 1)) / dpr,
  };
}

function strokeLen(pts: { x: number; y: number }[]): number {
  let n = 0;
  for (let i = 1; i < pts.length; i++) {
    n += Math.hypot(pts[i]!.x - pts[i - 1]!.x, pts[i]!.y - pts[i - 1]!.y);
  }
  return n;
}

function pointAlong(
  pts: { x: number; y: number }[],
  t: number,
): { x: number; y: number; ang: number } {
  const total = Math.max(1, strokeLen(pts));
  let remain = Math.min(1, Math.max(0, t)) * total;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]!;
    const b = pts[i]!;
    const seg = Math.hypot(b.x - a.x, b.y - a.y) || 0.001;
    if (remain <= seg) {
      const u = remain / seg;
      return {
        x: a.x + (b.x - a.x) * u,
        y: a.y + (b.y - a.y) * u,
        ang: Math.atan2(b.y - a.y, b.x - a.x),
      };
    }
    remain -= seg;
  }
  const last = pts[pts.length - 1]!;
  const prev = pts[pts.length - 2] ?? last;
  return {
    x: last.x,
    y: last.y,
    ang: Math.atan2(last.y - prev.y, last.x - prev.x),
  };
}

}

function catmullPoint(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
  d: { x: number; y: number },
  t: number,
): { x: number; y: number } {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * b.x +
        (-a.x + c.x) * t +
        (2 * a.x - 5 * b.x + 4 * c.x - d.x) * t2 +
        (-a.x + 3 * b.x - 3 * c.x + d.x) * t3),
    y:
      0.5 *
      (2 * b.y +
        (-a.y + c.y) * t +
        (2 * a.y - 5 * b.y + 4 * c.y - d.y) * t2 +
        (-a.y + 3 * b.y - 3 * c.y + d.y) * t3),
  };
}

/** Dense curve from control points. 2-point strokes stay a straight line. */
function smoothStroke(pts: { x: number; y: number }[]): { x: number; y: number }[] {
  if (pts.length < 3) return pts;
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  const closed = Math.hypot(first.x - last.x, first.y - last.y) < 10;
  const src = closed ? pts.slice(0, -1) : pts;
  const n = src.length;
  if (n < 3) return pts;
  const out: { x: number; y: number }[] = [];
  const seg = 10;
  const at = (i: number) => src[(i + n) % n]!;
  const lastI = closed ? n : n - 1;
  for (let i = 0; i < lastI; i++) {
    const a = closed ? at(i - 1) : i === 0 ? src[0]! : src[i - 1]!;
    const b = src[i]!;
    const c = closed ? at(i + 1) : src[Math.min(i + 1, n - 1)]!;
    const d = closed ? at(i + 2) : src[Math.min(i + 2, n - 1)]!;
    for (let s = 0; s < seg; s++) out.push(catmullPoint(a, b, c, d, s / seg));
  }
  out.push(closed ? first : last);
  return out;
}

function drawChevron(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  ang: number,
  size: number,
  fill: string,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(ang);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(size, 0);
  ctx.lineTo(-size * 0.55, size * 0.72);
  ctx.lineTo(-size * 0.18, 0);
  ctx.lineTo(-size * 0.55, -size * 0.72);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawTraceArrows(
  ctx: CanvasRenderingContext2D,
  letter: string,
  box: GlyphBox,
  dpr: number,
  color: string,
) {
  const strokes = traceStrokes(letter);
  if (!strokes || box.x1 <= box.x0) return;
  const mapped = strokes.map((stroke) =>
    smoothStroke(stroke.map((p: TracePt) => mapGuide(p[0], p[1], box, dpr))),
  );
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  mapped.forEach((pts) => {
    if (pts.length < 2) return;
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(pts[0]!.x, pts[0]!.y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i]!.x, pts[i]!.y);
    ctx.stroke();
    const mid = pointAlong(pts, 0.72);
    ctx.globalAlpha = 0.95;
    drawChevron(ctx, mid.x, mid.y, mid.ang, 11, color);
  });
  const placed: { x: number; y: number }[] = [];
  mapped.forEach((pts, i) => {
    if (pts.length < 2) return;
    ctx.globalAlpha = 1;
    let p = pointAlong(pts, 0.16);
    const minPx = 22;
    const start = pts[0]!;
    const dist0 = Math.hypot(p.x - start.x, p.y - start.y);
    if (dist0 < minPx) p = pointAlong(pts, Math.min(0.42, minPx / Math.max(1, strokeLen(pts))));
    for (const q of placed) {
      if (Math.hypot(p.x - q.x, p.y - q.y) < 26) {
        p = pointAlong(pts, 0.32);
        break;
      }
    }
    placed.push({ x: p.x, y: p.y });
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = '700 13px "Fredoka", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), p.x, p.y + 0.5);
  });
  ctx.restore();
}

function letterFont(h: number, lower: boolean) {
  const size = Math.floor(h * (lower ? 0.86 : 0.76));
  if (lower) {
    return `650 ${size}px "Fredoka", "Nunito", sans-serif`;
  }
  return `700 ${size}px "Fredoka", "Nunito", sans-serif`;
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
  caseKind: lockedCase,
}: {
  letter: string;
  accent: string;
  onDone?: () => void;
  /** When set, hide the inner Big/little switch (page already has one). */
  caseKind?: "upper" | "lower";
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
  const boxRef = useRef<GlyphBox>({ x0: 0, y0: 0, x1: 1, y1: 1 });
  const cellLetterRef = useRef(new Uint32Array(GRID_COLS * GRID_ROWS));
  const cellInkedRef = useRef(new Uint32Array(GRID_COLS * GRID_ROWS));
  const pxW = useRef(0);
  const pxH = useRef(0);
  const dprRef = useRef(1);
  const cssRef = useRef({ w: 0, h: 0 });
  const finishedRef = useRef(false);
  const [cover, setCover] = useState(0);
  const [done, setDone] = useState(false);
  const [startPct, setStartPct] = useState({ x: 50, y: 18 });
  const [localCase, setLocalCase] = useState<"upper" | "lower">("upper");
  const caseKind = lockedCase ?? localCase;
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
      drawTraceArrows(ctx, guideLetter, boxRef.current, dprRef.current, accent);
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
        cellInkedRef.current[cellAt(x, y, boxRef.current)] += 1;
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
    if (
      ratio >= COVER_THRESHOLD &&
      cellsReady(letterCount.current, cellLetterRef.current, cellInkedRef.current)
    ) {
      finish();
    }
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
      let x0 = pw;
      let y0 = ph;
      let x1 = 0;
      let y1 = 0;
      for (let i = 0; i < pw * ph; i++) {
        if (img[i * 4 + 3] > 24) {
          bits[i] = 1;
          count += 1;
          const y = (i / pw) | 0;
          const x = i % pw;
          if (x < x0) x0 = x;
          if (y < y0) y0 = y;
          if (x > x1) x1 = x;
          if (y > y1) y1 = y;
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
      const box: GlyphBox = {
        x0: Math.min(x0, x1),
        y0: Math.min(y0, y1),
        x1: Math.max(x0, x1),
        y1: Math.max(y0, y1),
      };
      const cellLetter = new Uint32Array(GRID_COLS * GRID_ROWS);
      if (count > 0) {
        for (let i = 0; i < pw * ph; i++) {
          if (!bits[i]) continue;
          const y = (i / pw) | 0;
          const x = i % pw;
          cellLetter[cellAt(x, y, box)] += 1;
        }
      }
      letterBits.current = bits;
      inkedBits.current = new Uint8Array(pw * ph);
      letterCount.current = Math.max(count, 1);
      inkedCount.current = 0;
      boxRef.current = box;
      cellLetterRef.current = cellLetter;
      cellInkedRef.current = new Uint32Array(GRID_COLS * GRID_ROWS);
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
    void Promise.all([
      document.fonts?.load('700 80px "Fredoka"'),
      document.fonts?.load('800 80px "Nunito"'),
      document.fonts?.ready,
    ]).then(() => {
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
    if (finishedRef.current) setupCanvas("reset");
    drawing.current = true;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* synthetic / already captured */
    }
    const p = pos(e);
    lastPt.current = p;
    drawSegment(p, p);
    redraw();
    publishCover();
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
      {!lockedCase && (
      <div className="flex gap-1.5" role="tablist" aria-label="Big or little letter">
        <button
          type="button"
          role="tab"
          aria-selected={caseKind === "upper"}
          onClick={() => setLocalCase("upper")}
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
          onClick={() => setLocalCase("lower")}
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
      )}

      <div
        className={`relative overflow-hidden rounded-[var(--radius-lg)] border-2 border-border shadow-[var(--shadow-card)] ${done ? "trace-pad-done" : ""}`}
      >
        {showGhost && !traceStrokes(guideLetter) && (
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
          <span>{done ? "You did it" : "Color the whole letter"}</span>
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
            ? `You traced ${spokenName}! Tap the letter to try again.`
            : `Follow the arrows. Start at 1 and color the whole letter.`}
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
