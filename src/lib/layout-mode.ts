import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";

export type LayoutPreference = "auto" | "phone" | "desktop";
export type LayoutResolved = "phone" | "desktop";

const PREF_KEY = "abc-layout-pref-v1";
/** Width at which "auto" switches to desktop layout */
export const DESKTOP_MIN_WIDTH = 768;

type LayoutSnapshot = {
  preference: LayoutPreference;
  resolved: LayoutResolved;
  width: number;
};

/** Stable server snapshot — never reads window/localStorage */
const SERVER_SNAPSHOT: LayoutSnapshot = {
  preference: "auto",
  resolved: "phone",
  width: 0,
};

let width = 0;
let preference: LayoutPreference = "auto";
let snapshot: LayoutSnapshot = SERVER_SNAPSHOT;
let initialized = false;
const listeners = new Set<() => void>();

function readPreference(): LayoutPreference {
  if (typeof window === "undefined") return "auto";
  const raw = safeGetItem(PREF_KEY);
  if (raw === "phone" || raw === "desktop" || raw === "auto") return raw;
  return "auto";
}

function resolve(pref: LayoutPreference, w: number): LayoutResolved {
  if (pref === "phone") return "phone";
  if (pref === "desktop") return "desktop";
  return w >= DESKTOP_MIN_WIDTH ? "desktop" : "phone";
}

function rebuild() {
  snapshot = {
    preference,
    resolved: resolve(preference, width),
    width,
  };
  applyToDocument(snapshot);
  for (const l of listeners) l();
}

function applyToDocument(s: LayoutSnapshot) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.layout = s.resolved;
  root.dataset.layoutPref = s.preference;
  root.classList.toggle("layout-phone", s.resolved === "phone");
  root.classList.toggle("layout-desktop", s.resolved === "desktop");
}

export function initLayoutMode() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;
  preference = readPreference();
  width = window.innerWidth;
  rebuild();

  window.addEventListener("resize", () => {
    width = window.innerWidth;
    rebuild();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === PREF_KEY) {
      preference = readPreference();
      rebuild();
    }
  });
}

export function setLayoutPreference(next: LayoutPreference) {
  preference = next;
  safeSetItem(PREF_KEY, next);
  if (typeof window !== "undefined") {
    width = window.innerWidth;
  }
  rebuild();
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
