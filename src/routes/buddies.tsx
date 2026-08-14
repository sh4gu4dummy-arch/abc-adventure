import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Clapperboard, Play } from "lucide-react";
import {
  LETTER_BUDDIES_EPISODES,
  buddyEpisodePath,
  buddyPosterPath,
  type BuddyEpisode,
} from "@/data/letter-buddies";

export const Route = createFileRoute("/buddies")({ component: BuddiesPage });

function BuddiesPage() {
  const first = LETTER_BUDDIES_EPISODES[0]!;
  const [ep, setEp] = useState<BuddyEpisode>(first);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <main className="app-shell">
      <Link
        to="/"
        className="pressable mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Home
      </Link>

      <header className="mb-5">
        <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          <Clapperboard className="size-3.5" /> Series
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Letter Buddies</h1>
        <p className="mt-1 max-w-lg text-sm font-medium text-ink-soft">
          The letters play together and make simple words — like a tiny TV show.
        </p>
      </header>

      <section
        className="overflow-hidden rounded-[var(--radius-xl)] border-2 border-border bg-ink shadow-[var(--shadow-float)]"
        aria-label={`Episode ${ep.n}: ${ep.title}`}
      >
        <div className="relative aspect-video bg-ink">
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            poster={buddyPosterPath(ep)}
            playsInline
            controls={playing}
            preload="metadata"
            src={buddyEpisodePath(ep)}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
          />
          {!playing && (
            <button
              type="button"
              onClick={() => void videoRef.current?.play()}
              className="absolute inset-0 grid place-items-center"
              aria-label={`Play episode ${ep.n}`}
            >
              <span className="grid size-16 place-items-center rounded-full bg-white text-ink shadow-lg">
                <Play className="size-7 fill-current" />
              </span>
            </button>
          )}
        </div>
        <div className="bg-surface px-4 py-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
            Episode {ep.n} · {Math.round(ep.seconds / 60)} min · 420p
          </p>
          <h2 className="font-display text-2xl font-bold text-ink">{ep.title}</h2>
          <p className="text-sm font-semibold text-ink-soft">{ep.blurb}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {ep.letters.map((L) => (
              <Link
                key={L}
                to="/letter/$letter"
                params={{ letter: L.toLowerCase() }}
                className="rounded-[var(--radius-pill)] border-2 border-border bg-surface-soft px-2.5 py-0.5 text-xs font-bold text-ink"
              >
                Meet {L}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-6" aria-label="Episodes">
        <h2 className="mb-2 font-display text-lg font-bold text-ink">Episodes</h2>
        <div className="space-y-2">
          {LETTER_BUDDIES_EPISODES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setEp(item);
                setPlaying(false);
              }}
              className="pressable flex w-full items-center gap-3 rounded-[var(--radius-lg)] border-2 border-border bg-surface p-2 text-left"
            >
              <img
                src={buddyPosterPath(item)}
                alt=""
                className="h-16 w-28 shrink-0 rounded-xl object-cover"
              />
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-wide text-muted">
                  Ep {item.n}
                </span>
                <span className="block font-display text-lg font-bold text-ink">
                  {item.title}
                </span>
                <span className="block text-xs font-semibold text-ink-soft">{item.blurb}</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
