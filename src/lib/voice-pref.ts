import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";

export type VoicePref = "female" | "male";

const KEY = "abc-voice-pref-v1";
const EVENT = "abc-voice-pref";

let cache: VoicePref | null = null;

function read(): VoicePref {
  if (typeof window === "undefined") return "female";
  if (cache) return cache;
  const raw = safeGetItem(KEY);
  cache = raw === "male" ? "male" : "female";
  return cache;
}

export function getVoicePref(): VoicePref {
  return read();
}

export function setVoicePref(next: VoicePref) {
  if (typeof window === "undefined") return;
  cache = next;
  safeSetItem(KEY, next);
  window.dispatchEvent(new Event(EVENT));
}

export function useVoicePref(): {
  voice: VoicePref;
  setVoice: (v: VoicePref) => void;
} {
  const voice = useSyncExternalStore(
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
    () => "female" as VoicePref,
  );
  return { voice, setVoice: setVoicePref };
}
