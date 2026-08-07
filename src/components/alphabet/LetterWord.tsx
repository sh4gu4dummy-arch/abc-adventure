import { cn } from "@/lib/utils";

/** Renders a word with the first alphabetic character bold + colored. */
export function LetterWord({
  word,
  accent,
  className,
  size = "md",
}: {
  word: string;
  accent: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const match = word.match(/^([^A-Za-z]*)([A-Za-z])(.*)$/);
  if (!match) {
    return <span className={className}>{word}</span>;
  }
  const [, prefix, first, rest] = match;
  const sizes = {
    sm: "text-base",
    md: "text-xl sm:text-2xl",
    lg: "text-3xl sm:text-4xl",
    xl: "text-4xl sm:text-5xl md:text-6xl",
  };

  return (
    <span className={cn("font-display font-bold tracking-tight", sizes[size], className)}>
      {prefix}
      <span style={{ color: accent }} className="underline decoration-[0.12em] underline-offset-4">
        {first}
      </span>
      <span className="text-ink">{rest}</span>
    </span>
  );
}
