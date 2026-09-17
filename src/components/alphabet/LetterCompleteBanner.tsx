import { Check, Star } from "lucide-react";
import {
  getLetterChecklist,
  useProgress,
  type LetterChecklist,
} from "@/lib/progress";
import { letterHeroPath } from "@/data/alphabet";

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
  const check = getLetterChecklist(letter, progress);
  const done = progress.completed.includes(letter.toUpperCase());

  return (
    <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
      <CheckItem label={`${check.words}/${check.wordsTotal}`} ok={check.words >= check.wordsTotal} accent={accent} />
      <CheckItem label="Sound" ok={check.sound} accent={accent} />
      <CheckItem label="Trace" ok={check.trace} accent={accent} />
      <CheckItem label="Game" ok={check.game} accent={accent} />
      {done && (
        <span className="inline-flex shrink-0 items-center gap-0.5 text-[10px] font-bold text-ink">
          <Star className="size-3 fill-star text-star" />
        </span>
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
    <span className="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-bold text-ink-soft">
      {ok ? (
        <Check className="size-3.5 shrink-0" strokeWidth={3} style={{ color: accent }} />
      ) : (
        <span className="size-3 shrink-0 rounded-full border border-current opacity-35" />
      )}
      {label}
    </span>
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
