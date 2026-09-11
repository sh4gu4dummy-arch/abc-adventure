import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";
import type { TracePt, TraceStroke } from "@/data/trace-guides";
import { traceStrokes } from "@/data/trace-guides";

const PREF_KEY = "abc-trace-dev-v1";
const DRAFT_KEY = "abc-trace-dev-drafts-v1";
const EVENT = "abc-trace-dev";

export type DevStroke = { pts: TraceStroke; numT: number };
export type TraceDevTool = "select" | "line" | "freehand";

let on = false;
let initialized = false;
const listeners = new Set<() => void>();

function init() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  on = safeGetItem(PREF_KEY) === "1";
}

function emit() {
  for (const l of listeners) l();
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EVENT));
}

export function getTraceDev(): boolean {
  init();
  return on;
}

export function setTraceDev(next: boolean) {
  init();
  on = next;
  safeSetItem(PREF_KEY, next ? "1" : "0");
  emit();
}

export function useTraceDev(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      if (typeof window !== "undefined") window.addEventListener(EVENT, cb);
      return () => {
        listeners.delete(cb);
        if (typeof window !== "undefined") window.removeEventListener(EVENT, cb);
      };
    },
    getTraceDev,
    () => false,
  );
}

function draftKey(letter: string) {
  return letter;
}

type DraftFile = Record<string, DevStroke[]>;

function readDrafts(): DraftFile {
  try {
    const raw = safeGetItem(DRAFT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as DraftFile;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function loadDevStrokes(letter: string): DevStroke[] {
  const drafts = readDrafts();
  const saved = drafts[draftKey(letter)];
  if (saved?.length) {
    return saved.map((s) => ({
      pts: (s.pts ?? []).map((p) => [p[0], p[1]] as TracePt),
      numT: typeof s.numT === "number" ? s.numT : 0.16,
    }));
  }
  const base = traceStrokes(letter) ?? [];
  return base.map((pts) => ({
    pts: pts.map((p) => [p[0], p[1]] as TracePt),
    numT: 0.16,
  }));
}

export function saveDevStrokes(letter: string, strokes: DevStroke[]) {
  const drafts = readDrafts();
  drafts[draftKey(letter)] = strokes;
  safeSetItem(DRAFT_KEY, JSON.stringify(drafts));
}

export function clearDevStrokes(letter: string) {
  const drafts = readDrafts();
  delete drafts[draftKey(letter)];
  safeSetItem(DRAFT_KEY, JSON.stringify(drafts));
}

function roundPt(p: TracePt): TracePt {
  return [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000];
}

export function exportDevPayload(letter: string, strokes: DevStroke[]) {
  const packed = strokes
    .filter((s) => s.pts.length >= 2)
    .map((s) => ({
      pts: s.pts.map(roundPt),
      numT: Math.round(s.numT * 100) / 100,
    }));
  const ts = packed
    .map((s) => `    [${s.pts.map((p) => `[${p[0]}, ${p[1]}]`).join(", ")}],`)
    .join("\n");
  const payload = {
    letter,
    strokes: packed.map((s) => s.pts),
    numT: packed.map((s) => s.numT),
  };
  const text = [
    `TRACE DEV ${letter}`,
    JSON.stringify(payload),
    "",
    `${letter}: [`,
    ts,
    `  ],`,
  ].join("\n");
  return { payload, text };
}

export async function copyDevPayload(letter: string, strokes: DevStroke[]) {
  const { text } = exportDevPayload(letter, strokes);
  try {
    await navigator.clipboard.writeText(text);
    return text;
  } catch {
    return text;
  }
}
