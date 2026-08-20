import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";

export type LayoutPreference = "auto" | "portrait" | "landscape";
export type LayoutResolved = "phone" | "desktop";

const PREF_KEY = "abc-layout-pref-v1";

type LayoutSnapshot = {
  preference: LayoutPreference;
  resolved: LayoutResolved;
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
};

/** Stable server snapshot — never reads window/localStorage */
const SERVER_SNAPSHOT: LayoutSnapshot = {
  preference: "auto",
  resolved: "phone",
  width: 0,
  height: 0,
  orientation: "portrait",
};

let width = 0;
let height = 0;
let preference: LayoutPreference = "auto";
let snapshot: LayoutSnapshot = SERVER_SNAPSHOT;
let initialized = false;
const listeners = new Set<() => void>();

function normalizePref(raw: string | null): LayoutPreference {
  if (raw === "portrait" || raw === "phone") return "portrait";
  if (raw === "landscape" || raw === "desktop") return "landscape";
  return "auto";
}

function readPreference(): LayoutPreference {
  if (typeof window === "undefined") return "auto";
  return normalizePref(safeGetItem(PREF_KEY));
}

function screenIsLandscape(w: number, h: number): boolean {
  return w > h;
}

function resolve(pref: LayoutPreference, w: number, h: number): LayoutResolved {
  if (pref === "portrait") return "phone";
  if (pref === "landscape") return "desktop";
  return screenIsLandscape(w, h) ? "desktop" : "phone";
}

function rebuild() {
  const orientation = screenIsLandscape(width, height) ? "landscape" : "portrait";
  snapshot = {
    preference,
    resolved: resolve(preference, width, height),
    width,
    height,
    orientation,
  };
  applyToDocument(snapshot);
  for (const l of listeners) l();
}

function applyToDocument(s: LayoutSnapshot) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.layout = s.resolved;
  root.dataset.layoutPref = s.preference;
  root.dataset.orientation = s.orientation;
  root.classList.toggle("layout-phone", s.resolved === "phone");
  root.classList.toggle("layout-desktop", s.resolved === "desktop");
}

function tryLockOrientation(pref: LayoutPreference) {
  if (typeof screen === "undefined") return;
  const ori = screen.orientation as ScreenOrientation & {
    lock?: (mode: string) => Promise<void>;
    unlock?: () => void;
  };
  if (!ori) return;
  try {
    if (pref === "auto") {
      ori.unlock?.();
      return;
    }
    void ori.lock?.(pref)?.catch(() => {
      /* browsers often require fullscreen / installed app */
    });
  } catch {
    /* ignore */
  }
}

function measure() {
  if (typeof window === "undefined") return;
  width = window.innerWidth;
  height = window.innerHeight;
}

export function initLayoutMode() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;
  preference = readPreference();
  measure();
  rebuild();
  tryLockOrientation(preference);

  const onResize = () => {
    measure();
    rebuild();
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("orientationchange", onResize);
  window.addEventListener("storage", (e) => {
    if (e.key === PREF_KEY) {
      preference = readPreference();
      rebuild();
      tryLockOrientation(preference);
    }
  });
}

export function setLayoutPreference(next: LayoutPreference) {
  preference = next;
  safeSetItem(PREF_KEY, next);
  measure();
  rebuild();
  tryLockOrientation(next);
}

export function getLayoutSnapshot(): LayoutSnapshot {
  return snapshot;
}

export function useLayoutMode(): LayoutSnapshot & {
  setPreference: (p: LayoutPreference) => void;
} {
  const s = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snapshot,
    () => SERVER_SNAPSHOT,
  );
  return { ...s, setPreference: setLayoutPreference };
}
