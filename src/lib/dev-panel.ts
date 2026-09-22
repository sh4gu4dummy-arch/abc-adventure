import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";

const OPEN_KEY = "abc-dev-panel-open-v1";
const VOTES_KEY = "abc-dev-remake-votes-v1";

let open = false;
let initialized = false;
const listeners = new Set<() => void>();

export type DevVote = "confirm" | "reject";
export type DevVoteRecord = { vote: DevVote; notes: string; at: number };

let votes: Record<string, DevVoteRecord> = {};

function emit() {
  for (const l of listeners) l();
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  open = safeGetItem(OPEN_KEY) === "1";
  try {
    votes = JSON.parse(safeGetItem(VOTES_KEY) || "{}") as Record<
      string,
      DevVoteRecord
    >;
  } catch {
    votes = {};
  }
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

export function useDevPanel() {
  const isOpen = useSyncExternalStore(
    (cb) => {
      init();
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => open,
    () => false,
  );
  const currentVotes = useSyncExternalStore(
    (cb) => {
      init();
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => votes,
    () => ({}) as Record<string, DevVoteRecord>,
  );
  return {
    open: isOpen,
    setOpen: setDevPanelOpen,
    votes: currentVotes,
    setVote: setDevVote,
    clearVote: clearDevVote,
  };
}
