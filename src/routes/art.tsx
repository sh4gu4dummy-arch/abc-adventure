import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Images } from "lucide-react";
import { useState } from "react";
import { ART_ARCHIVE_SETS, type ArchiveItem } from "@/data/art-archive";
import { VersionBadge } from "@/components/alphabet/VersionBadge";

export const Route = createFileRoute("/art")({ component: ArtArchivePage });

function ArtArchivePage() {
  const [open, setOpen] = useState<ArchiveItem | null>(null);

  return (
    <main className="app-shell">
      <Link
        to="/settings"
        className="pressable mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Settings
      </Link>

      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
          <Images className="size-3.5" /> Saved art
        </p>
        <h1 className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-3xl font-bold text-ink">
          Art archive
          <VersionBadge />
        </h1>
        <p className="mt-1 max-w-lg text-sm font-medium text-ink-soft">
          Nothing was thrown out. This is the old home-grid art. Tap a picture
          to see it bigger.
        </p>
      </header>

      {ART_ARCHIVE_SETS.map((set) => (
        <section key={set.id} className="mb-8">
          <h2 className="font-display text-xl font-bold text-ink">{set.title}</h2>
          <p className="mt-1 mb-3 max-w-lg text-sm font-medium text-ink-soft">
            {set.blurb}
          </p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {set.items.map((item) => (
              <button
                key={`${set.id}-${item.letter}`}
                type="button"
                onClick={() => setOpen(item)}
                className="pressable overflow-hidden rounded-[var(--radius-md)] border-2 border-border bg-surface text-left"
              >
                <img
                  src={item.src}
                  alt={`${item.letter} — ${item.caption}`}
                  className="aspect-square w-full object-cover"
                />
                <span className="block px-2 py-1.5 text-xs font-bold text-ink">
                  {item.letter}
                  <span className="ml-1 font-semibold text-ink-soft">
                    {item.caption}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}

      {open && (
        <button
          type="button"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setOpen(null)}
          aria-label="Close"
        >
          <figure className="max-h-[90vh] max-w-lg overflow-hidden rounded-[var(--radius-xl)] bg-surface p-3">
            <img
              src={open.src}
              alt={`${open.letter} — ${open.caption}`}
              className="max-h-[75vh] w-full rounded-[var(--radius-md)] object-contain"
            />
            <figcaption className="mt-2 text-center font-display text-lg font-bold text-ink">
              {open.letter} · {open.caption}
            </figcaption>
          </figure>
        </button>
      )}
    </main>
  );
}
