import { cn } from "@/lib/utils";

/** Color + underline the lesson letter in the word (Box on X → x, not B). */
export function LetterWord({
  word,
  accent,
  letter,
  className,
  size = "md",
}: {
  word: string;
  accent: string;
  /** Letter being taught. Highlight this glyph, not always the first char. */
  letter?: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "text-base",
    md: "text-xl sm:text-2xl",
    lg: "text-3xl sm:text-4xl",
    xl: "text-4xl sm:text-5xl md:text-6xl",
  };
  const wrap = (prefix: string, ch: string, rest: string) => (
    <span className={cn("font-display font-bold tracking-tight", sizes[size], className)}>
      {prefix}
      <span style={{ color: accent }} className="underline decoration-[0.12em] underline-offset-4">
        {ch}
      </span>
      <span className="text-ink">{rest}</span>
    </span>
  );

  const target = letter?.replace(/[^A-Za-z]/g, "").charAt(0);
  if (target) {
    const idx = word.toLowerCase().indexOf(target.toLowerCase());
    if (idx >= 0) {
      return wrap(word.slice(0, idx), word[idx], word.slice(idx + 1));
    }
  }

  const match = word.match(/^([^A-Za-z]*)([A-Za-z])(.*)$/);
  if (!match) {
    return <span className={className}>{word}</span>;
  }
  const [, prefix, first, rest] = match;
  return wrap(prefix, first, rest);
}
