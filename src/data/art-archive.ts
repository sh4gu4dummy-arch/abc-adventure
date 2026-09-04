import { assetUrl } from "@/lib/assets";
import { LETTERS } from "@/data/alphabet";

export type ArchiveItem = {
  letter: string;
  src: string;
  caption: string;
};

export type ArchiveSet = {
  id: string;
  title: string;
  blurb: string;
  items: ArchiveItem[];
};

function firstWord(letter: string): string {
  const entry = LETTERS.find((L) => L.letter === letter);
  return entry?.words[0]?.word ?? letter;
}

const OBJECT_LETTERS = "ABCDEFGHIJKLNOP".split("");
const OLD_STYLE_LETTERS = "MQRSTUVWXYZ".split("");

export const ART_ARCHIVE_SETS: ArchiveSet[] = [
  {
    id: "objects",
    title: "Object tiles",
    blurb:
      "These used to sit on the home grid for A–P (apple, cat, dog…). Word cards still use the full scenes. These are just the old thumbnails.",
    items: OBJECT_LETTERS.map((letter) => ({
      letter,
      src: assetUrl(`art-archive/letter-tiles-objects/${letter.toLowerCase()}.webp`),
      caption: firstWord(letter),
    })),
  },
  {
    id: "old-style",
    title: "Earlier letter characters",
    blurb:
      "M was a moon; Q–Z were 2D buddies (including the U twins). Saved when the grid switched to the matching 3D toys.",
    items: OLD_STYLE_LETTERS.map((letter) => ({
      letter,
      src: assetUrl(`art-archive/letter-tiles-old-style/${letter.toLowerCase()}.webp`),
      caption: letter === "M" ? "Moon M" : letter === "U" ? "U twins" : `Letter ${letter}`,
    })),
  },
];
