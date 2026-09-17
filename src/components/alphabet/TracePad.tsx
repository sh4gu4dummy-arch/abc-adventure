import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Eraser, MousePointer2, Minus, Pencil, Spline, Trash2, Copy, Waves } from "lucide-react";
import { markSection } from "@/lib/progress";
import { getGfxSnapshot } from "@/lib/gfx-pref";
import { speak } from "@/lib/speak";
import { traceStrokes, type TracePt, type TraceStroke } from "@/data/trace-guides";
import {
  useTraceDev,
  loadDevStrokes,
  saveDevStrokes,
  clearDevStrokes,
  copyDevPayload,
  type DevStroke,
  type TraceDevTool,
} from "@/lib/trace-dev";

/** Must color most of the glyph — a K spine alone must not pass. */
const COVER_THRESHOLD = 0.5;
const INK_WIDTH = 36;
const GRID_COLS = 3;
const GRID_ROWS = 3;
const CELL_MIN_SHARE = 0.04;
const CELL_COVER = 0.32;
/** Each guide stroke must be followed (Q tail, K arms, A bar…). */
const STROKE_COVER = 0.4;

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

function inkNear(
  inked: Uint8Array,
  w: number,
  h: number,
  x: number,
  y: number,
  rad: number,
): boolean {
  const r2 = rad * rad;
  for (let dy = -rad; dy <= rad; dy++) {
    const yy = y + dy;
    if (yy < 0 || yy >= h) continue;
    for (let dx = -rad; dx <= rad; dx++) {
      if (dx * dx + dy * dy > r2) continue;
      const xx = x + dx;
      if (xx < 0 || xx >= w) continue;
      if (inked[yy * w + xx]) return true;
    }
  }
  return false;
}

function strokesReady(
  letter: string,
  box: GlyphBox,
  dpr: number,
  inked: Uint8Array,
  w: number,
  h: number,
): boolean {
  const strokes = traceStrokes(letter);
  if (!strokes || strokes.length === 0) return true;
  const rad = Math.max(8, Math.round((INK_WIDTH / 2.4) * dpr));
  for (const stroke of strokes) {
    if (stroke.length < 2) continue;
    const pts = smoothStroke(stroke.map((p: TracePt) => mapGuide(p[0], p[1], box, dpr)));
    let hit = 0;
    let n = 0;
    for (let t = 0.12; t <= 0.92; t += 0.08) {
      const p = pointAlong(pts, t);
      n += 1;
      const x = Math.round(p.x * dpr);
      const y = Math.round(p.y * dpr);
      if (inkNear(inked, w, h, x, y, rad)) hit += 1;
    }
    if (n > 0 && hit / n < STROKE_COVER) return false;
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

function unmapGuide(
  x: number,
  y: number,
  box: GlyphBox,
  dpr: number,
): TracePt {
  const bw = box.x1 - box.x0 + 1;
  const bh = box.y1 - box.y0 + 1;
  const nx = (x * dpr - box.x0) / bw;
  const ny = (y * dpr - box.y0) / bh;
  return [
    Math.min(1, Math.max(0, nx)),
    Math.min(1, Math.max(0, ny)),
  ];
}

function chaikin(pts: TracePt[]): TracePt[] {
  if (pts.length < 3) return pts;
  const out: TracePt[] = [pts[0]!];
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!;
    const b = pts[i + 1]!;
    out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25]);
    out.push([a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
  }
  out.push(pts[pts.length - 1]!);
  return out;
}

function rdpSimplify(pts: TracePt[], eps: number): TracePt[] {
  if (pts.length < 3) return pts;
  const a = pts[0]!;
  const b = pts[pts.length - 1]!;
  let maxD = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = distToSeg(pts[i]![0], pts[i]![1], a[0], a[1], b[0], b[1]);
    if (d > maxD) {
      maxD = d;
      idx = i;
    }
  }
  if (maxD > eps) {
    const left = rdpSimplify(pts.slice(0, idx + 1), eps);
    const right = rdpSimplify(pts.slice(idx), eps);
    return [...left.slice(0, -1), ...right];
  }
  return [a, b];
}

function fitCurve(pts: TracePt[]): TracePt[] {
  const raw = pts.filter((p, i, a) => {
    if (i === 0 || i === a.length - 1) return true;
    const q = a[i - 1]!;
    return Math.hypot(p[0] - q[0], p[1] - q[1]) > 0.008;
  });
  let out = rdpSimplify(raw, 0.02);
  if (out.length >= 3) out = rdpSimplify(chaikin(out), 0.016);
  if (out.length > 10) out = rdpSimplify(out, 0.028);
  return out.length >= 2 ? out : raw;
}

type ScaleCorner = "nw" | "ne" | "sw" | "se";

function ptsBBox(pts: TracePt[]): { x0: number; y0: number; x1: number; y1: number } {
  let x0 = 1;
  let y0 = 1;
  let x1 = 0;
  let y1 = 0;
  for (const [x, y] of pts) {
    x0 = Math.min(x0, x);
    y0 = Math.min(y0, y);
    x1 = Math.max(x1, x);
    y1 = Math.max(y1, y);
  }
  if (x1 - x0 < 0.05) {
    const m = (x0 + x1) / 2;
    x0 = m - 0.025;
    x1 = m + 0.025;
  }
  if (y1 - y0 < 0.05) {
    const m = (y0 + y1) / 2;
    y0 = m - 0.025;
    y1 = m + 0.025;
  }
  return { x0, y0, x1, y1 };
}

function bboxCorner(
  b: { x0: number; y0: number; x1: number; y1: number },
  c: ScaleCorner,
): TracePt {
  if (c === "nw") return [b.x0, b.y0];
  if (c === "ne") return [b.x1, b.y0];
  if (c === "sw") return [b.x0, b.y1];
  return [b.x1, b.y1];
}

function bboxAnchor(c: ScaleCorner): ScaleCorner {
  if (c === "nw") return "se";
  if (c === "ne") return "sw";
  if (c === "sw") return "ne";
  return "nw";
}

function scalePts(origin: TracePt[], corner: ScaleCorner, grab: TracePt): TracePt[] {
  const b = ptsBBox(origin);
  const [ax, ay] = bboxCorner(b, bboxAnchor(corner));
  const [cx, cy] = bboxCorner(b, corner);
  const dx0 = cx - ax || 0.001;
  const dy0 = cy - ay || 0.001;
  let sx = (grab[0] - ax) / dx0;
  let sy = (grab[1] - ay) / dy0;
  if (sx >= 0) sx = Math.max(0.12, sx);
  else sx = Math.min(-0.12, sx);
  if (sy >= 0) sy = Math.max(0.12, sy);
  else sy = Math.min(-0.12, sy);
  return origin.map(([x, y]) => [
    Math.min(1, Math.max(0, ax + (x - ax) * sx)),
    Math.min(1, Math.max(0, ay + (y - ay) * sy)),
  ]);
}

function distToSeg(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
): number {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  const t = Math.min(1, Math.max(0, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
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
  strokes: TraceStroke[] | null,
  box: GlyphBox,
  dpr: number,
  color: string,
  opts?: { numTs?: number[]; selected?: number; handles?: boolean },
) {
  if (!strokes?.length || box.x1 <= box.x0) return;
  const mapped = strokes.map((stroke) =>
    smoothStroke(stroke.map((p: TracePt) => mapGuide(p[0], p[1], box, dpr))),
  );
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  mapped.forEach((pts, i) => {
    if (pts.length < 2) return;
    const picked = opts?.selected === i;
    ctx.strokeStyle = picked ? "#f59f00" : color;
    ctx.globalAlpha = picked ? 0.95 : 0.75;
    ctx.lineWidth = picked ? 8 : 6;
    ctx.setLineDash([7, 9]);
    ctx.beginPath();
    ctx.moveTo(pts[0]!.x, pts[0]!.y);
    for (let k = 1; k < pts.length; k++) ctx.lineTo(pts[k]!.x, pts[k]!.y);
    ctx.stroke();
    ctx.setLineDash([]);
    const mid = pointAlong(pts, 0.72);
    ctx.globalAlpha = 0.95;
    drawChevron(ctx, mid.x, mid.y, mid.ang, 11, picked ? "#f59f00" : color);
  });
  const placed: { x: number; y: number }[] = [];
  mapped.forEach((pts, i) => {
    if (pts.length < 2) return;
    ctx.globalAlpha = 1;
    const t = opts?.numTs?.[i] ?? 0.16;
    let p = pointAlong(pts, t);
    if (!opts?.handles) {
      const minPx = 22;
      const start = pts[0]!;
      const dist0 = Math.hypot(p.x - start.x, p.y - start.y);
      if (dist0 < minPx) p = pointAlong(pts, Math.min(0.42, minPx / Math.max(1, strokeLen(pts))));
      for (const q of placed) {
        if (Math.hypot(p.x - q.x, p.y - q.y) < 26) {
          p = pointAlong(pts, Math.min(0.5, t + 0.16));
          break;
        }
      }
    }
    placed.push({ x: p.x, y: p.y });
    ctx.fillStyle = opts?.selected === i ? "#f59f00" : color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = '700 13px "Fredoka", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), p.x, p.y + 0.5);
    if (opts?.handles) {
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "#2b2d42";
      ctx.lineWidth = 2;
      const raw = strokes[i]!;
      for (let k = 0; k < raw.length; k++) {
        const h = mapGuide(raw[k]![0], raw[k]![1], box, dpr);
        ctx.beginPath();
        ctx.arc(h.x, h.y, k === 0 || k === raw.length - 1 ? 8 : 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      if (raw.length === 2) {
        const bulge = pointAlong(pts, 0.5);
        ctx.beginPath();
        ctx.moveTo(bulge.x, bulge.y - 8);
        ctx.lineTo(bulge.x + 8, bulge.y);
        ctx.lineTo(bulge.x, bulge.y + 8);
        ctx.lineTo(bulge.x - 8, bulge.y);
        ctx.closePath();
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.stroke();
      }
      if (picked) {
        const bb = ptsBBox(raw);
        const nw = mapGuide(bb.x0, bb.y0, box, dpr);
        const se = mapGuide(bb.x1, bb.y1, box, dpr);
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "#2b2d42";
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.7;
        ctx.strokeRect(nw.x, nw.y, se.x - nw.x, se.y - nw.y);
        ctx.setLineDash([]);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#2b2d42";
        ctx.lineWidth = 2;
        for (const c of ["nw", "ne", "sw", "se"] as ScaleCorner[]) {
          const [nx, ny] = bboxCorner(bb, c);
          const h = mapGuide(nx, ny, box, dpr);
          ctx.beginPath();
          ctx.rect(h.x - 6, h.y - 6, 12, 12);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  });
  ctx.restore();
}

function glyphMetrics(h: number, lower: boolean, ch: string) {
  if (!lower) return { size: Math.floor(h * 0.76), y: h * 0.72 };
  const c = ch.toLowerCase();
  if (c === "p") return { size: Math.floor(h * 0.7), y: h * 0.84 };
  if (c === "h") return { size: Math.floor(h * 0.78), y: h * 0.78 };
  return { size: Math.floor(h * 0.86), y: h * 0.7 };
}

function letterFont(h: number, lower: boolean, ch: string) {
  const { size } = glyphMetrics(h, lower, ch);
  if (lower) {
    return `700 ${size}px "Comic Neue", "Comic Sans MS", "Fredoka", sans-serif`;
  }
  return `700 ${size}px "Fredoka", "Comic Neue", sans-serif`;
}

function paintGlyph(
  ctx: CanvasRenderingContext2D,
  letter: string,
  w: number,
  h: number,
  mode: "fill" | "stroke" | "both",
  lower: boolean,
) {
  ctx.font = letterFont(h, lower, letter);
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const x = w / 2;
  const y = glyphMetrics(h, lower, letter).y;
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
  const traceDev = useTraceDev();
  const devStrokesRef = useRef<DevStroke[]>([]);
  const devSelRef = useRef(-1);
  const devToolRef = useRef<TraceDevTool>("select");
  const devDragRef = useRef<
    | {
        kind: "move" | "start" | "end" | "number" | "draw" | "mid" | "vertex" | "scale";
        index: number;
        ox: number;
        oy: number;
        origin: TracePt[];
        vertex?: number;
        corner?: ScaleCorner;
      }
    | null
  >(null);
  const curveActiveRef = useRef(-1);
  const [devTool, setDevTool] = useState<TraceDevTool>("select");
  const [devSel, setDevSel] = useState(-1);
  const [devMsg, setDevMsg] = useState<string | null>(null);
  const [devExport, setDevExport] = useState<string | null>(null);
  const devOn = traceDev;
  devToolRef.current = devTool;
  devSelRef.current = devSel;

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
      ctx.globalAlpha = 0.85;
      ctx.strokeStyle = accent;
      ctx.lineWidth = 7;
      ctx.setLineDash([]);
      paintGlyph(ctx, guideLetter, w, h, "stroke", isLower);
      ctx.globalAlpha = 1;
      drawTraceArrows(
        ctx,
        (devOn
          ? devStrokesRef.current.map((s) => s.pts)
          : traceStrokes(guideLetter)),
        boxRef.current,
        dprRef.current,
        accent,
        devOn
          ? {
              numTs: devStrokesRef.current.map((s) => s.numT),
              selected: devSelRef.current,
              handles: true,
            }
          : undefined,
      );
    },
    [accent, guideLetter, isLower, traceDev],
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

  useEffect(() => {
    devStrokesRef.current = loadDevStrokes(guideLetter);
    setDevSel(-1);
    curveActiveRef.current = -1;
  }, [guideLetter, traceDev]);

  useEffect(() => {
    if (!traceDev) return;
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const el = e.target as HTMLElement | null;
      if (el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable)) {
        return;
      }
      if (devToolRef.current !== "select") return;
      e.preventDefault();
      const list = devStrokesRef.current;
      const idx = devSelRef.current >= 0 ? devSelRef.current : list.length === 1 ? 0 : -1;
      if (idx < 0) {
        setDevMsg("Tap a line first, then Delete.");
        return;
      }
      const next = list.filter((_, i) => i !== idx);
      devStrokesRef.current = next;
      setDevSel(next.length ? Math.min(idx, next.length - 1) : -1);
      persistDev();
      redraw();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [traceDev, redraw]);

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
      cellsReady(letterCount.current, cellLetterRef.current, cellInkedRef.current) &&
      strokesReady(
        guideLetter,
        boxRef.current,
        dprRef.current,
        inkedBits.current,
        pxW.current,
        pxH.current,
      )
    ) {
      finish();
    }
  }, [finish, guideLetter, publishDebug]);

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
      document.fonts?.load('700 80px "Comic Neue"'),
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

  function persistDev() {
    saveDevStrokes(guideLetter, devStrokesRef.current);
  }

  function hitDev(p: { x: number; y: number }): {
    index: number;
    kind: "number" | "start" | "end" | "mid" | "body" | "vertex" | "scale";
    vertex?: number;
    corner?: ScaleCorner;
  } | null {
    const box = boxRef.current;
    const dpr = dprRef.current;
    const strokes = devStrokesRef.current;
    const sel = devSelRef.current;
    if (sel >= 0 && strokes[sel] && strokes[sel]!.pts.length >= 2) {
      const bb = ptsBBox(strokes[sel]!.pts);
      for (const c of ["nw", "ne", "sw", "se"] as ScaleCorner[]) {
        const [nx, ny] = bboxCorner(bb, c);
        const q = mapGuide(nx, ny, box, dpr);
        if (Math.hypot(p.x - q.x, p.y - q.y) <= 16) {
          return { index: sel, kind: "scale", corner: c };
        }
      }
    }
    for (let i = strokes.length - 1; i >= 0; i--) {
      const s = strokes[i]!;
      if (s.pts.length < 2) continue;
      for (let k = 0; k < s.pts.length; k++) {
        const q = mapGuide(s.pts[k]![0], s.pts[k]![1], box, dpr);
        const end = k === 0 || k === s.pts.length - 1;
        if (Math.hypot(p.x - q.x, p.y - q.y) <= (end ? 18 : 13)) {
          return { index: i, kind: "vertex", vertex: k };
        }
      }
    }
    for (let i = strokes.length - 1; i >= 0; i--) {
      const s = strokes[i]!;
      if (s.pts.length < 2) continue;
      const mapped = smoothStroke(s.pts.map((pt) => mapGuide(pt[0], pt[1], box, dpr)));
      const num = pointAlong(mapped, s.numT);
      if (Math.hypot(p.x - num.x, p.y - num.y) <= 16) return { index: i, kind: "number" };
      if (s.pts.length === 2 && devSelRef.current === i) {
        const bulge = pointAlong(mapped, 0.5);
        if (Math.hypot(p.x - bulge.x, p.y - bulge.y) <= 14) return { index: i, kind: "mid" };
      }
    }
    for (let i = strokes.length - 1; i >= 0; i--) {
      const s = strokes[i]!;
      if (s.pts.length < 2) continue;
      const mapped = s.pts.map((pt) => mapGuide(pt[0], pt[1], box, dpr));
      for (let k = 1; k < mapped.length; k++) {
        const a = mapped[k - 1]!;
        const b = mapped[k]!;
        if (distToSeg(p.x, p.y, a.x, a.y, b.x, b.y) <= 10) return { index: i, kind: "body" };
      }
    }
    return null;
  }

  function pointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {
      /* already captured */
    }
    const p = pos(e);
    lastPt.current = p;
    if (traceDev) {
      const tool = devToolRef.current;
      const box = boxRef.current;
      const dpr = dprRef.current;
      const n = unmapGuide(p.x, p.y, box, dpr);
      if (tool === "line" || tool === "freehand" || tool === "curve") {
        curveActiveRef.current = -1;
        const stroke: DevStroke = { pts: [n, n], numT: 0.16 };
        devStrokesRef.current = [...devStrokesRef.current, stroke];
        const index = devStrokesRef.current.length - 1;
        setDevSel(index);
        devDragRef.current = {
          kind: "draw",
          index,
          ox: p.x,
          oy: p.y,
          origin: [[n[0], n[1]]],
        };
        drawing.current = true;
        redraw();
        return;
      }
      const hit = hitDev(p);
      if (!hit) {
        setDevSel(-1);
        devDragRef.current = null;
        redraw();
        return;
      }
      setDevSel(hit.index);
      let kind:
        | "move"
        | "start"
        | "end"
        | "number"
        | "draw"
        | "mid"
        | "vertex"
        | "scale" =
        hit.kind === "number"
          ? "number"
          : hit.kind === "vertex"
            ? "vertex"
            : hit.kind === "scale"
              ? "scale"
              : hit.kind === "mid"
                ? "mid"
                : "move";
      let vertex: number | undefined = hit.vertex;
      const corner = hit.corner;
      if (kind === "mid") {
        const s = devStrokesRef.current[hit.index]!;
        if (s.pts.length === 2) {
          const mid = unmapGuide(p.x, p.y, box, dpr);
          s.pts = [s.pts[0]!, mid, s.pts[1]!];
          vertex = 1;
          kind = "vertex";
        }
      }
      const origin = devStrokesRef.current[hit.index]!.pts.map((pt) => [pt[0], pt[1]] as TracePt);
      devDragRef.current = { kind, index: hit.index, ox: p.x, oy: p.y, origin, vertex, corner };
      drawing.current = true;
      redraw();
      return;
    }
    if (finishedRef.current) setupCanvas("reset");
    drawing.current = true;
    drawSegment(p, p);
    redraw();
    publishCover();
  }

  function pointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const p = pos(e);
    if (traceDev) {
      const drag = devDragRef.current;
      if (!drag || !drawing.current) return;
      const box = boxRef.current;
      const dpr = dprRef.current;
      const n = unmapGuide(p.x, p.y, box, dpr);
      const s = devStrokesRef.current[drag.index];
      if (!s) return;
      if (drag.kind === "draw") {
        if (devToolRef.current === "line") {
          s.pts = [drag.origin[0]!, n];
        } else {
          const last = s.pts[s.pts.length - 1]!;
          if (Math.hypot(n[0] - last[0], n[1] - last[1]) > 0.018) s.pts.push(n);
        }
      } else if (drag.kind === "start") {
        s.pts[0] = n;
      } else if (drag.kind === "end") {
        s.pts[s.pts.length - 1] = n;
      } else if (drag.kind === "move") {
        const o = unmapGuide(drag.ox, drag.oy, box, dpr);
        const dx = n[0] - o[0];
        const dy = n[1] - o[1];
        s.pts = drag.origin.map((pt) => [
          Math.min(1, Math.max(0, pt[0] + dx)),
          Math.min(1, Math.max(0, pt[1] + dy)),
        ]);
      } else if (drag.kind === "mid") {
        const vi = drag.vertex ?? 1;
        if (s.pts[vi]) s.pts[vi] = n;
      } else if (drag.kind === "vertex") {
        const vi = drag.vertex ?? 0;
        const lastI = drag.origin.length - 1;
        if (vi === 0 || vi === lastI) {
          s.pts = drag.origin.map((pt, j) => (j === vi ? n : [pt[0], pt[1]] as TracePt));
        } else {
          const o = drag.origin[vi];
          if (!o) return;
          const dx = n[0] - o[0];
          const dy = n[1] - o[1];
          s.pts = drag.origin.map((pt, j) => {
            const w = Math.exp(-((j - vi) ** 2) / (2 * 0.85 ** 2));
            return [
              Math.min(1, Math.max(0, pt[0] + dx * w)),
              Math.min(1, Math.max(0, pt[1] + dy * w)),
            ];
          });
        } else if (drag.kind === "scale" && drag.corner) {
        s.pts = scalePts(drag.origin, drag.corner, n);
      } else if (drag.kind === "number") {
        const mapped = smoothStroke(s.pts.map((pt) => mapGuide(pt[0], pt[1], box, dpr)));
        let bestT = s.numT;
        let bestD = 1e9;
        for (let t = 0; t <= 1; t += 0.02) {
          const q = pointAlong(mapped, t);
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < bestD) {
            bestD = d;
            bestT = t;
          }
        }
        s.numT = bestT;
      }
      redraw();
      return;
    }
    if (!drawing.current || finishedRef.current) return;
    const prev = lastPt.current ?? p;
    drawSegment(prev, p);
    lastPt.current = p;
    redraw();
    publishCover();
  }

  function pointerUp() {
    if (traceDev) {
      drawing.current = false;
      lastPt.current = null;
      const drag = devDragRef.current;
      if (drag) {
        const s = devStrokesRef.current[drag.index];
        if (s && drag.kind === "draw" && (devToolRef.current === "freehand" || devToolRef.current === "curve") && s.pts.length > 4) {
          s.pts = devToolRef.current === "curve" ? fitCurve(s.pts) : chaikin(s.pts);
          if (devToolRef.current === "curve") {
            setDevTool("select");
            setDevMsg("Curve set. Drag an end — only that end moves. Inner dots pull neighbors.");
          }
        }
        if (s && s.pts.length >= 2) {
          const a = s.pts[0]!;
          const b = s.pts[s.pts.length - 1]!;
          if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.02 && s.pts.length === 2) {
            devStrokesRef.current = devStrokesRef.current.filter((_, i) => i !== drag.index);
            setDevSel(-1);
          }
        }
        persistDev();
      }
      devDragRef.current = null;
      redraw();
      return;
    }
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

      {traceDev && (
        <div className="flex flex-wrap gap-1.5">
          {(
            [
              ["select", MousePointer2, "Select"],
              ["line", Minus, "Line"],
              ["curve", Spline, "Curve"],
              ["freehand", Pencil, "Freehand"],
            ] as const
          ).map(([id, Icon, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                if (id !== "curve") curveActiveRef.current = -1;
                setDevTool(id);
                setDevMsg(
                  id === "curve"
                    ? "Curve: draw the round in one stroke. Dots appear when you let go."
                    : id === "select"
                      ? "Select: drag dots, drag the line to move, corner squares to resize. Delete key removes it."
                      : id === "line"
                        ? "Line: drag start to end."
                        : "Freehand: scribble, then Smooth if you want.",
                );
              }}
              className="pressable inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-pill)] border-2 px-3 text-sm font-bold"
              style={
                devTool === id
                  ? { borderColor: accent, color: accent, background: `${accent}18` }
                  : undefined
              }
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              const list = devStrokesRef.current;
              const idx = devSel >= 0 ? devSel : list.length === 1 ? 0 : -1;
              if (idx < 0) {
                setDevMsg("Tap a line first, then Delete.");
                return;
              }
              const next = list.filter((_, i) => i !== idx);
              devStrokesRef.current = next;
              setDevSel(next.length ? Math.min(idx, next.length - 1) : -1);
              persistDev();
              redraw();
            }}
            className="pressable inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 text-sm font-bold text-ink"
          >
            <Trash2 className="size-4" /> Delete
          </button>
          <button
            type="button"
            onClick={() => {
              if (devSel < 0) return;
              const s = devStrokesRef.current[devSel];
              if (!s || s.pts.length < 3) {
                setDevMsg("Need a line with a bend first — pull the diamond.");
                return;
              }
              s.pts = chaikin(s.pts);
              persistDev();
              redraw();
            }}
            className="pressable inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 text-sm font-bold text-ink"
          >
            <Waves className="size-4" /> Smooth
          </button>
          <button
            type="button"
            onClick={() => {
              clearDevStrokes(guideLetter);
              devStrokesRef.current = loadDevStrokes(guideLetter);
              setDevSel(-1);
              setDevMsg("Reset to app default.");
              redraw();
            }}
            className="pressable inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 text-sm font-bold text-ink"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => {
              persistDev();
              const { text, copied } = copyDevPayload(guideLetter, devStrokesRef.current);
              setDevExport(text);
              setDevMsg(
                copied
                  ? "Copied. Paste it in chat so I can make it permanent."
                  : "Clipboard blocked here — select the box below and copy.",
              );
            }}
            className="pressable inline-flex min-h-11 items-center gap-1 rounded-[var(--radius-pill)] bg-ink px-3 text-sm font-bold text-white"
          >
            <Copy className="size-4" /> Confirm
          </button>
        </div>
      )}
      {traceDev && (
        <p className="text-xs font-semibold text-ink-soft">
          {devMsg ??
            "Dev: Curve = draw the round in one stroke. Select a line + Delete key to remove it."}
        </p>
      )}
      {traceDev && devExport && (
        <textarea
          readOnly
          value={devExport}
          ref={(el) => {
            el?.focus();
            el?.select();
          }}
          onFocus={(e) => e.currentTarget.select()}
          className="h-28 w-full rounded-[var(--radius-md)] border-2 border-border bg-surface p-2 font-mono text-[11px] text-ink"
        />
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
