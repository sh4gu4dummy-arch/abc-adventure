export type StoryClipSrc = { video: string; poster: string };

/** Story theater clips. Live under `public/story-clips/` (not `public/videos/`)
 *  because the preview server ignores new files in `public/videos/**`. */
const STORY_VIDEOS: Record<string, (StoryClipSrc | null)[]> = {
  A: [
    {
      video: "story-clips/a-1.mp4",
      poster: "posters-scene/story-a-1.webp",
    },
    {
      video: "story-clips/a-2.mp4",
      poster: "posters-scene/story-a-2.webp",
    },
    {
      video: "story-clips/a-3.mp4",
      poster: "posters-scene/story-a-3.webp",
    },
  ],
  B: [
    {
      video: "story-clips/b-1.mp4",
      poster: "posters-scene/story-b-1.webp",
    },
    {
      video: "story-clips/b-2.mp4",
      poster: "posters-scene/story-b-2.webp",
    },
    {
      video: "story-clips/b-3.mp4",
      poster: "posters-scene/story-b-3.webp",
    },
  ],
  C: [
    {
      video: "story-clips/c-1.mp4",
      poster: "posters-scene/story-c-1.webp",
    },
    {
      video: "story-clips/c-2.mp4",
      poster: "posters-scene/story-c-2.webp",
    },
    {
      video: "story-clips/c-3.mp4",
      poster: "posters-scene/story-c-3.webp",
    },
  ],
  D: [
    {
      video: "story-clips/d-1.mp4",
      poster: "posters-scene/story-d-1.webp",
    },
    {
      video: "story-clips/d-2.mp4",
      poster: "posters-scene/story-d-2.webp",
    },
    {
      video: "story-clips/d-3.mp4",
      poster: "posters-scene/story-d-3.webp",
    },
  ],
  E: [
    {
      video: "story-clips/e-1.mp4",
      poster: "posters-scene/story-e-1.webp",
    },
    {
      video: "story-clips/e-2.mp4",
      poster: "posters-scene/story-e-2.webp",
    },
    {
      video: "story-clips/e-3.mp4",
      poster: "posters-scene/story-e-3.webp",
    },
  ],
  F: [
    {
      video: "story-clips/f-1.mp4",
      poster: "posters-scene/story-f-1.webp",
    },
    {
      video: "story-clips/f-2.mp4",
      poster: "posters-scene/story-f-2.webp",
    },
    {
      video: "story-clips/f-3.mp4",
      poster: "posters-scene/story-f-3.webp",
    },
  ],
  G: [
    {
      video: "story-clips/g-1.mp4",
      poster: "posters-scene/story-g-1.webp",
    },
    {
      video: "story-clips/g-2.mp4",
      poster: "posters-scene/story-g-2.webp",
    },
    {
      video: "story-clips/g-3.mp4",
      poster: "posters-scene/story-g-3.webp",
    },
  ],
  H: [
    {
      video: "story-clips/h-1.mp4",
      poster: "posters-scene/story-h-1.webp",
    },
    {
      video: "story-clips/h-2.mp4",
      poster: "posters-scene/story-h-2.webp",
    },
    {
      video: "story-clips/h-3.mp4",
      poster: "posters-scene/story-h-3.webp",
    },
  ],
  I: [
    {
      video: "story-clips/i-1.mp4",
      poster: "posters-scene/story-i-1.webp",
    },
    {
      video: "story-clips/i-2.mp4",
      poster: "posters-scene/story-i-2.webp",
    },
    {
      video: "story-clips/i-3.mp4",
      poster: "posters-scene/story-i-3.webp",
    },
  ],
  J: [
    {
      video: "story-clips/j-1.mp4",
      poster: "posters-scene/story-j-1.webp",
    },
    {
      video: "story-clips/j-2.mp4",
      poster: "posters-scene/story-j-2.webp",
    },
    {
      video: "story-clips/j-3.mp4",
      poster: "posters-scene/story-j-3.webp",
    },
  ],
  K: [
    {
      video: "story-clips/k-1.mp4",
      poster: "posters-scene/story-k-1.webp",
    },
    {
      video: "story-clips/k-2.mp4",
      poster: "posters-scene/story-k-2.webp",
    },
    {
      video: "story-clips/k-3.mp4",
      poster: "posters-scene/story-k-3.webp",
    },
  ],
  L: [
    {
      video: "story-clips/l-1.mp4",
      poster: "posters-scene/story-l-1.webp",
    },
    {
      video: "story-clips/l-2.mp4",
      poster: "posters-scene/story-l-2.webp",
    },
    {
      video: "story-clips/l-3.mp4",
      poster: "posters-scene/story-l-3.webp",
    },
  ],
  M: [
    {
      video: "story-clips/m-1.mp4",
      poster: "posters-scene/story-m-1.webp",
    },
    {
      video: "story-clips/m-2.mp4",
      poster: "posters-scene/story-m-2.webp",
    },
    {
      video: "story-clips/m-3.mp4",
      poster: "posters-scene/story-m-3.webp",
    },
  ],
  N: [
    {
      video: "story-clips/n-1.mp4",
      poster: "posters-scene/story-n-1.webp",
    },
    {
      video: "story-clips/n-2.mp4",
      poster: "posters-scene/story-n-2.webp",
    },
    {
      video: "story-clips/n-3.mp4",
      poster: "posters-scene/story-n-3.webp",
    },
  ],
};

export function storyBeatVideo(
  letter: string,
  beatIdx: number,
): StoryClipSrc | null {
  return STORY_VIDEOS[letter.toUpperCase()]?.[beatIdx] ?? null;
}
