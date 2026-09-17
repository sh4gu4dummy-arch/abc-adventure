import { assetUrl } from "@/lib/assets";

export function playChime(volume = 0.45) {
  if (typeof window === "undefined") return;
  try {
    const a = new Audio(assetUrl("audio/sfx/chime.mp3"));
    a.volume = volume;
    void a.play().catch(() => {});
  } catch {
    /* ignore */
  }
}
