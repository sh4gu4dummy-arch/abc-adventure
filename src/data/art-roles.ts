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
 *  - public/posters-scene/          new scene fills for R–Z holes only
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
  "r-rose",
  "s-smile",
  "s-sock",
  "s-sun",
  "t-tiger",
  "t-tomato",
  "t-tooth",
  "t-train",
  "t-tree",
  "t-turtle",
  "u-unicorn",
  "u-up",
  "v-vacuum",
  "v-van",
  "v-volcano",
  "w-wagon",
  "w-watch",
  "w-water",
  "w-whale",
  "w-worm",
  "x-box",
  "x-fox-x",
  "x-mix",
  "x-six",
  "x-xray",
  "x-xylophone",
  "y-yak",
  "y-yarn",
  "y-yellow",
  "y-yogurt",
  "z-zero",
  "z-zigzag",
  "z-zipper",
  "z-zoo",
  "z-zucchini",
]);

export function hasSceneFill(letter: string, slug: string): boolean {
  return SCENE_FILL_KEYS.has(sceneKey(letter, slug));
}
