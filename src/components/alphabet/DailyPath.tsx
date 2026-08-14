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
import { getLetter } from "@/data/alphabet";
import { persistDailyIfNeeded, useDailyPath, useProgress } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { cn } from "@/lib/utils";

type MissionTab = "words" | "trace" | "games";

const GOALS: {
  id: "video" | "trace" | "game";
  label: string;
  hint: string;
  tab: MissionTab;
  icon: typeof PlayCircle;
}[] = [
  {
    id: "video",
    label: "Watch a word video",
    hint: "Open Words → play one story",
    tab: "words",
    icon: PlayCircle,
  },
  {
    id: "trace",
    label: "Trace the letter",
    hint: "Finger-draw it carefully",
    tab: "trace",
    icon: Pencil,
  },
  {
    id: "game",
    label: "Win a mini-game",
    hint: "Hear it, tap it, or sort Aa",
    tab: "games",
    icon: Gamepad2,
  },
];

/**
 * Today's adventure: featured letter + 3 tiny goals + streak.
 */
export function DailyPath() {
  const daily = useDailyPath();
  const { stars, completed } = useProgress();
  const allLettersDone = completed.length >= 26;
  const entry = getLetter(daily.letter);
  const doneCount = GOALS.filter((g) => daily.goals[g.id]).length;
  const allDone = daily.completed;
  const hue = entry?.hue ?? "#FF6B6B";
  const accent = entry?.accent ?? "#FF8787";

  useEffect(() => {
    persistDailyIfNeeded();
  }, []);

  return (
    <section
      className="daily-path card-surface mb-6 overflow-hidden rounded-[var(--radius-xl)] border-2 border-primary/20"
      aria-label="Today's adventure"
    >
      <div
        className="relative p-4 sm:p-5"
        style={{
          background: `linear-gradient(135deg, ${hue}18 0%, var(--color-surface) 48%, ${accent}14 100%)`,
        }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-primary/12 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="size-3.5" />
              Today's adventure
            </p>
            <h2 className="mt-2 font-display text-xl font-bold text-ink sm:text-2xl">
              {allDone
                ? "You finished today!"
                : allLettersDone
                  ? `Let's play ${daily.letter}`
                  : `Next letter: ${daily.letter}`}
            </h2>
            <p className="mt-1 max-w-md text-sm font-medium text-ink-soft">
              {allDone
                ? "Amazing work — come back tomorrow for a new path. You can still play free."
                : allLettersDone
                  ? "Three little missions. Tap the big letter to start."
                  : "First unfinished letter. Three little missions — tap to start."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-1.5"
              title="Day streak"
            >
              <Flame
                className={cn(
                  "size-4",
                  daily.streak > 0 ? "fill-star text-star" : "text-muted",
                )}
              />
              <span className="text-sm font-bold text-ink">
                {daily.streak}
                <span className="ml-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                  day{daily.streak === 1 ? "" : "s"}
                </span>
              </span>
            </div>
            {daily.bestStreak > 0 && (
              <div className="hidden items-center gap-1 rounded-[var(--radius-pill)] bg-surface-soft px-2.5 py-1.5 text-[11px] font-bold text-ink-soft sm:flex">
                Best {daily.bestStreak}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-stretch">
          <Link
            to="/letter/$letter"
            params={{ letter: daily.letter.toLowerCase() }}
            className="pressable group relative flex shrink-0 items-center gap-3 rounded-[var(--radius-lg)] border-2 border-white/40 px-3 py-2.5 text-white sm:min-w-[10rem] sm:flex-col sm:justify-center sm:py-4"
            style={{
              background: `linear-gradient(145deg, ${hue} 0%, ${accent} 100%)`,
            }}
            onClick={() => {
              void speak(`Today we learn letter ${daily.letter}!`);
            }}
            aria-label={`Open letter ${daily.letter} for today's adventure`}
          >
            <span className="font-display text-4xl font-black leading-none sm:text-5xl">
              {daily.letter}
            </span>
            <span className="text-left text-xs font-bold uppercase tracking-wide text-white/90 sm:text-center">
              Letter {daily.letter}
            </span>
          </Link>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Missions · {doneCount}/3
              </p>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-soft sm:w-32">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(doneCount / 3) * 100}%` }}
                />
              </div>
            </div>

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
                    "pressable flex items-center gap-3 rounded-[var(--radius-md)] border-2 px-3 py-2.5",
                    ok
                      ? "border-grass/40 bg-grass/10"
                      : "border-border bg-surface hover:border-primary/40",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-full",
                      ok ? "bg-grass text-white" : "bg-surface-soft text-primary",
                    )}
                  >
                    {ok ? (
                      <Check className="size-4" strokeWidth={3} />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <span
                      className={cn(
                        "block text-sm font-bold",
                        ok
                          ? "text-ink line-through decoration-grass/50"
                          : "text-ink",
                      )}
                    >
                      {g.label}
                    </span>
                    <span className="block text-[11px] font-medium text-muted">
                      {g.hint}
                    </span>
                  </span>
                </Link>
              );
            })}

            {allDone && (
              <div className="flex flex-wrap items-center gap-2 rounded-[var(--radius-md)] border-2 border-star/40 bg-star/15 px-3 py-2.5 text-sm font-bold text-ink">
                <Star className="size-4 fill-star text-star" />
                Path complete · +5 stars · streak {daily.streak}
                <span className="text-xs font-semibold text-muted sm:ml-auto">
                  {stars} total
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
