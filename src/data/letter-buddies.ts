import { assetUrl } from "@/lib/assets";

export type BuddyEpisode = {
  id: string;
  n: number;
  title: string;
  blurb: string;
  video: string;
  poster: string;
  letters: string[];
  seconds: number;
};

/** TV-style series. New episodes go here; files live in public/videos/series/. */
export const LETTER_BUDDIES_EPISODES: BuddyEpisode[] = [
  {
    id: "ep01-cat",
    n: 1,
    title: "CAT",
    blurb: "C, A, and T play together — then they make a word.",
    video: "videos/series/letter-buddies-ep01-cat.mp4",
    poster: "letters/c.webp",
    letters: ["C", "A", "T"],
    seconds: 60,
  },
];

export function buddyEpisodePath(ep: BuddyEpisode): string {
  return assetUrl(ep.video);
}

export function buddyPosterPath(ep: BuddyEpisode): string {
  return assetUrl(ep.poster);
}

export function episodesForLetter(letter: string): BuddyEpisode[] {
  const L = letter.toUpperCase();
  return LETTER_BUDDIES_EPISODES.filter((e) => e.letters.includes(L));
}
