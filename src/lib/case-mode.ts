import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";

export type CaseKind = "upper" | "lower";

const KEY = "abc-case-mode-v1";

let mode: CaseKind = "upper";
let initialized = false;
const listeners = new Set<() => void>();

function normalize(raw: string | null): CaseKind {
  return raw === "lower" ? "lower" : "upper";
}

function applyDoc(next: CaseKind) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.case = next;
}

function emit() {
  applyDoc(mode);
  for (const l of listeners) l();
}

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  mode = normalize(safeGetItem(KEY));
  applyDoc(mode);
}

export function getCaseMode(): CaseKind {
  init();
  return mode;
}

export function setCaseMode(next: CaseKind) {
  init();
  if (next === mode) return;
  mode = next;
  safeSetItem(KEY, next);
  emit();
}

export function useCaseMode(): { mode: CaseKind; setMode: (k: CaseKind) => void } {
  const current = useSyncExternalStore(
    (cb) => {
      init();
      listeners.add(cb);
      return () => {
        listeners.delete(cb);
      };
    },
    () => mode,
    () => "upper" as const,
  );
  return { mode: current, setMode: setCaseMode };
}
