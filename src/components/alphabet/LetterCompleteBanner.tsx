import { Check, Sparkles, Star } from "lucide-react";
import {
  getLetterChecklist,
  useProgress,
  type LetterChecklist,
} from "@/lib/progress";
import { letterHeroPath } from "@/data/alphabet";
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
  const check = getLetterChecklist(letter, progress);
  const done = progress.completed.includes(letter.toUpperCase());

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border-2 p-3 sm:p-4",
        done ? "border-success/40 bg-grass/30" : "border-border bg-surface-soft",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-muted">
          {done ? (
            <>
              <Sparkles className="size-3.5 text-star" /> Letter complete!
            </>
          ) : (
            <>Finish letter checklist</>
          )}
        </p>
        <span className="size-10 overflow-hidden rounded-xl border-2 border-white/70 shadow-sm" aria-hidden>
          <img
            src={letterHeroPath(letter)}
            alt=""
            className="size-full object-cover"
          />
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <CheckItem
          label={`Words ${check.words}/${check.wordsTotal}`}
          ok={check.words >= check.wordsTotal}
          accent={accent}
        />
        <CheckItem label="Sound" ok={check.sound} accent={accent} />
        <CheckItem label="Trace" ok={check.trace} accent={accent} />
        <CheckItem label="A game" ok={check.game} accent={accent} />
      </div>
      {done && (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-bold text-ink">
          <Star className="size-4 fill-star text-star" /> Sticker earned — nice work!
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
        "flex min-h-10 items-center gap-1.5 rounded-xl border-2 px-2 py-1.5 text-xs font-bold",
        ok ? "border-transparent text-white" : "border-border bg-surface text-ink-soft",
      )}
      style={ok ? { background: accent } : undefined}
    >
      {ok ? <Check className="size-3.5 shrink-0" /> : <span className="size-3.5 shrink-0 rounded-full border-2 border-current opacity-40" />}
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
