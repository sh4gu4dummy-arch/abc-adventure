import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";

/**
 * Graphics quality preference.
 * - auto: pick high/lite from device hints + optional FPS watchdog
 * - high: richer polish, word videos, soft music
 * - lite: poster-cinema (no video decode), no blur, fewer particles
 *
 * Design goal: High looks premium via compositor-cheap effects (shadows,
 * transforms). Lite often looks *cleaner* (sharp posters) while using far
 * less CPU/GPU/battery — especially on phones.
 */
export type GfxPreference = "auto" | "high" | "lite";
export type GfxResolved = "high" | "lite";

const PREF_KEY = "abc-gfx-pref-v1";
const EVENT = "abc-gfx-pref";

type GfxSnapshot = {
  preference: GfxPreference;
  resolved: GfxResolved;
  /** True when Auto demoted high → lite after sustained jank */
  demoted: boolean;
};

const SERVER_SNAPSHOT: GfxSnapshot = {
  preference: "auto",
  resolved: "high",
  demoted: false,
};

let preference: GfxPreference = "auto";
let demoted = false;
let snapshot: GfxSnapshot = SERVER_SNAPSHOT;
let initialized = false;
let watchdogRunning = false;
const listeners = new Set<() => void>();

function readPreference(): GfxPreference {
  if (typeof window === "undefined") return "auto";
  const raw = safeGetItem(PREF_KEY);
  if (raw === "high" || raw === "lite" || raw === "auto") return raw;
  return "auto";
}

/** Detect low-power / constrained devices for Auto mode. */
export function detectLiteDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  try {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      connection?: { saveData?: boolean; effectiveType?: string };
      getBattery?: () => Promise<{ charging: boolean; level: number }>;
    };
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      return true;
    }
    if (window.matchMedia?.("(prefers-reduced-data: reduce)").matches) {
      return true;
    }
    if (nav.connection?.saveData) return true;
    const et = nav.connection?.effectiveType;
    if (et === "slow-2g" || et === "2g" || et === "3g") return true;

    // ≤2 GB RAM → lite
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory > 0 && nav.deviceMemory <= 2) {
      return true;
    }
    // ≤4 GB + ≤4 cores (common budget Android) → lite
    if (
      typeof nav.deviceMemory === "number" &&
      nav.deviceMemory <= 4 &&
      typeof nav.hardwareConcurrency === "number" &&
      nav.hardwareConcurrency > 0 &&
      nav.hardwareConcurrency <= 4
    ) {
      return true;
    }
    // Very small phone + few cores
    if (
      typeof nav.hardwareConcurrency === "number" &&
      nav.hardwareConcurrency > 0 &&
      nav.hardwareConcurrency <= 2 &&
      window.innerWidth <= 400
    ) {
      return true;
    }
    // Coarse pointer + no hover ≈ phone/tablet without desktop GPU budget
    // Only force lite when also low memory or few cores
    const coarse = window.matchMedia?.("(pointer: coarse)").matches;
    const noHover = window.matchMedia?.("(hover: none)").matches;
    if (
      coarse &&
      noHover &&
      typeof nav.deviceMemory === "number" &&
      nav.deviceMemory > 0 &&
      nav.deviceMemory <= 4
    ) {
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function resolve(pref: GfxPreference): GfxResolved {
  if (pref === "high") return "high";
  if (pref === "lite") return "lite";
  if (demoted) return "lite";
  return detectLiteDevice() ? "lite" : "high";
}

function rebuild() {
  snapshot = {
    preference,
    resolved: resolve(preference),
    demoted: demoted && preference === "auto",
  };
  applyToDocument(snapshot);
  for (const l of listeners) l();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(EVENT));
  }
}

function applyToDocument(s: GfxSnapshot) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.gfx = s.resolved;
  root.dataset.gfxPref = s.preference;
  root.classList.toggle("gfx-high", s.resolved === "high");
  root.classList.toggle("gfx-lite", s.resolved === "lite");
}

/** Confetti / particle budget by mode */
export function particleBudget(): number {
  return snapshot.resolved === "lite" ? 14 : 28;
}

/** Word lessons: play MP4 only on High (Lite uses sharp poster cinema). */
export function shouldPlayLessonVideo(): boolean {
  return snapshot.resolved === "high";
}

/**
 * If Auto is on High and the main thread keeps missing frames, demote to Lite
 * for this session. Saves battery without a permanent preference change.
 */
function startFpsWatchdog() {
  if (typeof window === "undefined" || watchdogRunning) return;
  watchdogRunning = true;
  let last = performance.now();
  let badStreak = 0;
  let samples = 0;
  let raf = 0;

  const tick = (now: number) => {
    const dt = now - last;
    last = now;
    samples++;
    // Ignore first few frames (startup hitch)
    if (samples > 30) {
      if (dt > 48) badStreak += 2;
      else if (dt > 36) badStreak += 1;
      else badStreak = Math.max(0, badStreak - 2);

      if (badStreak > 40 && preference === "auto" && !demoted) {
        demoted = true;
        rebuild();
        watchdogRunning = false;
        return;
      }
    }
    // Stop watching after ~8s of smooth frames
    if (samples > 480 && badStreak < 8) {
      watchdogRunning = false;
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  const onVis = () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
    } else if (watchdogRunning && preference === "auto" && !demoted) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
    }
  };
  document.addEventListener("visibilitychange", onVis);
  raf = requestAnimationFrame(tick);
}

/** Pause continuous CSS animations while the tab is hidden (battery). */
function bindVisibilityClass() {
  if (typeof document === "undefined") return;
  const apply = () => {
    document.documentElement.classList.toggle("gfx-paused", document.hidden);
  };
  apply();
  document.addEventListener("visibilitychange", apply);
}

export function initGfxMode() {
  if (typeof window === "undefined" || initialized) return;
  initialized = true;
  preference = readPreference();
  demoted = false;
  rebuild();
  bindVisibilityClass();
  if (preference === "auto" && snapshot.resolved === "high") {
    startFpsWatchdog();
  }

  window.addEventListener("online", () => {
    if (preference === "auto") rebuild();
  });
  try {
    window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", () => {
      if (preference === "auto") rebuild();
    });
  } catch {
    /* older browsers */
  }
  window.addEventListener("storage", (e) => {
    if (e.key === PREF_KEY) {
      preference = readPreference();
      demoted = false;
      rebuild();
    }
  });
}

export function setGfxPreference(next: GfxPreference) {
  preference = next;
  demoted = false;
  safeSetItem(PREF_KEY, next);
  rebuild();
  if (next === "auto" && resolve(next) === "high") {
    watchdogRunning = false;
    startFpsWatchdog();
  }
}

export function getGfxSnapshot(): GfxSnapshot {
  return snapshot;
}

export function useGfxMode(): GfxSnapshot & {
  setPreference: (p: GfxPreference) => void;
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
  return { ...s, setPreference: setGfxPreference };
}
