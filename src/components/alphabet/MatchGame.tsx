import { useMemo, useState } from "react";
import { LETTERS, posterPath, type LetterEntry } from "@/data/alphabet";
import { markSection } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";

function pickChoices(entry: LetterEntry) {
  // Rotate among all 6 words so match never feels stuck on word #1
  const correct = entry.words[Math.floor(Math.random() * entry.words.length)]!;
  const others = LETTERS.filter((l) => l.letter !== entry.letter)
    .flatMap((l) => l.words.map((w) => ({ ...w, letter: l.letter })))
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  const options = [
    { ...correct, letter: entry.letter, correct: true },
    ...others.map((o) => ({ ...o, correct: false })),
  ].sort(() => Math.random() - 0.5);
  return options;
}

function PosterThumb({
  letter,
  slug,
  word,
}: {
  letter: string;
  slug: string;
  word: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-sky/40 to-lavender/40 p-3">
        <span className="font-display text-4xl font-bold text-ink">{letter}</span>
        <span className="text-center text-sm font-bold text-ink-soft">{word}</span>
      </div>
    );
  }
  return (
    <img
      src={posterPath(letter, slug)}
      alt={word}
      className="h-full w-full object-cover"
      loading="eager"
      onError={() => setFailed(true)}
    />
  );
}

export function MatchGame({ entry }: { entry: LetterEntry }) {
  const [round, setRound] = useState(0);
  const options = useMemo(() => pickChoices(entry), [entry, round]);
  const [picked, setPicked] = useState<string | null>(null);
  const [won, setWon] = useState(false);

  function choose(slug: string, correct: boolean) {
    if (picked) return;
    setPicked(slug);
    if (correct) {
      setWon(true);
      markSection(entry.letter, "match");
      speak(`Yes! ${options.find((o) => o.slug === slug)?.word} starts with ${entry.letter}!`);
    } else {
      speak("Try again!");
      setTimeout(() => setPicked(null), 700);
    }
  }

  function next() {
    setPicked(null);
    setWon(false);
    setRound((r) => r + 1);
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="font-display text-xl font-bold text-ink sm:text-2xl">
          Which picture starts with{" "}
          <span style={{ color: entry.accent }}>{entry.letter}</span>?
        </p>
        <p className="mt-1 text-sm font-medium text-muted">Tap the matching poster</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((opt) => {
          const selected = picked === opt.slug;
          const showCorrect = won && opt.correct;
          const showWrong = selected && !opt.correct;
          return (
            <button
              key={`${round}-${opt.letter}-${opt.slug}`}
              type="button"
              onClick={() => choose(opt.slug, opt.correct)}
              className={cn(
                "pressable overflow-hidden rounded-[var(--radius-lg)] border-2 bg-surface shadow-[var(--shadow-card)]",
                showCorrect && "border-success ring-4 ring-success/30",
                showWrong && "border-primary ring-4 ring-primary/20",
                !showCorrect && !showWrong && "border-border",
              )}
            >
              <div className="aspect-square overflow-hidden bg-surface-soft">
                <PosterThumb letter={opt.letter} slug={opt.slug} word={opt.word} />
              </div>
              <div className="p-2 text-center text-sm font-bold text-ink">{opt.word}</div>
            </button>
          );
        })}
      </div>
      {won && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={next}
            className="pressable rounded-[var(--radius-pill)] px-6 py-3 font-display font-bold text-white"
            style={{ background: entry.accent }}
          >
            Play again
          </button>
        </div>
      )}
    </div>
  );
}
