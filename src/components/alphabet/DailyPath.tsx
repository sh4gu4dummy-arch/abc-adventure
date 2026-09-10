import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  Check,
  Flame,
  Gamepad2,
  Pencil,
  PlayCircle,
  Sparkles,
  Star,
} from "lucide-react";
import { getLetter, displayGlyph } from "@/data/alphabet";
import { useCaseMode } from "@/lib/case-mode";
import { persistDailyIfNeeded, useDailyPath, useProgress } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";

type MissionTab = "words" | "trace" | "games";

const GOALS: {
  id: "video" | "trace" | "game";
  label: string;
  tab: MissionTab;
  icon: typeof PlayCircle;
}[] = [
  { id: "video", label: "Word", tab: "words", icon: PlayCircle },
  { id: "trace", label: "Trace", tab: "trace", icon: Pencil },
  { id: "game", label: "Game", tab: "games", icon: Gamepad2 },
];

/**
 * Today's adventure: featured letter + 3 tiny goals + streak.
 */
export function DailyPath() {
  const daily = useDailyPath();
  const { stars, completed } = useProgress();
  const { mode: caseKind } = useCaseMode();
  const allLettersDone = completed.length >= 26;
  const entry = getLetter(daily.letter);
  const doneCount = GOALS.filter((g) => daily.goals[g.id]).length;
  const allDone = daily.completed;
  const hue = entry?.hue ?? "#FF6B6B";
  const accent = entry?.accent ?? "#FF8787";
  const glyph = displayGlyph(daily.letter, caseKind);

  useEffect(() => {
    persistDailyIfNeeded();
  }, []);

  return (
    <section
      className="daily-path card-surface mb-3 overflow-hidden rounded-[var(--radius-lg)] border-2 border-primary/20"
      aria-label="Today's adventure"
    >
      <div
        className="flex items-center gap-2.5 p-2.5 sm:gap-3 sm:p-3"
        style={{
          background: `linear-gradient(135deg, ${hue}18 0%, var(--color-surface) 48%, ${accent}14 100%)`,
        }}
      >
        <Link
          to="/letter/$letter"
          params={{ letter: daily.letter.toLowerCase() }}
          className="pressable grid size-14 shrink-0 place-items-center rounded-2xl text-white shadow-sm sm:size-16"
          style={{
            background: `linear-gradient(145deg, ${hue} 0%, ${accent} 100%)`,
          }}
          onClick={() => {
            void speak(`Today we learn letter ${daily.letter}!`);
          }}
          aria-label={`Open letter ${daily.letter} for today's adventure`}
        >
          <span className="font-display text-3xl font-black leading-none sm:text-4xl">
            {glyph}
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[10px] font-bold tracking-wide text-primary">
              <Sparkles className="mr-1 inline size-3" />
              {allDone
                ? "Done today"
                : allLettersDone
                  ? `Play ${glyph}`
                  : `Next: ${glyph}`}
            </p>
            <div className="h-1.5 min-w-10 flex-1 overflow-hidden rounded-full bg-surface-soft">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(doneCount / 3) * 100}%` }}
              />
            </div>
            <div
              className="flex items-center gap-0.5 rounded-full border border-border bg-surface px-1.5 py-0.5"
              title="Day streak"
            >
              <Flame
                className={cn(
                  "size-3.5",
                  daily.streak > 0 ? "fill-star text-star" : "text-muted",
                )}
              />
              <span className="text-[11px] font-bold text-ink">{daily.streak}</span>
            </div>
          </div>

          <div className="mt-1.5 flex gap-1.5">
            {GOALS.map((g) => {
              const ok = daily.goals[g.id];
              const Icon = g.icon;
              return (
                <Link
                  key={g.id}
                  to="/letter/$letter"
                  params={{ letter: daily.letter.toLowerCase() }}
                  search={{ tab: g.tab }}
                  className={cn(
                    "pressable inline-flex min-h-8 flex-1 items-center justify-center gap-1 rounded-full border px-2 text-[11px] font-bold",
                    ok
                      ? "border-grass/40 bg-grass/15 text-ink"
                      : "border-border bg-surface text-ink-soft",
                  )}
                >
                  {ok ? (
                    <Check className="size-3" strokeWidth={3} />
                  ) : (
                    <Icon className="size-3" />
                  )}
                  {g.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      {allDone && (
        <p className="flex items-center gap-1.5 border-t border-star/30 bg-star/15 px-3 py-1.5 text-[11px] font-bold text-ink">
          <Star className="size-3.5 fill-star text-star" />
          Path complete · +5 stars · {stars} total
        </p>
      )}
    </section>
  );
}
