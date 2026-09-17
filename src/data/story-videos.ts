export type StoryClipSrc = { video: string; poster: string };

/** Story theater clips. Live under `public/story-clips/` (not `public/videos/`)
 *  because the preview server ignores new files in `public/videos/**`. */
const STORY_VIDEOS: Record<string, (StoryClipSrc | null)[]> = {
  A: [
    {
      video: "story-clips/a-1.mp4",
      poster: "posters-scene/story-a-1.webp",
    },
    null,
    null,
  ],
};

export function storyBeatVideo(
  letter: string,
  beatIdx: number,
): StoryClipSrc | null {
  return STORY_VIDEOS[letter.toUpperCase()]?.[beatIdx] ?? null;
}
