import { useMemo, useState } from "react";
import type { LetterEntry } from "@/data/alphabet";
import { markSection } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type Round = "lower" | "upper";

function buildTiles(entry: LetterEntry, round: Round) {
  const target = round === "lower" ? entry.letter.toLowerCase() : entry.letter.toUpperCase();
  const distractors =
    round === "lower"
      ? [entry.letter.toUpperCase(), "o", "c", "e", "s", "l"]
      : [entry.letter.toLowerCase(), "O", "C", "E", "S", "L"];
  const pool = [target, target, ...distractors.slice(0, 6)];
  // shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j]!, pool[i]!];
  }
  return {
    target,
    tiles: pool.map((ch, i) => ({ id: `${ch}-${i}-${round}`, ch })),
  };
}

export function CaseHunt({ entry }: { entry: LetterEntry }) {
  const [round, setRound] = useState<Round>("lower");
  const [seed, setSeed] = useState(0);
  const { target, tiles } = useMemo(
    () => buildTiles(entry, round),
    [entry, round, seed],
  );
  const [found, setFound] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [roundDone, setRoundDone] = useState(false);
  const [bothDone, setBothDone] = useState(false);

  const need = 2;

  async function pick(id: string, ch: string) {
    if (roundDone || found.includes(id)) return;
    if (ch === target) {
      const next = [...found, id];
      setFound(next);
      // One voice at a time — await so we never stack
      await speak(
        ch === ch.toUpperCase()
          ? `Capital ${entry.letter}`
          : `Little ${entry.letter.toLowerCase()}`,
      );
      if (next.length >= need) {
        setRoundDone(true);
        if (round === "lower") {
          await speak("Great! Now find the big capital letters!");
        } else {
          markSection(entry.letter, "cases");
          setBothDone(true);
          await speak(`You found big and little ${entry.letter}! Awesome!`);
        }
      }
    } else {
      setWrong(id);
      void speak("Try again!");
      setTimeout(() => setWrong(null), 450);
    }
  }

  function nextRound() {
    if (round === "lower") {
      setRound("upper");
      setFound([]);
      setRoundDone(false);
      setSeed((s) => s + 1);
    } else {
      setRound("lower");
      setFound([]);
      setRoundDone(false);
      setBothDone(false);
      setSeed((s) => s + 1);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-4 text-center">
      <div>
        <p className="font-display text-xl font-bold text-ink sm:text-2xl">
          Find the {round === "lower" ? "little" : "big"}{" "}
          <span style={{ color: entry.accent }}>{target}</span>
        </p>
        <p className="mt-1 text-sm font-semibold text-muted">
          Tap {need} matching letters · {found.length}/{need}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {tiles.map((tile) => {
          const isFound = found.includes(tile.id);
          const isWrong = wrong === tile.id;
          return (
            <button
              key={tile.id}
              type="button"
              disabled={isFound || roundDone}
              onClick={() => void pick(tile.id, tile.ch)}
              className={cn(
                "pressable flex aspect-square items-center justify-center rounded-[1.1rem] border-2 font-display text-3xl font-bold shadow-sm transition-colors sm:text-4xl",
                isFound && "border-success bg-success/15 text-success",
                isWrong && "border-danger bg-danger/10 text-danger",
                !isFound && !isWrong && "border-border bg-surface text-ink hover:bg-surface-soft",
              )}
            >
              {tile.ch}
            </button>
          );
        })}
      </div>

      {roundDone && (
        <div className="space-y-3">
          <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-success/15 px-4 py-2 font-bold text-success">
            <Check className="size-4" /> Round complete!
          </p>
          {!bothDone ? (
            <button
              type="button"
              onClick={nextRound}
              className="pressable mx-auto flex min-h-12 items-center rounded-[var(--radius-pill)] px-6 py-3 font-bold text-white"
              style={{ background: entry.accent }}
            >
              Next: capital letters
            </button>
          ) : (
            <p className="font-display text-lg font-bold text-ink">
              You know big and little {entry.letter}!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
