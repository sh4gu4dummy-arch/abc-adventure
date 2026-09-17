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
};

export function storyBeatVideo(
  letter: string,
  beatIdx: number,
): StoryClipSrc | null {
  return STORY_VIDEOS[letter.toUpperCase()]?.[beatIdx] ?? null;
}
