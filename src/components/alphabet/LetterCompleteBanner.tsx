import { Check, Star } from "lucide-react";
import {
  getLetterChecklist,
  useProgress,
  type LetterChecklist,
} from "@/lib/progress";
import { letterHeroPath } from "@/data/alphabet";
import { useCaseMode } from "@/lib/case-mode";
import { cn } from "@/lib/utils";

const STICKER_EMOJI: Record<string, string> = {
  A: "🍎",
  B: "🐻",
  C: "🐱",
  D: "🐶",
  E: "🐘",
  F: "🦊",
  G: "🦒",
  H: "🐴",
  I: "🍦",
  J: "🧃",
  K: "🪁",
  L: "🦁",
  M: "🐵",
  N: "🪺",
  O: "🦉",
  P: "🐧",
  Q: "👑",
  R: "🚀",
  S: "⭐",
  T: "🐯",
  U: "☂️",
  V: "🎻",
  W: "🐋",
  X: "📦",
  Y: "🪀",
  Z: "🦓",
};

export function stickerFor(letter: string) {
  return STICKER_EMOJI[letter.toUpperCase()] ?? "⭐";
}

export function LetterCompleteBanner({
  letter,
  accent,
}: {
  letter: string;
  accent: string;
}) {
  const progress = useProgress();
  const { mode } = useCaseMode();
  const check = getLetterChecklist(letter, progress);
  const done = progress.completed.includes(letter.toUpperCase());

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border px-2 py-1.5",
        done ? "border-success/40 bg-grass/30" : "border-border bg-surface-soft",
      )}
    >
      <div className="flex items-center gap-1.5">
        <p className="hidden shrink-0 text-[10px] font-bold uppercase tracking-wide text-muted sm:block">
          {done ? "Done" : "To do"}
        </p>
        <div className="grid min-w-0 flex-1 grid-cols-4 gap-1">
          <CheckItem
            label={`${check.words}/${check.wordsTotal}`}
            ok={check.words >= check.wordsTotal}
            accent={accent}
          />
          <CheckItem label="Sound" ok={check.sound} accent={accent} />
          <CheckItem label="Trace" ok={check.trace} accent={accent} />
          <CheckItem label="Game" ok={check.game} accent={accent} />
        </div>
        <span className="size-7 shrink-0 overflow-hidden rounded-lg border border-white/70" aria-hidden>
          <img
            src={letterHeroPath(letter, mode)}
            alt=""
            className="size-full object-cover"
          />
        </span>
      </div>
      {done && (
        <p className="mt-1 flex items-center gap-1 text-[11px] font-bold text-ink">
          <Star className="size-3 fill-star text-star" /> Sticker earned
        </p>
      )}
    </div>
  );
}

function CheckItem({
  label,
  ok,
  accent,
}: {
  label: string;
  ok: boolean;
  accent: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-7 items-center justify-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-bold leading-none",
        ok ? "border-transparent text-white" : "border-border bg-surface text-ink-soft",
      )}
      style={ok ? { background: accent } : undefined}
    >
      {ok ? <Check className="size-3 shrink-0" /> : <span className="size-2 shrink-0 rounded-full border border-current opacity-40" />}
      {label}
    </div>
  );
}

export function StickerShelf() {
  const { stickers, completed } = useProgress();
  const list = stickers.length ? stickers : completed;
  if (!list.length) {
    return (
      <p className="text-sm font-medium text-muted">
        Finish a letter’s checklist to earn your first sticker!
      </p>
    );
  }
  return (
    <div className="flex flex-wrap gap-2">
      {list.map((L) => (
        <div
          key={L}
          className="relative size-14 overflow-hidden rounded-2xl border-2 border-border bg-surface shadow-[var(--shadow-card)]"
          title={`Letter ${L}`}
        >
          <img src={letterHeroPath(L)} alt="" className="size-full object-cover" />
          <span className="absolute bottom-0.5 right-1 text-[10px] font-black text-white drop-shadow">
            {L}
          </span>
        </div>
      ))}
    </div>
  );
}

export type { LetterChecklist };
