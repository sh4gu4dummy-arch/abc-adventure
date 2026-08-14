import { useEffect, useState } from "react";
import { posterPath, wordBuddyPath } from "@/data/alphabet";
import { cn } from "@/lib/utils";

/** Big picture-only tile — no printed word (pre-readers). Prefers scene art. */
export function GamePicture({
  letter,
  slug,
  word,
  className,
  revealWord,
}: {
  letter: string;
  slug: string;
  word: string;
  className?: string;
  /** Show the word only after success — never as the question. */
  revealWord?: boolean;
}) {
  const preferred = posterPath(letter, slug);
  const fallback = wordBuddyPath(letter, slug);
  const [src, setSrc] = useState(preferred);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setSrc(preferred);
    setFailed(false);
  }, [preferred]);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center bg-surface-soft p-3",
          className,
        )}
      >
        <span className="font-display text-4xl font-bold text-ink">{letter}</span>
        {revealWord && (
          <span className="mt-1 text-center text-sm font-bold text-ink-soft">{word}</span>
        )}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={revealWord ? word : ""}
      className={cn("h-full w-full object-cover", className)}
      loading="eager"
      onError={() => {
        if (src !== fallback) setSrc(fallback);
        else setFailed(true);
      }}
    />
  );
}
