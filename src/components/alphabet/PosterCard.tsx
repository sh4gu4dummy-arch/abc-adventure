import { useEffect, useState } from "react";
import { Play, Volume2 } from "lucide-react";
import type { CaseKind, WordEntry } from "@/data/alphabet";
import { displayGlyph, displayWord, wordBuddyPath } from "@/data/alphabet";
import { LetterWord } from "./LetterWord";
import { speakWord } from "@/lib/speak";
import { cn } from "@/lib/utils";

export function PosterCard({
  letter,
  accent,
  hue,
  word,
  imageSrc,
  onOpen,
  seen,
  compact,
  requiresVideo,
  caseKind = "upper",
}: {
  letter: string;
  accent: string;
  hue: string;
  word: WordEntry;
  imageSrc: string;
  onOpen?: () => void;
  seen?: boolean;
  compact?: boolean;
  requiresVideo?: boolean;
  caseKind?: CaseKind;
}) {
  const fallback = wordBuddyPath(letter, word.slug);
  const [src, setSrc] = useState(imageSrc);
  const [imgOk, setImgOk] = useState(true);

  useEffect(() => {
    setSrc(imageSrc);
    setImgOk(true);
  }, [imageSrc]);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "pressable group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border-2 border-border bg-surface text-left shadow-[var(--shadow-card)]",
        "cv-auto",
      )}
      style={{ boxShadow: `0 10px 0 0 color-mix(in oklab, ${hue} 35%, transparent)` }}
    >
      <div
        className={cn(
          "poster-frame relative w-full overflow-hidden",
          compact ? "aspect-[4/5]" : "aspect-[3/4]",
        )}
        style={{
          background: `linear-gradient(160deg, ${hue}33, ${hue}11 60%, var(--color-surface))`,
        }}
      >
        {imgOk ? (
          <img
            src={src}
            alt={`Poster for ${word.word}`}
            className="poster-art h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 45vw, 200px"
            onError={() => {
              if (src !== fallback) setSrc(fallback);
              else setImgOk(false);
            }}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4">
            <span
              className="font-display text-6xl font-bold opacity-90"
              style={{ color: accent }}
            >
              {displayGlyph(letter, caseKind)}
            </span>
            <span className="text-center text-sm font-semibold text-ink-soft">{displayWord(word.word, caseKind)}</span>
          </div>
        )}
        <div
          className="absolute left-2 top-2 flex size-10 items-center justify-center rounded-full font-display text-xl font-bold text-white shadow-md"
          style={{ background: accent }}
          aria-hidden
        >
          {displayGlyph(letter, caseKind)}
        </div>
        {requiresVideo && !seen && (
          <div
            className="absolute bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md"
            style={{ background: accent }}
          >
            <Play className="size-3 fill-white" /> Video
          </div>
        )}
        {seen && (
          <div className="absolute right-2 top-2 rounded-full bg-success px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            Seen
          </div>
        )}
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            speakWord(word.word);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              speakWord(word.word);
            }
          }}
          className="absolute bottom-2 right-2 flex size-9 items-center justify-center rounded-full border-2 border-white/70 bg-surface/90 text-ink shadow-sm"
          aria-label={`Say ${word.word}`}
        >
          <Volume2 className="size-4" />
        </span>
      </div>
      <div className="px-2.5 py-2 sm:px-3 sm:py-2.5">
        <LetterWord
          word={displayWord(word.word, caseKind)}
          accent={accent}
          size={compact ? "sm" : "md"}
          className="block w-full text-center leading-tight break-words"
        />
      </div>
    </button>
  );
}
