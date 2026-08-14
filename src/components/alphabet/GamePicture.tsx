import { useState } from "react";
import { posterPath } from "@/data/alphabet";
import { cn } from "@/lib/utils";

/** Big picture-only tile — no printed word (pre-readers). */
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
  const [failed, setFailed] = useState(false);
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
      src={posterPath(letter, slug)}
      alt={revealWord ? word : ""}
      className={cn("h-full w-full object-cover", className)}
      loading="eager"
      onError={() => setFailed(true)}
    />
  );
}
