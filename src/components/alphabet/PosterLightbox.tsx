import { useEffect } from "react";
import { X, Volume2 } from "lucide-react";
import type { WordEntry } from "@/data/alphabet";
import { LetterWord } from "./LetterWord";
import { speakWord } from "@/lib/speak";

export function PosterLightbox({
  letter,
  accent,
  hue,
  word,
  imageSrc,
  onClose,
}: {
  letter: string;
  accent: string;
  hue: string;
  word: WordEntry;
  imageSrc: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    speakWord(word.word);
  }, [word.word]);

  return (
    <div
      className="modal-scrim fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${word.word} poster`}
      onClick={onClose}
    >
      <div
        className="pop-in relative flex max-h-[min(92dvh,900px)] w-full max-w-lg flex-col overflow-hidden rounded-[var(--radius-xl)] border-2 border-border bg-surface shadow-[var(--shadow-float)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-surface text-ink shadow-md"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
        <div
          className="poster-frame relative aspect-[3/4] w-full overflow-hidden"
          style={{ background: `linear-gradient(160deg, ${hue}44, var(--color-surface))` }}
        >
          <img
            src={imageSrc}
            alt=""
            className="poster-art h-full w-full object-cover"
            decoding="async"
            fetchPriority="high"
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = "0";
            }}
          />
          <div
            className="absolute left-4 top-4 flex size-14 items-center justify-center rounded-2xl font-display text-3xl font-bold text-white shadow-lg"
            style={{ background: accent }}
          >
            {letter.toUpperCase()}
          </div>
        </div>
        <div className="space-y-3 p-5">
          <LetterWord word={word.word} accent={accent} size="xl" />
          <button
            type="button"
            onClick={() => speakWord(word.word)}
            className="pressable inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-5 py-3 font-bold text-white"
            style={{ background: accent }}
          >
            <Volume2 className="size-5" /> Hear the word
          </button>
        </div>
      </div>
    </div>
  );
}
