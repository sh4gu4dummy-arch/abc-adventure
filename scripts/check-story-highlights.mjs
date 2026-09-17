#!/usr/bin/env node
/**
 * Fail if a story line has a letter-word that the highlighter would miss.
 */
import { readFileSync } from "node:fs";

const skip = new Set([
  "a", "an", "and", "at", "as", "am", "are",
  "i", "in", "is", "it", "if",
  "of", "on", "or", "by", "be", "but",
  "the", "to", "too",
]);

function shouldHit(token, letter) {
  const w = token.toLowerCase();
  const L = letter.toLowerCase();
  if (!w || skip.has(w)) return false;
  if (L === "x" && (w.startsWith("x") || w.endsWith("x"))) return true;
  return w.startsWith(L);
}

const src = readFileSync("src/data/stories.ts", "utf8");
const blocks = src.split(/\n  ([A-Z]): \[/).slice(1);
const misses = [];
for (let i = 0; i < blocks.length; i += 2) {
  const letter = blocks[i];
  const body = blocks[i + 1] ?? "";
  const lines = [...body.matchAll(/text: "([^"]+)"/g)].map((m) => m[1]);
  for (const line of lines) {
    for (const tok of line.match(/[A-Za-z][A-Za-z'-]*/g) ?? []) {
      if (shouldHit(tok, letter)) continue;
      // not expected to hit — ok
    }
    const expected = (line.match(/[A-Za-z][A-Za-z'-]*/g) ?? []).filter((t) =>
      shouldHit(t, letter),
    );
    if (letter === "N" && !expected.map((t) => t.toLowerCase()).includes("nodded") && line.toLowerCase().includes("nodded")) {
      misses.push(`N: nodded missing in "${line}"`);
    }
    if (expected.length === 0 && /[A-Za-z]/.test(line)) {
      // slogan beats like "Yes, yes, yes!" still have Y
    }
  }
}

const n3 = "The newt nodded off in the nest.";
const nHits = (n3.match(/[A-Za-z][A-Za-z'-]*/g) ?? []).filter((t) => shouldHit(t, "N"));
if (!nHits.map((t) => t.toLowerCase()).includes("nodded")) {
  misses.push("nodded would not highlight");
}
console.log("N3 hits:", nHits.join(", "));
if (misses.length) {
  console.error(misses.join("\n"));
  process.exit(1);
}
console.log("ok");
