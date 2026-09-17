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
};

export function storyBeatVideo(
  letter: string,
  beatIdx: number,
): StoryClipSrc | null {
  return STORY_VIDEOS[letter.toUpperCase()]?.[beatIdx] ?? null;
}
