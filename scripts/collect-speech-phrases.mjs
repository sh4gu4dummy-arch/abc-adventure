/**
 * Collect every phrase the alphabet app may speak, write manifest + speech-map.ts.
 * Run: node scripts/collect-speech-phrases.mjs
 * Then: python3 scripts/generate-speech.py
 * Male pack: SPEECH_VOICE=en-US-AndrewNeural SPEECH_OUT_DIR=public/audio/male python3 scripts/generate-speech.py
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { LETTERS } from "../src/data/alphabet.ts";
import { getLetterStory, storyLines } from "../src/data/stories.ts";
import { allWordLessonPhrases } from "../src/data/word-lessons.ts";

const phrases = new Set();

function add(text) {
  const t = String(text ?? "")
    .trim()
    .replace(/\s+/g, " ");
  if (t) phrases.add(t);
}

// Home / shared
add("Let's learn the alphabet! Tap any letter to begin.");
add("Try again!");
add("Keep looking!");
add("The end! Great listening!");
add("You matched them all! Super memory!");
add("Great! Now find the big capital letters!");
add("Hi friend! I am your teacher voice.");
add("Hi friend! I am your buddy voice.");

// Word video lessons
for (const p of allWordLessonPhrases()) add(p);

for (const entry of LETTERS) {
  add(`The letter ${entry.letter}`);
  add(entry.soundCue);
  add(entry.rhyme);
  add(entry.funFact);

  // Case hunt
  add(`Capital ${entry.letter}`);
  add(`Little ${entry.letter.toLowerCase()}`);
  add(`You found big and little ${entry.letter}! Awesome!`);
  add(`Amazing! You finished the letter ${entry.letter}! You earned a sticker!`);

  // Full story + each spoken line (StoryMode reads line-by-line)
  const story = getLetterStory(entry);
  add(story);
  for (const line of storyLines(story)) {
    add(line);
  }

  for (const w of entry.words) {
    add(w.word);
    add(`Yes! ${w.word}!`);
    add(`Yes! ${w.word} starts with ${entry.letter}!`);
    add(`You found ${w.word}! Great eyes!`);
  }
}

const list = [...phrases].sort((a, b) => a.localeCompare(b));
const items = list.map((text) => {
  const id = createHash("sha1").update(text).digest("hex").slice(0, 16);
  return { id, text, file: `${id}.mp3` };
});

mkdirSync("public/audio", { recursive: true });
mkdirSync("public/audio/male", { recursive: true });
writeFileSync(
  "public/audio/manifest.json",
  JSON.stringify(
    {
      female: "en-US-AvaNeural",
      male: "en-US-AndrewNeural",
      items,
    },
    null,
    2,
  ),
);
writeFileSync(
  "scripts/.speech-phrases.json",
  JSON.stringify(
    items.map((i) => ({ id: i.id, text: i.text, out: `public/audio/${i.file}` })),
    null,
    2,
  ),
);
writeFileSync(
  "scripts/.speech-phrases-male.json",
  JSON.stringify(
    items.map((i) => ({
      id: i.id,
      text: i.text,
      out: `public/audio/male/${i.file}`,
    })),
    null,
    2,
  ),
);

// Embedded map — no fetch needed (works offline + file:// portable)
const mapLines = [
  "/** Auto-generated speech text → audio file map. Do not edit by hand. */",
  'export const SPEECH_VOICE_FEMALE = "en-US-AvaNeural" as const;',
  'export const SPEECH_VOICE_MALE = "en-US-AndrewNeural" as const;',
  '/** @deprecated use SPEECH_VOICE_FEMALE */',
  'export const SPEECH_VOICE = SPEECH_VOICE_FEMALE;',
  "export const SPEECH_MAP: Record<string, string> = {",
  ...items.map((i) => `  ${JSON.stringify(i.text)}: ${JSON.stringify(i.file)},`),
  "};",
  "",
];
writeFileSync("src/data/speech-map.ts", mapLines.join("\n"));

console.log(`Collected ${items.length} phrases (+ speech-map.ts)`);
