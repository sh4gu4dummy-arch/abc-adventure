import { useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import type { LetterEntry } from "@/data/alphabet";
import { posterPath } from "@/data/alphabet";
import { markSection } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";

type Card = {
  id: string;
  pair: string;
  kind: "img" | "word";
  word: string;
  slug: string;
};

function buildDeck(entry: LetterEntry): Card[] {
  // 3 pairs from the 6 words (keeps the board phone-friendly)
  const picks = [...entry.words].sort(() => Math.random() - 0.5).slice(0, 3);
  const cards: Card[] = [];
  for (const w of picks) {
    cards.push({
      id: `${w.slug}-img`,
      pair: w.slug,
      kind: "img",
      word: w.word,
      slug: w.slug,
    });
    cards.push({
      id: `${w.slug}-word`,
      pair: w.slug,
      kind: "word",
      word: w.word,
      slug: w.slug,
    });
  }
  return cards.sort(() => Math.random() - 0.5);
}

function CardImage({
  letter,
  slug,
  word,
  hue,
  accent,
}: {
  letter: string;
  slug: string;
  word: string;
  hue: string;
  accent: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        className="flex h-full w-full flex-col items-center justify-center gap-1 p-2"
        style={{ background: `linear-gradient(145deg, ${hue}, ${accent})` }}
      >
        <span className="font-display text-3xl font-bold text-white">{letter}</span>
        <span className="text-center text-sm font-bold text-white">{word}</span>
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

/**
 * Memory pairs: match each word card with its poster (3 pairs from 6 words).
 */
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
        <p className="font-display text-xl font-bold text-ink sm:text-2xl">Memory pairs</p>
        <p className="mt-1 text-sm font-medium text-muted">
          Match each word with its picture · Moves: {moves}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {deck.map((card) => {
          const isUp = flipped.includes(card.id) || matched.includes(card.pair);
          return (
            <button
              key={`${round}-${card.id}`}
              type="button"
              onClick={() => flip(card.id)}
              disabled={lock && !isUp}
              className={cn(
                "pressable relative aspect-[3/4] overflow-hidden rounded-[var(--radius-md)] border-2 shadow-[var(--shadow-card)]",
                matched.includes(card.pair)
                  ? "border-success ring-2 ring-success/30"
                  : "border-border",
              )}
              aria-label={isUp ? card.word : "Hidden card"}
            >
              {isUp ? (
                card.kind === "img" ? (
                  <CardImage
                    letter={entry.letter}
                    slug={card.slug}
                    word={card.word}
                    hue={entry.hue}
                    accent={entry.accent}
                  />
                ) : (
                  <div
                    className="flex h-full w-full flex-col items-center justify-center gap-1 p-2"
                    style={{
                      background: `linear-gradient(145deg, ${entry.hue}, ${entry.accent})`,
                    }}
                  >
                    <span className="font-display text-3xl font-bold text-white sm:text-4xl">
                      {entry.letter}
                    </span>
                    <span className="text-center text-sm font-bold text-white sm:text-base">
                      {card.word}
                    </span>
                  </div>
                )
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
