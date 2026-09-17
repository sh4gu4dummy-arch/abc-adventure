/** Per-letter story theater clips. Missing beats still use the thumbnail stage. */
const STORY_VIDEOS: Record<string, (string | null)[]> = {
  A: ["videos/stories/a-1.mp4", null, null],
};

export function storyBeatVideo(letter: string, beatIdx: number): string | null {
  const pack = STORY_VIDEOS[letter.toUpperCase()];
  const src = pack?.[beatIdx];
  return src ?? null;
}
