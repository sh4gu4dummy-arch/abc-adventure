import { wordBuddyPath, type LetterEntry, type WordEntry } from "@/data/alphabet";
import { isBuddyWordPoster } from "@/data/art-roles";

/**
 * Home for R–Z word-buddy posters (the letter IS the thing).
 * A–Q posters are already scenes, so this row stays hidden there.
 */
export function WordFriends({
  entry,
  words,
}: {
  entry: LetterEntry;
  words?: WordEntry[];
}) {
  if (!isBuddyWordPoster(entry.letter)) return null;
  const shown = words ?? entry.words;

  return (
    <section className="space-y-2" aria-label="Letter friends">
      <h3 className="font-display text-lg font-bold text-ink">
        {entry.letter} friends
      </h3>
      <p className="text-sm font-semibold text-ink-soft">
        These letter-characters still live here — tap a word card above for the real thing.
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {shown.map((w) => (
          <figure
            key={w.slug}
            className="w-[4.75rem] shrink-0 overflow-hidden rounded-[1rem] border-2 border-border bg-surface shadow-sm sm:w-20"
          >
            <img
              src={wordBuddyPath(entry.letter, w.slug)}
              alt=""
              className="aspect-[3/4] w-full object-cover"
              loading="lazy"
            />
            <figcaption className="break-words px-1 py-1 text-center text-[10px] font-bold leading-tight text-ink">
              {w.word}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
