/** Tiny words we never tint — even if they start with the letter. */
export const STORY_HIGHLIGHT_SKIP = new Set([
  "a",
  "an",
  "and",
  "at",
  "as",
  "am",
  "are",
  "i",
  "in",
  "is",
  "it",
  "if",
  "of",
  "on",
  "or",
  "by",
  "be",
  "but",
  "the",
  "to",
  "too",
]);

export function shouldHighlightStoryWord(
  token: string,
  letter: string,
  listed: string[] = [],
): boolean {
  const w = token.toLowerCase();
  const L = letter.toLowerCase();
  if (!w || STORY_HIGHLIGHT_SKIP.has(w)) return false;
  if (
    listed.some((raw) => {
      const lw = raw.toLowerCase();
      return lw === w || w.startsWith(lw) || (lw.includes(" ") && lw === w);
    })
  ) {
    return true;
  }
  if (L === "x" && (w.startsWith("x") || w.endsWith("x"))) return true;
  return Boolean(L) && w.startsWith(L);
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Walk a line into { text, hit } pieces for the story highlighter. */
export function walkStoryHighlights(
  text: string,
  letter: string,
  listed: string[] = [],
): { text: string; hit: boolean }[] {
  const phrases = [...new Set(listed.map((w) => w.toLowerCase()).filter((w) => /\s/.test(w)))].sort(
    (a, b) => b.length - a.length,
  );
  const re = new RegExp(
    phrases.length
      ? `(${phrases.map(escapeReg).join("|")}|[A-Za-z][A-Za-z'-]*)`
      : `[A-Za-z][A-Za-z'-]*`,
    "gi",
  );
  const out: { text: string; hit: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ text: text.slice(last, idx), hit: false });
    const part = m[0];
    out.push({
      text: part,
      hit: shouldHighlightStoryWord(part, letter, listed),
    });
    last = idx + part.length;
  }
  if (last < text.length) out.push({ text: text.slice(last), hit: false });
  return out;
}
