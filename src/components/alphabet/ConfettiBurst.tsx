import { useMemo, type CSSProperties } from "react";
import { particleBudget } from "@/lib/gfx-pref";

const COLORS = ["#FF6B6B", "#4DABF7", "#FFD43B", "#69DB7C", "#DA77F2", "#FF922B", "#FFFFFF"];

type PieceStyle = CSSProperties & { ["--cx"]?: string };

/**
 * Lightweight CSS confetti for letter-complete celebrations.
 * Piece count follows graphics mode (fewer on Lite). Transform-only animation.
 */
export function ConfettiBurst({ active }: { active: boolean; durationMs?: number }) {
  const count = particleBudget();

  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 17 + 7) % 100}%`,
        delay: `${(i % 8) * 0.04}s`,
        color: COLORS[i % COLORS.length]!,
        rot: `${(i * 47) % 360}deg`,
        size: 6 + (i % 4) * 2,
        drift: ((i * 13) % 40) - 20,
      })),
    [count],
  );

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
      aria-hidden
    >
      {pieces.map((p) => {
        const style: PieceStyle = {
          left: p.left,
          width: p.size,
          height: p.size * 1.4,
          background: p.color,
          animationDelay: p.delay,
          ["--cx"]: `${p.drift}px`,
          transform: `rotate(${p.rot})`,
        };
        return (
          <span
            key={p.id}
            className="confetti-piece absolute top-[-12px] rounded-sm"
            style={style}
          />
        );
      })}
    </div>
  );
}
