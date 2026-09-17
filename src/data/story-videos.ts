export type StoryClipSrc = { video: string; poster: string };

/** Per-letter story theater clips. Missing beats still use the thumbnail stage. */
const STORY_VIDEOS: Record<string, (StoryClipSrc | null)[]> = {
  A: [
    {
      video: "videos/stories/a-1.mp4",
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
