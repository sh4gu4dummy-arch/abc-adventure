import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";

/**
 * Color theme preference.
 * - auto: follow prefers-color-scheme
 * - light / dark: locked
 */
export type ThemePreference = "auto" | "light" | "dark";
export type ThemeResolved = "light" | "dark";

const PREF_KEY = "abc-theme-pref-v1";
const EVENT = "abc-theme-pref";

type ThemeSnapshot = {
  preference: ThemePreference;
  resolved: ThemeResolved;
};

const SERVER_SNAPSHOT: ThemeSnapshot = {
  preference: "auto",
  resolved: "light",
};

let preference: ThemePreference = "auto";
let snapshot: ThemeSnapshot = SERVER_SNAPSHOT;
let initialized = false;
const listeners = new Set<() => void>();

function readPreference(): ThemePreference {
  if (typeof window === "undefined") return "auto";
  const raw = safeGetItem(PREF_KEY);
  if (raw === "light" || raw === "dark" || raw === "auto") return raw;
  return "auto";
}

export function detectSystemDark(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

function resolve(pref: ThemePreference): ThemeResolved {
  if (pref === "light") return "light";
  if (pref === "dark") return "dark";
  return detectSystemDark() ? "dark" : "light";
}

function rebuild() {
  snapshot = {
    preference,
    resolved: resolve(preference),
  };
  applyToDocument(snapshot);
  for (const l of listeners) l();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

function applyToDocument(s: ThemeSnapshot) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = s.resolved;
  root.dataset.themePref = s.preference;
  root.classList.toggle("theme-dark", s.resolved === "dark");
  root.classList.toggle("theme-light", s.resolved === "light");
  root.style.colorScheme = s.resolved;
  // Browser chrome / PWA status bar hint
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", s.resolved === "dark" ? "#1a1b2e" : "#ff6b6b");
  }
}

export function initThemeMode() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;
  preference = readPreference();
  rebuild();

  try {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (preference === "auto") rebuild();
      });
  } catch {
    /* older browsers */
  }

  window.addEventListener("storage", (e) => {
    if (e.key === PREF_KEY) {
      preference = readPreference();
      rebuild();
    }
  });
}

export function setThemePreference(next: ThemePreference) {
  preference = next;
  safeSetItem(PREF_KEY, next);
  rebuild();
}

export function getThemeSnapshot(): ThemeSnapshot {
  return snapshot;
}

export function useThemeMode(): ThemeSnapshot & {
  setPreference: (p: ThemePreference) => void;
} {
  const s = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      if (typeof window !== "undefined") {
        window.addEventListener(EVENT, cb);
      }
      return () => {
        listeners.delete(cb);
        if (typeof window !== "undefined") {
          window.removeEventListener(EVENT, cb);
        }
      };
    },
    () => snapshot,
    () => SERVER_SNAPSHOT,
  );
  return { ...s, setPreference: setThemePreference };
}
