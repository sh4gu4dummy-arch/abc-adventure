/**
 * Art split (v0.004)
 *
 * Two languages live in this project — both are keepers:
 *
 *  1. SCENE  — the real thing in a cute world (dog in a park, cat on a rug).
 *              Used for word cards + listening games.
 *  2. BUDDY  — the letter IS the character (Cat-C, Rabbit-R, Snake-S).
 *              Used for home tiles, letter hero, stickers, celebration,
 *              story actors, and the "letter friends" row.
 *
 * Originals are never overwritten:
 *  - public/letters/*.webp          letter mascots (buddy) — all 26 characters
 *  - public/art-archive/letter-tiles-objects/  original A–P object tiles
 *  - public/posters/{l}-{slug}.webp A–Q = scenes, R–Z = word-buddies
 *  - public/posters-scene/          word-card thumbs = frame 1 of each R–Z video
 */

const R_TO_Z = new Set(["r", "s", "t", "u", "v", "w", "x", "y", "z"]);

/** Word posters that are letter-shaped characters (originals stay put). */
export function isBuddyWordPoster(letter: string, _slug?: string): boolean {
  return R_TO_Z.has(letter.toLowerCase());
}

export function sceneKey(letter: string, slug: string): string {
  return `${letter.toLowerCase()}-${slug}`;
}

/** Scene fills that actually exist under public/posters-scene/. */
export const SCENE_FILL_KEYS = new Set([
  "r-rabbit",
  "r-rain",
  "r-rainbow",
  "r-robot",
  "r-rocket",
  "r-rose",
  "s-ship",
  "s-smile",
  "s-snake",
  "s-sock",
  "s-star",
  "s-sun",
  "t-tiger",
  "t-tomato",
  "t-tooth",
  "t-train",
  "t-tree",
  "t-turtle",
  "u-ukulele",
  "u-umbrella",
  "u-under",
  "u-unicorn",
  "u-uniform",
  "u-up",
  "v-vacuum",
  "v-van",
  "v-vegetable",
  "v-vest",
  "v-violin",
  "v-volcano",
  "w-wagon",
  "w-watch",
  "w-water",
  "w-whale",
  "w-window",
  "w-worm",
  "x-box",
  "x-fox-x",
  "x-mix",
  "x-six",
  "x-xray",
  "x-xylophone",
  "y-yacht",
  "y-yak",
  "y-yarn",
  "y-yellow",
  "y-yogurt",
  "y-yoyo",
  "z-zebra",
  "z-zero",
  "z-zigzag",
  "z-zipper",
  "z-zoo",
  "z-zucchini",
]);

export function hasSceneFill(letter: string, slug: string): boolean {
  return SCENE_FILL_KEYS.has(sceneKey(letter, slug));
}
