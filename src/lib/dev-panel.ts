import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";

const OPEN_KEY = "abc-dev-panel-open-v1";
const VOTES_KEY = "abc-dev-remake-votes-v1";
const SHOW_KEY = "abc-dev-show-decided-v1";

let open = false;
let showDecided = false;
let initialized = false;
const listeners = new Set<() => void>();

export type DevVote = "confirm" | "reject";
export type DevVoteRecord = { vote: DevVote; notes: string; at: number };

let votes: Record<string, DevVoteRecord> = {};
const EMPTY_VOTES: Record<string, DevVoteRecord> = {};

function emit() {
  for (const l of listeners) l();
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  open = safeGetItem(OPEN_KEY) === "1";
  showDecided = safeGetItem(SHOW_KEY) === "1";
  try {
    const parsed = JSON.parse(safeGetItem(VOTES_KEY) || "{}") as Record<
      string,
      DevVoteRecord
    >;
    votes = parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    votes = {};
  }
}

function subscribe(cb: () => void) {
  init();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function snapshotOpen() {
  init();
  return open;
}

function snapshotVotes() {
  init();
  return votes;
}

function snapshotShowDecided() {
  init();
  return showDecided;
}

export function getDevPanelOpen() {
  init();
  return open;
}

export function setDevPanelOpen(next: boolean) {
  init();
  if (next === open) return;
  open = next;
  safeSetItem(OPEN_KEY, next ? "1" : "0");
  emit();
}

export function getDevVotes(): Record<string, DevVoteRecord> {
  init();
  return votes;
}

export function setDevVote(id: string, vote: DevVote, notes: string) {
  init();
  votes = {
    ...votes,
    [id]: { vote, notes, at: Date.now() },
  };
  safeSetItem(VOTES_KEY, JSON.stringify(votes));
  showDecided = true;
  safeSetItem(SHOW_KEY, "1");
  emit();
}

export function clearDevVote(id: string) {
  init();
  const next = { ...votes };
  delete next[id];
  votes = next;
  safeSetItem(VOTES_KEY, JSON.stringify(votes));
  emit();
}

let toggleAt = 0;

export function toggleShowDecided() {
  init();
  const now = Date.now();
  if (now - toggleAt < 400) return;
  toggleAt = now;
  showDecided = !showDecided;
  safeSetItem(SHOW_KEY, showDecided ? "1" : "0");
  emit();
}

export function useDevPanel() {
  const isOpen = useSyncExternalStore(subscribe, snapshotOpen, () => false);
  const currentVotes = useSyncExternalStore(
    subscribe,
    snapshotVotes,
    () => EMPTY_VOTES,
  );
  const decidedOpen = useSyncExternalStore(
    subscribe,
    snapshotShowDecided,
    () => false,
  );
  return {
    open: isOpen,
    setOpen: setDevPanelOpen,
    votes: currentVotes,
    showDecided: decidedOpen,
    toggleShowDecided,
    setVote: setDevVote,
    clearVote: clearDevVote,
  };
}
