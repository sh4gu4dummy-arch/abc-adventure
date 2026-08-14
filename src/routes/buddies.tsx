import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clapperboard } from "lucide-react";
import { LetterBuddiesShow } from "@/components/alphabet/LetterBuddiesShow";
import { LETTER_BUDDIES_EPISODES, buddyPosterPath } from "@/data/letter-buddies";

export const Route = createFileRoute("/buddies")({
  component: BuddiesPage,
  validateSearch: (s: Record<string, unknown>): { record?: boolean } => {
    if (s.record === "1" || s.record === 1) return { record: true };
    return {};
  },
});

function BuddiesPage() {
  const { record } = Route.useSearch();
  const ep = LETTER_BUDDIES_EPISODES[0]!;

  if (record) {
    return (
      <main className="min-h-dvh bg-[#7ec8e3] p-0">
        <LetterBuddiesShow autoPlay />
      </main>
    );
  }

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
          The letters play together and make simple words.
        </p>
      </header>

      <LetterBuddiesShow autoPlay={Boolean(record)} />

      <div className="mt-3">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">
          Episode {ep.n} · 1 min
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

      <section className="mt-6" aria-label="Episodes">
        <h2 className="mb-2 font-display text-lg font-bold text-ink">Episodes</h2>
        <div className="flex items-center gap-3 rounded-[var(--radius-lg)] border-2 border-border bg-surface p-2">
          <img
            src={buddyPosterPath(ep)}
            alt=""
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />
          <span>
            <span className="block text-[11px] font-bold uppercase tracking-wide text-muted">
              Ep {ep.n}
            </span>
            <span className="block font-display text-lg font-bold text-ink">{ep.title}</span>
          </span>
        </div>
      </section>
    </main>
  );
}