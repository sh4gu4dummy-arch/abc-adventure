import { useSyncExternalStore } from "react";
import type { ProgressState } from "@/lib/progress";
import { emptyProgress, normalizeProgress } from "@/lib/progress-core";
import { safeGetItem, safeRemoveItem, safeSetItem } from "@/lib/preview-safe";

const STORE_KEY = "abc-adventure-profiles-v1";
const LEGACY_PROGRESS_KEY = "abc-adventure-progress-v1";

export type AvatarId =
  | "star"
  | "heart"
  | "rocket"
  | "cat"
  | "fish"
  | "sun"
  | "moon"
  | "crown";

export type PlayerProfile = {
  id: string;
  name: string;
  avatar: AvatarId;
  color: string;
  createdAt: number;
  lastPlayedAt: number;
  progress: ProgressState;
};

export type ProfileStore = {
  activeId: string | null;
  profiles: PlayerProfile[];
};

const AVATAR_COLORS = [
  "#FF6B6B",
  "#4DABF7",
  "#51CF66",
  "#FFD43B",
  "#CC5DE8",
  "#FF922B",
  "#20C997",
  "#845EF7",
];

export const AVATAR_OPTIONS: { id: AvatarId; label: string }[] = [
  { id: "star", label: "Star" },
  { id: "heart", label: "Heart" },
  { id: "rocket", label: "Rocket" },
  { id: "cat", label: "Cat" },
  { id: "fish", label: "Fish" },
  { id: "sun", label: "Sun" },
  { id: "moon", label: "Moon" },
  { id: "crown", label: "Crown" },
];

const emptyStore: ProfileStore = { activeId: null, profiles: [] };

let cache: ProfileStore = emptyStore;
let cacheRaw: string | null = null;

function uid() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("abc-profiles"));
    window.dispatchEvent(new Event("abc-progress"));
  }
}

function migrateLegacy(profiles: PlayerProfile[]): PlayerProfile[] {
  if (typeof window === "undefined") return profiles;
  if (profiles.length > 0) return profiles;
  try {
    const legacy = safeGetItem(LEGACY_PROGRESS_KEY);
    if (!legacy) return profiles;
    const progress = normalizeProgress(JSON.parse(legacy));
    const hasAny =
      progress.visited.length > 0 ||
      progress.wordsSeen.length > 0 ||
      progress.stars > 0 ||
      progress.completed.length > 0;
    if (!hasAny) return profiles;
    return [
      {
        id: uid(),
        name: "My journey",
        avatar: "star",
        color: AVATAR_COLORS[0]!,
        createdAt: Date.now(),
        lastPlayedAt: Date.now(),
        progress,
      },
    ];
  } catch {
    return profiles;
  }
}

function readStore(): ProfileStore {
  if (typeof window === "undefined") return emptyStore;
  try {
    const raw = safeGetItem(STORE_KEY);
    if (raw === cacheRaw && cacheRaw !== null) return cache;
    cacheRaw = raw;
    if (!raw) {
      const migrated = migrateLegacy([]);
      if (migrated.length) {
        const next: ProfileStore = {
          activeId: null,
          profiles: migrated,
        };
        writeStore(next);
        return next;
      }
      cache = emptyStore;
      return cache;
    }
    const parsed = JSON.parse(raw) as ProfileStore;
    const profiles = (parsed.profiles ?? []).map((p) => ({
      ...p,
      progress: normalizeProgress(p.progress),
    }));
    const fixed = profiles.length ? profiles : migrateLegacy([]);
    cache = {
      activeId: parsed.activeId ?? null,
      profiles: fixed,
    };
    if (fixed !== profiles) {
      writeStore(cache);
    }
    return cache;
  } catch {
    cache = emptyStore;
    cacheRaw = null;
    return emptyStore;
  }
}

function writeStore(state: ProfileStore) {
  if (typeof window === "undefined") return;
  const next: ProfileStore = {
    activeId: state.activeId,
    profiles: state.profiles.map((p) => ({
      ...p,
      progress: normalizeProgress(p.progress),
    })),
  };
  const raw = JSON.stringify(next);
  safeSetItem(STORE_KEY, raw);
  cache = next;
  cacheRaw = raw;
  emit();
}

export function getProfileStore(): ProfileStore {
  return readStore();
}

export function getActiveProfile(): PlayerProfile | null {
  const s = readStore();
  if (!s.activeId) return null;
  return s.profiles.find((p) => p.id === s.activeId) ?? null;
}

export function getActiveProgress(): ProgressState {
  return getActiveProfile()?.progress ?? emptyProgress();
}

export function setActiveProgress(progress: ProgressState) {
  const s = readStore();
  if (!s.activeId) return;
  const profiles = s.profiles.map((p) =>
    p.id === s.activeId
      ? {
          ...p,
          lastPlayedAt: Date.now(),
          progress: normalizeProgress(progress),
        }
      : p,
  );
  writeStore({ ...s, profiles });
}

export function createProfile(input: {
  name: string;
  avatar: AvatarId;
}): PlayerProfile {
  const s = readStore();
  const color = AVATAR_COLORS[s.profiles.length % AVATAR_COLORS.length]!;
  const profile: PlayerProfile = {
    id: uid(),
    name: input.name.trim() || "Explorer",
    avatar: input.avatar,
    color,
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
    progress: emptyProgress(),
  };
  writeStore({
    activeId: s.activeId,
    profiles: [...s.profiles, profile],
  });
  return profile;
}

export function selectProfile(id: string) {
  const s = readStore();
  if (!s.profiles.some((p) => p.id === id)) return;
  const profiles = s.profiles.map((p) =>
    p.id === id ? { ...p, lastPlayedAt: Date.now() } : p,
  );
  writeStore({ activeId: id, profiles });
}

export function deleteProfile(id: string) {
  const s = readStore();
  const profiles = s.profiles.filter((p) => p.id !== id);
  writeStore({
    activeId: s.activeId === id ? null : s.activeId,
    profiles,
  });
}

export function clearActiveProfile() {
  const s = readStore();
  writeStore({ ...s, activeId: null });
}

export function profileStats(p: PlayerProfile) {
  const progress = normalizeProgress(p.progress);
  return {
    stars: progress.stars,
    stickers: progress.completed.length,
    words: progress.wordsSeen.length,
  };
}

export function formatLastPlayed(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 7 * 86_400_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(ts).toLocaleDateString();
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("abc-profiles", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("abc-profiles", cb);
    window.removeEventListener("storage", cb);
  };
}

export function useProfileStore(): ProfileStore {
  return useSyncExternalStore(subscribe, readStore, () => emptyStore);
}

export function useActiveProfile(): PlayerProfile | null {
  const s = useProfileStore();
  if (!s.activeId) return null;
  return s.profiles.find((p) => p.id === s.activeId) ?? null;
}

/** For tests / portable export cleanup */
export function __resetProfilesForTests() {
  safeRemoveItem(STORE_KEY);
  cache = emptyStore;
  cacheRaw = null;
}
