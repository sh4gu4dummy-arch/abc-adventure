import { useCallback, useEffect, useRef, useState } from "react";
import { Eraser, Check } from "lucide-react";
import { markSection } from "@/lib/progress";
import { getGfxSnapshot } from "@/lib/gfx-pref";

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
  const [hasInk, setHasInk] = useState(false);
  const [done, setDone] = useState(false);
  const guideLetter = letter.toUpperCase();

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    // Cap DPR lower on Lite — half the pixels, still looks crisp on phones
    const cap = getGfxSnapshot().resolved === "lite" ? 1.25 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, cap);
    const w = parent.clientWidth;
    const h = Math.min(Math.max(w * 0.85, 240), 420);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawGuide(ctx, w, h, guideLetter, accent);
  }, [guideLetter, accent]);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  function drawGuide(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    L: string,
    color: string,
  ) {
    ctx.clearRect(0, 0, w, h);
    const dark = document.documentElement.classList.contains("theme-dark");
    ctx.fillStyle = dark ? "#1e2030" : "#fffdf9";
    ctx.fillRect(0, 0, w, h);

    // ruled lines
    ctx.strokeStyle = dark ? "rgba(80, 84, 110, 0.9)" : "rgba(240, 217, 200, 0.9)";
    ctx.lineWidth = 1;
    for (let y = h * 0.25; y < h; y += h * 0.2) {
      ctx.beginPath();
      ctx.moveTo(16, y);
      ctx.lineTo(w - 16, y);
      ctx.stroke();
    }

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.18;
    ctx.font = `700 ${Math.floor(h * 0.62)}px Fredoka, Nunito, system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(L, w / 2, h / 2 + 4);
    ctx.globalAlpha = 1;

    // dashed outline
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.strokeText(L, w / 2, h / 2 + 4);
    ctx.setLineDash([]);
    ctx.globalAlpha = 1;
  }

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function pointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (done) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    drawing.current = true;
    canvas.setPointerCapture(e.pointerId);
    const p = pos(e);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.strokeStyle = accent;
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  function pointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current || done) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = pos(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    setHasInk(true);
  }

  function pointerUp() {
    drawing.current = false;
  }

  function clear() {
    setHasInk(false);
    setDone(false);
    resize();
  }

  function finish() {
    markSection(letter, "trace");
    setDone(true);
    onDone?.();
  }

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[var(--radius-lg)] border-2 border-dashed border-border shadow-[var(--shadow-card)]">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none"
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onPointerUp={pointerUp}
          onPointerCancel={pointerUp}
          aria-label={`Trace the letter ${guideLetter}`}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={clear}
          className="pressable inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-4 text-sm font-bold"
        >
          <Eraser className="size-4" /> Clear
        </button>
        <button
          type="button"
          onClick={finish}
          disabled={!hasInk || done}
          className="pressable inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-success px-4 text-sm font-bold text-white disabled:opacity-40"
        >
          <Check className="size-4" /> {done ? "Traced!" : "I traced it!"}
        </button>
      </div>
    </div>
  );
}
