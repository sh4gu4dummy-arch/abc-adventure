import { useEffect, useMemo, useState } from "react";
import { Volume2 } from "lucide-react";
import { displayWord, soundCueForWord, wordsForCase, type CaseKind, type LetterEntry } from "@/data/alphabet";
import { markSection } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";
import { GamePicture } from "./GamePicture";
import { LetterWord } from "./LetterWord";

const ROUNDS_TO_WIN = 3;

function pickChoices(entry: LetterEntry, used: string[], caseKind: CaseKind) {
  const words = wordsForCase(entry, caseKind);
  const pool = words.filter((w) => !used.includes(w.slug));
  const correct = (pool.length ? pool : words)[
    Math.floor(Math.random() * (pool.length || words.length))
  ]!;
  const others = words.filter((w) => w.slug !== correct.slug);
  return [
    { ...correct, letter: entry.letter, correct: true },
    ...others.map((o) => ({ ...o, letter: entry.letter, correct: false })),
  ].sort(() => Math.random() - 0.5);
}

export function MatchGame({
  entry,
  caseKind = "upper",
}: {
  entry: LetterEntry;
  caseKind?: CaseKind;
}) {
  const [round, setRound] = useState(0);
  const [wins, setWins] = useState(0);
  const [used, setUsed] = useState<string[]>([]);
  const options = useMemo(
    () => pickChoices(entry, used, caseKind),
    [entry, round, caseKind],
  );
  const target = options.find((o) => o.correct) ?? options[0]!;
  const cue = soundCueForWord(entry, target.word);
  const [picked, setPicked] = useState<string | null>(null);
  const [wonRound, setWonRound] = useState(false);

  const finished = wins >= ROUNDS_TO_WIN;

  useEffect(() => {
    if (finished) return;
    void speak(cue);
  }, [cue, round, finished]);

  function choose(slug: string, correct: boolean, word: string) {
    if (picked || finished) return;
    setPicked(slug);
    if (correct) {
      setWonRound(true);
      const nextWins = wins + 1;
      setWins(nextWins);
      setUsed((u) => [...u, slug]);
      if (nextWins >= ROUNDS_TO_WIN) {
        markSection(entry.letter, "match");
        void speak(`Yes! ${word} starts with ${entry.letter}!`);
      } else {
        void speak(`Yes! ${word}!`);
      }
    } else {
      void speak("Try again!");
      setTimeout(() => setPicked(null), 700);
    }
  }

  function next() {
    setPicked(null);
    setWonRound(false);
    setRound((r) => r + 1);
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="font-display text-xl font-bold text-ink sm:text-2xl">
          Hear the sound. Tap the picture.
        </p>
        <button
          type="button"
          onClick={() => void speak(cue)}
          className="pressable mt-2 inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] px-4 text-sm font-bold text-white"
          style={{ background: entry.accent }}
        >
          <Volume2 className="size-4" /> Hear it again
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map((opt) => {
          const selected = picked === opt.slug;
          const showCorrect = wonRound && opt.correct;
          const showWrong = selected && !opt.correct;
          return (
            <button
              key={`${round}-${opt.letter}-${opt.slug}`}
              type="button"
              onClick={() => choose(opt.slug, opt.correct, opt.word)}
              className={cn(
                "pressable overflow-hidden rounded-[var(--radius-lg)] border-2 bg-surface shadow-[var(--shadow-card)]",
                showCorrect && "border-success ring-4 ring-success/30",
                showWrong && "border-primary ring-4 ring-primary/20",
                !showCorrect && !showWrong && "border-border",
              )}
              aria-label={opt.word}
            >
              <div className="aspect-square overflow-hidden bg-surface-soft">
                <GamePicture
                  letter={opt.letter}
                  slug={opt.slug}
                  word={opt.word}
                />
              </div>
              <div className="p-2 text-center">
                <LetterWord
                  word={displayWord(opt.word, caseKind)}
                  letter={entry.letter}
                  accent={entry.accent}
                  size="sm"
                />
              </div>
            </button>
          );
        })}
      </div>

      {wonRound && !finished && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={next}
            className="pressable rounded-[var(--radius-pill)] px-6 py-3 font-display font-bold text-white"
            style={{ background: entry.accent }}
          >
            Next sound
          </button>
        </div>
      )}
      {finished && (
        <p className="text-center font-display text-lg font-bold text-success">
          You matched the sound {ROUNDS_TO_WIN} times!
        </p>
      )}
    </div>
  );
}
