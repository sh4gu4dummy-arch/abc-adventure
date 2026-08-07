import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Sparkles,
  Volume2,
  Lightbulb,
  Gamepad2,
  Music,
  Palette,
  Camera,
  Hand,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { LETTERS, letterHeroPath } from "@/data/alphabet";
import { StarBar } from "@/components/alphabet/StarBar";
import { DownloadPortable } from "@/components/alphabet/DownloadPortable";
import { LayoutToggle } from "@/components/alphabet/LayoutToggle";
import { GfxToggle } from "@/components/alphabet/GfxToggle";
import { ThemeToggle } from "@/components/alphabet/ThemeToggle";
import { VoiceToggle } from "@/components/alphabet/VoiceToggle";
import { StickerShelf } from "@/components/alphabet/LetterCompleteBanner";
import {
  AchievementsPanel,
  PlayerChip,
  ProfileGate,
} from "@/components/alphabet/ProfileGate";
import { DailyPath } from "@/components/alphabet/DailyPath";
import { useProgress } from "@/lib/progress";
import { clearActiveProfile } from "@/lib/profiles";
import { speak } from "@/lib/speak";

export const Route = createFileRoute("/")({ component: Home });

const IDEAS = [
  {
    icon: Music,
    title: "Letter songs",
    body: "A short sing-along per letter (to a familiar tune) so kids hear the sound in rhythm.",
  },
  {
    icon: Palette,
    title: "Coloring pages",
    body: "Simple outline versions of each poster kids can color on a tablet or print.",
  },
  {
    icon: Camera,
    title: "Letter hunt photos",
    body: "Prompt kids to snap or draw something that starts with today's letter around the house.",
  },
  {
    icon: Hand,
    title: "Sign language",
    body: "Show the ASL handshape for each letter — great for body memory.",
  },
];

function Home() {
  const { visited, wordsSeen, stars, completed, daily } = useProgress();
  const [imgFail, setImgFail] = useState<Record<string, boolean>>({});
  const [switching, setSwitching] = useState(false);
  const progressPct = Math.round((visited.length / 26) * 100);
  const completePct = Math.round((completed.length / 26) * 100);

  return (
    <main className="app-shell">
      {switching && (
        <ProfileGate mode="switch" onDone={() => setSwitching(false)} />
      )}

      <header className="home-header">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
              <Sparkles className="size-3.5" /> Letter World
            </p>
            <PlayerChip onSwitch={() => setSwitching(true)} />
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl">
            ABC Adventure
          </h1>
          <p className="max-w-xl text-base font-medium text-ink-soft sm:text-lg">
            Posters, sounds, tracing, memory pairs, stories, and Aa hunt — earn a
            sticker for every finished letter!
          </p>
        </div>
        <div className="home-tools">
          <VoiceToggle />
          <LayoutToggle />
          <GfxToggle />
          <ThemeToggle />
          <StarBar />
          <div className="w-full min-w-[180px] rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-2">
            <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-wide text-muted">
              <span>Journey</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-soft">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] font-semibold text-ink-soft">
              {stars} stars · {completed.length}/26 stickers · {wordsSeen.length}{" "}
              posters
              {daily.streak > 0 ? ` · 🔥 ${daily.streak}-day streak` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => clearActiveProfile()}
            className="pressable text-xs font-bold text-muted underline-offset-2 hover:text-ink-soft hover:underline"
          >
            Change player at start screen
          </button>
        </div>
      </header>

      <DailyPath />

      <section className="mb-6" aria-label="Alphabet">
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-ink">Pick a letter</h2>
          <p className="text-xs font-semibold text-muted">
            {completePct}% stickers · {visited.length}/26 visited
          </p>
        </div>
        <div className="letters-grid stagger">
          {LETTERS.map((L) => {
            const done = completed.includes(L.letter);
            const today = daily.letter === L.letter;
            return (
              <Link
                key={L.letter}
                to="/letter/$letter"
                params={{ letter: L.letter.toLowerCase() }}
                className="pressable relative flex flex-col items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border-2 border-border bg-surface py-3 text-ink shadow-[var(--shadow-letter)]"
                style={{
                  background: `linear-gradient(160deg, ${L.hue}55, ${L.hue}18 55%, var(--color-surface))`,
                  boxShadow: today
                    ? `0 0 0 3px var(--color-star), var(--shadow-letter)`
                    : undefined,
                }}
              >
                {!imgFail[L.letter] && (
                  <img
                    src={letterHeroPath(L.letter)}
                    alt=""
                    className="poster-art absolute inset-0 h-full w-full object-cover opacity-35"
                    loading="lazy"
                    decoding="async"
                    onError={() =>
                      setImgFail((m) => ({ ...m, [L.letter]: true }))
                    }
                  />
                )}
                <span className="relative font-display text-4xl font-black drop-shadow sm:text-5xl">
                  {L.letter}
                </span>
                {today && (
                  <span className="relative mt-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                    Today
                  </span>
                )}
                {done && !today && (
                  <span className="relative mt-1 text-lg" aria-hidden>
                    ⭐
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <StickerShelf />
      <AchievementsPanel />

      <section className="mt-8 mb-4 grid gap-3 sm:grid-cols-3">
        <Tip
          icon={<BookOpen className="size-5" />}
          title="Watch & learn"
          body="Each word has a short story video — watch to unlock it."
        />
        <Tip
          icon={<Gamepad2 className="size-5" />}
          title="Play games"
          body="Match, pairs, I Spy, story, and Aa hunt for every letter."
        />
        <Tip
          icon={<Sparkles className="size-5" />}
          title="Earn stickers"
          body="Finish the checklist to complete a letter and collect stars."
        />
      </section>

      <DownloadPortable />

      <section className="mt-10 mb-6" aria-label="Ideas for later">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <Lightbulb className="size-5 text-star" /> Ideas for later
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {IDEAS.map((idea) => (
            <div
              key={idea.title}
              className="card-surface rounded-[var(--radius-lg)] p-4"
            >
              <div className="mb-2 flex items-center gap-2 text-primary">
                <idea.icon className="size-5" />
                <h3 className="font-display font-bold text-ink">{idea.title}</h3>
              </div>
              <p className="text-sm font-medium text-ink-soft">{idea.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function Tip({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
        {icon}
      </div>
      <div>
        <p className="font-display font-bold text-ink">{title}</p>
        <p className="text-sm font-medium text-ink-soft">{body}</p>
      </div>
    </div>
  );
}
