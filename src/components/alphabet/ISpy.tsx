import { useEffect, useMemo, useState } from "react";
import { Ear } from "lucide-react";
import { LETTERS, type LetterEntry } from "@/data/alphabet";
import { markSection } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";
import { GamePicture } from "./GamePicture";
import { LetterWord } from "./LetterWord";

export function ISpy({ entry }: { entry: LetterEntry }) {
  const [round, setRound] = useState(0);
  const target = useMemo(() => {
    return entry.words[round % entry.words.length]!;
  }, [entry, round]);
  const [found, setFound] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);

  const tiles = useMemo(() => {
    const othersHere = entry.words
      .filter((w) => w.slug !== target.slug)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((w) => ({ ...w, letter: entry.letter }));
    const outsider = LETTERS.filter((l) => l.letter !== entry.letter)
      .flatMap((l) => l.words.map((w) => ({ ...w, letter: l.letter })))
      .sort(() => Math.random() - 0.5)[0]!;
    return [...othersHere, { ...target, letter: entry.letter }, outsider].sort(
      () => Math.random() - 0.5,
    );
  }, [entry, target, round]);

  useEffect(() => {
    void speak(target.word);
  }, [target.word, round]);

  function pick(slug: string) {
    if (found) return;
    if (slug === target.slug) {
      setFound(true);
      setWrong(null);
      markSection(entry.letter, "ispy");
      void speak(`You found ${target.word}! Great eyes!`);
    } else {
      setWrong(slug);
      void speak("Keep looking!");
      setTimeout(() => setWrong(null), 600);
    }
  }

  function next() {
    setFound(false);
    setWrong(null);
    setRound((r) => r + 1);
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-sky/30 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
          <Ear className="size-3.5" /> I hear
        </p>
        <p className="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">
          Listen, then tap that picture
        </p>
        <button
          type="button"
          onClick={() => void speak(target.word)}
          className="pressable mt-2 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] px-4 text-sm font-bold text-white"
          style={{ background: entry.accent }}
        >
          <Ear className="size-4" /> Hear it again
        </button>
        {found && (
          <p className="mt-3">
            <LetterWord word={target.word} accent={entry.accent} size="md" />
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tiles.map((w) => {
          const isTarget = w.slug === target.slug && w.letter === entry.letter;
          const showWin = found && isTarget;
          const showMiss = wrong === w.slug;
          return (
            <button
              key={`${round}-${w.letter}-${w.slug}`}
              type="button"
              onClick={() => pick(w.slug)}
              className={cn(
                "pressable overflow-hidden rounded-[var(--radius-lg)] border-2 bg-surface shadow-[var(--shadow-card)]",
                showWin && "border-success ring-4 ring-success/30",
                showMiss && "border-primary ring-4 ring-primary/25",
                !showWin && !showMiss && "border-border",
              )}
              aria-label={found && isTarget ? w.word : "Picture"}
            >
              <div className="aspect-square overflow-hidden bg-surface-soft">
                <GamePicture
                  letter={w.letter}
                  slug={w.slug}
                  word={w.word}
                  revealWord={showWin}
                />
              </div>
            </button>
          );
        })}
      </div>

      {found && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={next}
            className="pressable rounded-[var(--radius-pill)] px-6 py-3 font-display font-bold text-white"
            style={{ background: entry.accent }}
          >
            Next listen
          </button>
        </div>
      )}
    </div>
  );
}
