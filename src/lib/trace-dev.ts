import { useSyncExternalStore } from "react";
import { safeGetItem, safeSetItem } from "@/lib/preview-safe";
import type { TracePt, TraceStroke } from "@/data/trace-guides";
import { traceStrokes } from "@/data/trace-guides";

const PREF_KEY = "abc-trace-dev-v1";
const DRAFT_KEY = "abc-trace-dev-drafts-v1";
const EVENT = "abc-trace-dev";

export type DevStroke = { pts: TraceStroke; numT: number };
export type TraceDevTool = "select" | "line" | "curve" | "freehand";

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
  const key = draftKey(letter);
  if (Object.prototype.hasOwnProperty.call(drafts, key)) {
    const saved = drafts[key] ?? [];
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

function copyText(text: string): boolean {
  let copied = false;
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.width = "1px";
    ta.style.height = "1px";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, text.length);
    copied = document.execCommand("copy");
    document.body.removeChild(ta);
  } catch {
    copied = false;
  }
  if (!copied && navigator.clipboard?.writeText) {
    void navigator.clipboard.writeText(text).catch(() => {});
  }
  return copied;
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

export function copyDevPayload(letter: string, strokes: DevStroke[]): {
  text: string;
  copied: boolean;
} {
  const { text } = exportDevPayload(letter, strokes);
  return { text, copied: copyText(text) };
}

function draftLetterOrder(a: string, b: string) {
  const au = a === a.toUpperCase() ? 0 : 1;
  const bu = b === b.toUpperCase() ? 0 : 1;
  if (au !== bu) return au - bu;
  return a.localeCompare(b);
}

export function copyAllDevPayloads(
  currentLetter: string,
  currentStrokes: DevStroke[],
): { text: string; copied: boolean; count: number } {
  saveDevStrokes(currentLetter, currentStrokes);
  const drafts = readDrafts();
  const keys = Object.keys(drafts)
    .filter((k) => (drafts[k] ?? []).some((s) => (s.pts?.length ?? 0) >= 2))
    .sort(draftLetterOrder);
  const blocks: string[] = [];
  const batch: Record<string, { strokes: TraceStroke[]; numT: number[] }> = {};
  for (const letter of keys) {
    const { payload, text } = exportDevPayload(letter, drafts[letter] ?? []);
    batch[letter] = { strokes: payload.strokes, numT: payload.numT };
    blocks.push(text);
  }
  const text = [
    `TRACE DEV ALL ${keys.join(" ")}`,
    JSON.stringify(batch),
    "",
    ...blocks,
  ].join("\n\n");
  return { text, copied: copyText(text), count: keys.length };
}
