import { useSyncExternalStore } from "react";
import type { ProgressState } from "@/lib/progress";
import { emptyProgress, normalizeProgress } from "@/lib/progress-core";
import {
  idbGet,
  idbSet,
  safeGetItem,
  safeRemoveItem,
  safeSessionGet,
  safeSessionSet,
  safeSetItem,
} from "@/lib/preview-safe";

/** Stable key — never bump without reading the old one first. */
const STORE_KEY = "abc-adventure-profiles-v1";
const BACKUP_KEY = "abc-adventure-profiles-backup";
const LEGACY_PROGRESS_KEY = "abc-adventure-progress-v1";
/** Older / typo keys we might have written in past builds */
const LEGACY_PROFILE_KEYS = [
  "abc-adventure-profiles",
  "abc-adventure-profiles-v0",
  "abc-profiles-v1",
];

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
let hydrateDone = false;
let restorePromise: Promise<ProfileStore> | null = null;

function uid() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function emit() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("abc-profiles"));
    window.dispatchEvent(new Event("abc-progress"));
  }
}

function isAvatar(v: unknown): v is AvatarId {
  return (
    typeof v === "string" &&
    AVATAR_OPTIONS.some((a) => a.id === v)
  );
}

function parseOneProfile(raw: unknown): PlayerProfile | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Partial<PlayerProfile>;
  const id = typeof p.id === "string" && p.id ? p.id : uid();
  const name =
    typeof p.name === "string" && p.name.trim() ? p.name.trim() : "Explorer";
  try {
    return {
      id,
      name,
      avatar: isAvatar(p.avatar) ? p.avatar : "star",
      color: typeof p.color === "string" && p.color ? p.color : AVATAR_COLORS[0]!,
      createdAt: typeof p.createdAt === "number" ? p.createdAt : Date.now(),
      lastPlayedAt:
        typeof p.lastPlayedAt === "number" ? p.lastPlayedAt : Date.now(),
      progress: normalizeProgress(p.progress),
    };
  } catch {
    return null;
  }
}

function parseStore(raw: string | null): ProfileStore | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    let list: unknown[] = [];
    let activeId: string | null = null;
    if (Array.isArray(parsed)) {
      list = parsed;
    } else if (parsed && typeof parsed === "object") {
      const o = parsed as Record<string, unknown>;
      if (Array.isArray(o.profiles)) list = o.profiles;
      else if (Array.isArray(o.players)) list = o.players;
      if (typeof o.activeId === "string" || o.activeId === null) {
        activeId = o.activeId as string | null;
      }
    } else {
      return null;
    }
    const profiles = list
      .map(parseOneProfile)
      .filter((p): p is PlayerProfile => Boolean(p));
    if (!profiles.length && !Array.isArray(parsed) && list.length === 0) {
      // empty object with no profiles — treat as empty, not corrupt
      return { activeId: null, profiles: [] };
    }
    if (activeId && !profiles.some((p) => p.id === activeId)) activeId = null;
    return { activeId, profiles };
  } catch {
    return null;
  }
}

function progressScore(p: PlayerProfile): number {
  const pr = p.progress;
  return (
    (pr?.stars ?? 0) * 100 +
    (pr?.completed?.length ?? 0) * 40 +
    (pr?.visited?.length ?? 0) * 10 +
    (pr?.wordsSeen?.length ?? 0)
  );
}

function richness(s: ProfileStore): number {
  let stars = 0;
  for (const p of s.profiles) stars += progressScore(p);
  return s.profiles.length * 1_000_000 + stars;
}

function richer(a: ProfileStore, b: ProfileStore): ProfileStore {
  return richness(a) >= richness(b) ? a : b;
}

function collectFromLocal(): ProfileStore {
  const candidates: ProfileStore[] = [];
  const keys = [STORE_KEY, BACKUP_KEY, ...LEGACY_PROFILE_KEYS];
  for (const k of keys) {
    for (const raw of [safeGetItem(k), safeSessionGet(k)]) {
      const parsed = parseStore(raw);
      if (parsed && parsed.profiles.length) candidates.push(parsed);
    }
  }
  if (!candidates.length) {
    const migrated = migrateLegacy([]);
    if (migrated.length) return { activeId: null, profiles: migrated };
    return emptyStore;
  }
  return candidates.reduce(richer);
}

function persistCopies(
  state: ProfileStore,
  opts?: { writeIdb?: boolean },
) {
  const raw = JSON.stringify(state);
  safeSetItem(STORE_KEY, raw);
  safeSessionSet(STORE_KEY, raw);
  if (state.profiles.length > 0) {
    safeSetItem(BACKUP_KEY, raw);
    safeSessionSet(BACKUP_KEY, raw);
    if (opts?.writeIdb && hydrateDone) {
      void writeIdbMerged(state);
    }
    scheduleServerPush(state);
  }
  cache = state;
  cacheRaw = raw;
}

async function writeIdbMerged(
  state: ProfileStore,
  opts?: { dropId?: string; allowEmpty?: boolean },
) {
  const existing = parseStore(await idbGet(STORE_KEY)) ?? emptyStore;
  const profiles = mergeProfiles(existing.profiles, state.profiles, opts?.dropId);
  if (!opts?.allowEmpty && profiles.length === 0 && existing.profiles.length > 0) {
    return;
  }
  const next: ProfileStore = {
    activeId:
      state.activeId && profiles.some((p) => p.id === state.activeId)
        ? state.activeId
        : existing.activeId && profiles.some((p) => p.id === existing.activeId)
          ? existing.activeId
          : (profiles[0]?.id ?? null),
    profiles,
  };
  await idbSet(STORE_KEY, JSON.stringify(next));
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
    const raw = safeGetItem(STORE_KEY) ?? safeSessionGet(STORE_KEY);
    if (raw === cacheRaw && cacheRaw !== null) return cache;
    const recovered = collectFromLocal();
    cache = recovered;
    cacheRaw = raw;
    if (recovered.profiles.length) {
      const primary = parseStore(raw);
      if (!primary || richness(recovered) > richness(primary)) {
        persistCopies(recovered, { writeIdb: hydrateDone });
      }
    }
    void restoreProfiles();
    return cache;
  } catch {
    const recovered = collectFromLocal();
    cache = recovered;
    cacheRaw = null;
    void restoreProfiles();
    return cache;
  }
}

function mergeProfiles(
  existing: PlayerProfile[],
  incoming: PlayerProfile[],
  dropId?: string,
): PlayerProfile[] {
  const byId = new Map<string, PlayerProfile>();
  for (const p of existing) byId.set(p.id, p);
  for (const p of incoming) {
    const prev = byId.get(p.id);
    if (!prev) {
      byId.set(p.id, p);
      continue;
    }
    byId.set(p.id, progressScore(p) >= progressScore(prev) ? p : prev);
  }
  if (dropId) byId.delete(dropId);
  return [...byId.values()];
}

function mergeStores(a: ProfileStore, b: ProfileStore): ProfileStore {
  const profiles = mergeProfiles(a.profiles, b.profiles);
  const activeId =
    a.activeId && profiles.some((p) => p.id === a.activeId)
      ? a.activeId
      : b.activeId && profiles.some((p) => p.id === b.activeId)
        ? b.activeId
        : (profiles[0]?.id ?? null);
  return { activeId, profiles };
}

let serverPushTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleServerPush(state: ProfileStore) {
  if (typeof window === "undefined") return;
  if (!state.profiles.length) return;
  if (serverPushTimer) clearTimeout(serverPushTimer);
  const payload = JSON.stringify({ store: state });
  serverPushTimer = setTimeout(() => {
    void fetch("/api/journeys", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {
      /* preview-only backup */
    });
  }, 500);
}

async function pullServerJourneys(): Promise<ProfileStore | null> {
  try {
    const res = await fetch("/api/journeys", { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { store?: unknown };
    if (!json?.store) return null;
    return parseStore(JSON.stringify(json.store));
  } catch {
    return null;
  }
}

/** Load IDB + server backup first. Never create a default player until this finishes. */
export function restoreProfiles(): Promise<ProfileStore> {
  if (typeof window === "undefined") return Promise.resolve(emptyStore);
  if (restorePromise) return restorePromise;
  restorePromise = (async () => {
    const local = collectFromLocal();
    let fromIdb: ProfileStore = emptyStore;
    try {
      fromIdb = parseStore(await idbGet(STORE_KEY)) ?? emptyStore;
    } catch {
      fromIdb = emptyStore;
    }
    const fromServer = (await pullServerJourneys()) ?? emptyStore;
    let best = mergeStores(mergeStores(local, fromIdb), fromServer);
    if (!best.profiles.length) best = richer(local, richer(fromIdb, fromServer));
    hydrateDone = true;
    if (best.profiles.length) {
      persistCopies(best, { writeIdb: true });
      emit();
    }
    return cache.profiles.length ? cache : best;
  })();
  return restorePromise;
}

function writeStore(
  state: ProfileStore,
  opts?: { allowEmpty?: boolean; dropId?: string },
) {
  if (typeof window === "undefined") return;
  const existing = collectFromLocal();
  const mergedProfiles = mergeProfiles(
    existing.profiles,
    state.profiles,
    opts?.dropId,
  );
  if (
    !opts?.allowEmpty &&
    mergedProfiles.length === 0 &&
    existing.profiles.length > 0
  ) {
    cache = existing;
    return;
  }
  const next: ProfileStore = {
    activeId: state.activeId,
    profiles: mergedProfiles.map((p) => ({
      ...p,
      progress: normalizeProgress(p.progress),
    })),
  };
  if (next.activeId && !next.profiles.some((p) => p.id === next.activeId)) {
    next.activeId = next.profiles[0]?.id ?? null;
  }
  persistCopies(next);
  if (hydrateDone) void writeIdbMerged(next, opts);
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
  writeStore(
    {
      activeId: s.activeId === id ? null : s.activeId,
      profiles,
    },
    { allowEmpty: true, dropId: id },
  );
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
  safeRemoveItem(BACKUP_KEY);
  cache = emptyStore;
  cacheRaw = null;
  hydrateDone = false;
  restorePromise = null;
}

/**
 * Pick an existing player if we have one.
 * Does NOT create a new Explorer until restore has finished — that was
 * overwriting real journeys on every update.
 */
export function ensureDefaultProfile(name = "Explorer"): PlayerProfile | null {
  const s = readStore();
  if (s.activeId) {
    const cur = s.profiles.find((p) => p.id === s.activeId);
    if (cur) return cur;
  }
  if (s.profiles.length > 0) {
    const first = s.profiles[0]!;
    selectProfile(first.id);
    return first;
  }
  if (!hydrateDone) return null;
  const created = createProfile({ name, avatar: "star" });
  selectProfile(created.id);
  return created;
}

export async function ensureDefaultProfileReady(
  name = "Explorer",
): Promise<PlayerProfile> {
  await restoreProfiles();
  const existing = ensureDefaultProfile(name);
  if (existing) return existing;
  const created = createProfile({ name, avatar: "star" });
  selectProfile(created.id);
  return created;
}

export function exportJourneysJson(): string {
  const s = readStore();
  return JSON.stringify(
    {
      kind: "abc-adventure-journeys",
      version: 1,
      exportedAt: new Date().toISOString(),
      store: s,
    },
    null,
    2,
  );
}

export function importJourneysJson(raw: string): ProfileStore {
  const parsed = JSON.parse(raw) as { store?: ProfileStore } | ProfileStore;
  const incoming =
    parsed && typeof parsed === "object" && "store" in parsed
      ? parseStore(JSON.stringify((parsed as { store: ProfileStore }).store))
      : parseStore(raw);
  if (!incoming || !incoming.profiles.length) {
    throw new Error("No journeys in that file");
  }
  writeStore(incoming);
  return readStore();
}
