import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";

/** Narration = overlay teacher/buddy. Clip = the video's own sound. */
export type LessonSound = "narration" | "clip";

const KEY = "abc-lesson-sound-v1";
const EVENT = "abc-lesson-sound";

let cache: LessonSound | null = null;

function read(): LessonSound {
  if (typeof window === "undefined") return "narration";
  if (cache) return cache;
  const raw = safeGetItem(KEY);
  cache = raw === "clip" ? "clip" : "narration";
  return cache;
}

export function getLessonSound(): LessonSound {
  return read();
}

export function setLessonSound(next: LessonSound) {
  if (typeof window === "undefined") return;
  cache = next;
  safeSetItem(KEY, next);
  window.dispatchEvent(new Event(EVENT));
}

export function useLessonSound(): {
  mode: LessonSound;
  setMode: (m: LessonSound) => void;
} {
  const mode = useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      window.addEventListener(EVENT, cb);
      window.addEventListener("storage", cb);
      return () => {
        window.removeEventListener(EVENT, cb);
        window.removeEventListener("storage", cb);
      };
    },
    () => read(),
    () => "narration" as LessonSound,
  );
  return { mode, setMode: setLessonSound };
}
