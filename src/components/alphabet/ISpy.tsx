import { useMemo, useState } from "react";
import { posterPath, type LetterEntry } from "@/data/alphabet";
import { markSection } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";

export function ISpy({ entry }: { entry: LetterEntry }) {
  const [round, setRound] = useState(0);
  const target = useMemo(() => {
    const idx = round % entry.words.length;
    return entry.words[idx]!;
  }, [entry, round]);
  const [found, setFound] = useState(false);
  const [wrong, setWrong] = useState<string | null>(null);

  const tiles = useMemo(() => {
    return [...entry.words].sort(() => Math.random() - 0.5);
  }, [entry, round]);

  function pick(slug: string) {
    if (found) return;
    if (slug === target.slug) {
      setFound(true);
      setWrong(null);
      markSection(entry.letter, "ispy");
      speak(`You found ${target.word}! Great eyes!`);
    } else {
      setWrong(slug);
      speak("Keep looking!");
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
          <Eye className="size-3.5" /> I Spy
        </p>
        <p className="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">
          I spy with my little eye something that starts with{" "}
          <span style={{ color: entry.accent }}>{entry.letter}</span>…
        </p>
        <p className="mt-2 text-lg font-semibold text-ink-soft">
          Find the{" "}
          <span className="font-display font-bold" style={{ color: entry.accent }}>
            {target.word}
          </span>
          !
        </p>
        <p className="mt-1 text-sm font-medium text-muted">{target.hint}</p>
      </div>

      <div className="posters-grid">
        {tiles.map((w) => {
          const isTarget = w.slug === target.slug;
          const showWin = found && isTarget;
          const showMiss = wrong === w.slug;
          return (
            <button
              key={`${round}-${w.slug}`}
              type="button"
              onClick={() => pick(w.slug)}
              className={cn(
                "pressable overflow-hidden rounded-[var(--radius-lg)] border-2 bg-surface shadow-[var(--shadow-card)]",
                showWin && "border-success ring-4 ring-success/30",
                showMiss && "border-primary ring-4 ring-primary/25",
                !showWin && !showMiss && "border-border",
              )}
              aria-label={found || isTarget ? w.word : "Poster to find"}
            >
              <div className="aspect-square overflow-hidden bg-surface-soft">
                <img
                  src={posterPath(entry.letter, w.slug)}
                  alt={found ? w.word : ""}
                  className={cn(
                    "h-full w-full object-cover transition",
                    !found && !showMiss && "brightness-95",
                  )}
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
            Next spy
          </button>
        </div>
      )}
    </div>
  );
}
