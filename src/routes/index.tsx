import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  Clapperboard,
  Download,
  Gamepad2,
  Settings2,
  Sparkles,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { LETTERS, letterHeroPath } from "@/data/alphabet";
import { StarBar } from "@/components/alphabet/StarBar";
import { StickerShelf } from "@/components/alphabet/LetterCompleteBanner";
import {
  AchievementsPanel,
  PlayerChip,
  ProfileGate,
} from "@/components/alphabet/ProfileGate";
import { DailyPath } from "@/components/alphabet/DailyPath";
import { LayoutToggle } from "@/components/alphabet/LayoutToggle";
import {
  LETTER_BUDDIES_EPISODES,
  buddyPosterPath,
} from "@/data/letter-buddies";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { visited, stars, completed, daily } = useProgress();
  const [imgFail, setImgFail] = useState<Record<string, boolean>>({});
  const [switching, setSwitching] = useState(false);
  const completePct = Math.round((completed.length / 26) * 100);

  return (
    <main className="app-shell">
      {switching && (
        <ProfileGate mode="switch" onDone={() => setSwitching(false)} />
      )}

      <header className="home-header">
        <div className="home-toolbar">
          <PlayerChip onSwitch={() => setSwitching(true)} />
          <div className="ml-auto flex items-center gap-1.5">
            <StarBar compact />
            <Link
              to="/settings"
              className="pressable inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface text-ink"
              aria-label="Settings"
            >
              <Settings2 className="size-5" />
            </Link>
            <Link
              to="/downloads"
              className="pressable inline-flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-border bg-surface text-ink"
              aria-label="Downloads"
            >
              <Download className="size-5" />
            </Link>
          </div>
        </div>

        <LayoutToggle compact />

        <div className="min-w-0">
          <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <Sparkles className="size-3.5" /> Letter World
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">
            ABC Adventure
          </h1>
          <p className="mt-1 max-w-lg text-sm font-medium text-ink-soft sm:text-base">
            Pick a letter — posters, sounds, tracing, and games.
          </p>
        </div>

        <div className="sticker-meter" aria-label="Sticker progress">
          <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-wide text-muted">
            <span>Stickers</span>
            <span>
              {completed.length}/26 · {completePct}%
              {stars > 0 ? ` · ${stars}★` : ""}
              {daily.streak > 0 ? ` · ${daily.streak}-day` : ""}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-soft">
            <div
              className="h-full rounded-full bg-accent"
              style={{ width: `${completePct}%` }}
            />
          </div>
        </div>
      </header>

      <DailyPath />

      <LetterBuddiesCard />

      <section className="mb-6" aria-label="Alphabet">
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-ink">Pick a letter</h2>
          <p className="text-xs font-semibold text-muted">
            {visited.length > 0 ? `${visited.length}/26 visited` : "Tap any letter"}
          </p>
        </div>
        <div className="letters-grid">
          {LETTERS.map((L) => {
            const done = completed.includes(L.letter);
            const today = daily.letter === L.letter;
            return (
              <Link
                key={L.letter}
                to="/letter/$letter"
                params={{ letter: L.letter.toLowerCase() }}
                className="letter-tile"
                style={{
                  background: `linear-gradient(160deg, ${L.hue}55, ${L.hue}18 55%, var(--color-surface))`,
                }}
                data-today={today ? "1" : undefined}
                data-done={done ? "1" : undefined}
              >
                {!imgFail[L.letter] && (
                  <img
                    src={letterHeroPath(L.letter)}
                    alt=""
                    className="letter-tile-art"
                    loading="lazy"
                    decoding="async"
                    onError={() =>
                      setImgFail((m) => ({ ...m, [L.letter]: true }))
                    }
                  />
                )}
                <span className="letter-tile-glyph">{L.letter}</span>
                {today && <span className="letter-tile-badge">Today</span>}
                {done && !today && (
                  <span className="letter-tile-star" aria-hidden>
                    ★
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <StickerShelf />
      <AchievementsPanel />

      <section className="tips-grid mt-8 mb-2" aria-label="How to play">
        <Tip
          icon={<BookOpen className="size-5" />}
          title="Watch & learn"
          body="Open a letter, play the word videos, then try sound and trace."
        />
        <Tip
          icon={<Gamepad2 className="size-5" />}
          title="Play games"
          body="Memory, story, and letter hunt live on each letter page."
        />
        <Tip
          icon={<Sparkles className="size-5" />}
          title="Earn stickers"
          body="Finish the letter checklist to collect stars and stickers."
        />
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

function LetterBuddiesCard() {
  const ep = LETTER_BUDDIES_EPISODES[0];
  if (!ep) return null;
  return (
    <Link
      to="/buddies"
      className="pressable mb-6 flex overflow-hidden rounded-[var(--radius-xl)] border-2 border-border bg-surface shadow-[var(--shadow-card)]"
    >
      <img
        src={buddyPosterPath(ep)}
        alt=""
        className="h-28 w-[7.5rem] shrink-0 object-cover sm:h-32 sm:w-44"
      />
      <span className="flex min-w-0 flex-1 flex-col justify-center p-3 sm:p-4">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-accent">
          <Clapperboard className="size-3.5" /> Letter Buddies
        </span>
        <span className="font-display text-xl font-bold text-ink">
          Episode {ep.n}: {ep.title}
        </span>
        <span className="text-sm font-semibold text-ink-soft">{ep.blurb}</span>
      </span>
    </Link>
  );
}
