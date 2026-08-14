import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import type { LetterEntry } from "@/data/alphabet";
import { markSection } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";
import { GamePicture } from "./GamePicture";

type Card = {
  id: string;
  pair: string;
  word: string;
  slug: string;
};

function buildDeck(entry: LetterEntry): Card[] {
  const picks = [...entry.words].sort(() => Math.random() - 0.5).slice(0, 3);
  const cards: Card[] = [];
  for (const w of picks) {
    cards.push({ id: `${w.slug}-a`, pair: w.slug, word: w.word, slug: w.slug });
    cards.push({ id: `${w.slug}-b`, pair: w.slug, word: w.word, slug: w.slug });
  }
  return cards.sort(() => Math.random() - 0.5);
}

/** Picture ↔ picture memory. Print appears only after a match. */
export function MemoryMatch({ entry }: { entry: LetterEntry }) {
  const [round, setRound] = useState(0);
  const deck = useMemo(() => buildDeck(entry), [entry, round]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [lock, setLock] = useState(false);
  const [moves, setMoves] = useState(0);

  const won = matched.length === 3;

  function flip(id: string) {
    if (
      lock ||
      flipped.includes(id) ||
      matched.some((p) => deck.find((c) => c.id === id)?.pair === p)
    ) {
      return;
    }
    const card = deck.find((c) => c.id === id);
    if (!card) return;

    if (flipped.length === 0) {
      setFlipped([id]);
      return;
    }
    if (flipped.length === 1) {
      const first = deck.find((c) => c.id === flipped[0]);
      if (!first) return;
      setFlipped([flipped[0]!, id]);
      setMoves((m) => m + 1);
      setLock(true);

      if (first.pair === card.pair && first.id !== card.id) {
        setTimeout(() => {
          setMatched((m) => {
            const next = [...m, first.pair];
            if (next.length >= 3) {
              markSection(entry.letter, "memory");
              void speak("You matched them all! Super memory!");
            } else {
              void speak(`Yes! ${card.word}!`);
            }
            return next;
          });
          setFlipped([]);
          setLock(false);
        }, 450);
      } else {
        setTimeout(() => {
          setFlipped([]);
          setLock(false);
        }, 750);
      }
    }
  }

  function reset() {
    setRound((r) => r + 1);
    setFlipped([]);
    setMatched([]);
    setLock(false);
    setMoves(0);
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="font-display text-xl font-bold text-ink sm:text-2xl">
          Find the matching pictures
        </p>
        <p className="mt-1 text-sm font-medium text-muted">
          Same picture twice · Moves: {moves}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {deck.map((card) => {
          const isUp = flipped.includes(card.id) || matched.includes(card.pair);
          const isMatch = matched.includes(card.pair);
          return (
            <button
              key={`${round}-${card.id}`}
              type="button"
              onClick={() => flip(card.id)}
              disabled={lock && !isUp}
              className={cn(
                "pressable relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] border-2 shadow-[var(--shadow-card)]",
                isMatch ? "border-success ring-2 ring-success/30" : "border-border",
              )}
              aria-label={isUp ? card.word : "Hidden card"}
            >
              {isUp ? (
                <GamePicture
                  letter={entry.letter}
                  slug={card.slug}
                  word={card.word}
                  revealWord={isMatch}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-ink text-3xl font-bold text-white">
                  ?
                </div>
              )}
            </button>
          );
        })}
      </div>

      {won && (
        <div className="flex flex-col items-center gap-2">
          <p className="font-display text-lg font-bold text-success">All pairs found!</p>
          <button
            type="button"
            onClick={reset}
            className="pressable inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-pill)] px-5 py-3 font-bold text-white"
            style={{ background: entry.accent }}
          >
            <Shuffle className="size-4" /> Play again
          </button>
        </div>
      )}
    </div>
  );
}
