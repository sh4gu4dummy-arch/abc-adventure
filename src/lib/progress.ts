import { useSyncExternalStore } from "react";
import { getLetter } from "@/data/alphabet";
import {
  applyAchievements,
  dailyGoalsDone,
  emptyDailyGoals,
  emptyProgress,
  localDateKey,
  normalizeProgress,
  pickDailyLetter,
  shiftDateKey,
  type DailyPathState,
  type ProgressState,
} from "@/lib/progress-core";
import {
  getActiveProgress,
  getActiveProfile,
  setActiveProgress,
} from "@/lib/profiles";

export type { ProgressState, DailyPathState };
export {
  emptyProgress,
  normalizeProgress,
  ACHIEVEMENTS,
  localDateKey,
  pickDailyLetter,
} from "@/lib/progress-core";
export type { AchievementDef } from "@/lib/progress-core";

const empty = emptyProgress();
const GAME_SECTIONS = ["match", "ispy", "memory", "story", "cases"] as const;

/** Stable snapshot cache for useSyncExternalStore */
let snapshot: ProgressState = empty;
let snapshotKey = "";

function storeKey(state: ProgressState): string {
  return JSON.stringify(state);
}

function computeDaily(state: ProgressState, now = new Date()): ProgressState {
  const today = localDateKey(now);
  const s = normalizeProgress(state);
  let daily = { ...s.daily, goals: { ...s.daily.goals } };
  let changed = false;

  if (daily.dateKey !== today) {
    const letter = pickDailyLetter(s.completed, today);
    let streak = daily.streak;
    if (daily.lastStreakDate) {
      const yesterday = shiftDateKey(today, -1);
      if (daily.lastStreakDate !== yesterday && daily.lastStreakDate !== today) {
        streak = 0;
      }
    }
    daily = {
      ...daily,
      dateKey: today,
      letter,
      goals: emptyDailyGoals(),
      completed: false,
      streak,
    };
    changed = true;
  } else if (!daily.letter) {
    daily = { ...daily, letter: pickDailyLetter(s.completed, today) };
    changed = true;
  }

  return changed ? { ...s, daily } : s;
}

function refreshSnapshot(): ProgressState {
  if (typeof window === "undefined" || !getActiveProfile()) {
    snapshot = empty;
    snapshotKey = "";
    return snapshot;
  }
  const base = normalizeProgress(getActiveProgress());
  const next = computeDaily(base);
  const key = storeKey(next);
  if (key === snapshotKey) return snapshot;
  snapshot = next;
  snapshotKey = key;
  return snapshot;
}

function read(): ProgressState {
  return refreshSnapshot();
}

function write(state: ProgressState) {
  if (typeof window === "undefined") return;
  if (!getActiveProfile()) return;
  const normalized = normalizeProgress(state);
  const withDaily = computeDaily(normalized);
  const { state: withAch, unlocked } = applyAchievements(withDaily);
  snapshot = withAch;
  snapshotKey = storeKey(withAch);
  setActiveProgress(withAch);
  if (unlocked.length) {
    window.dispatchEvent(
      new CustomEvent("abc-achievement", {
        detail: { achievements: unlocked.map((a) => a.id) },
      }),
    );
  }
}

/**
 * Persist rolled daily path if the in-memory snapshot differs from storage.
 * Call from useEffect (never during render).
 */
export function persistDailyIfNeeded(): void {
  if (typeof window === "undefined" || !getActiveProfile()) return;
  const stored = normalizeProgress(getActiveProgress());
  const computed = computeDaily(stored);
  if (storeKey(stored) !== storeKey(computed)) {
    snapshot = computed;
    snapshotKey = storeKey(computed);
    setActiveProgress(computed);
  } else {
    refreshSnapshot();
  }
}

export function ensureDaily(state: ProgressState, now = new Date()): ProgressState {
  return computeDaily(state, now);
}

function applyDailyGoal(
  state: ProgressState,
  kind: "video" | "trace" | "game",
  letter: string,
): ProgressState {
  const s = computeDaily(state);
  const L = letter.toUpperCase();
  if (L !== s.daily.letter) return s;
  if (s.daily.goals[kind]) return s;

  const goals = { ...s.daily.goals, [kind]: true };
  let daily: DailyPathState = { ...s.daily, goals };
  let stars = s.stars;

  if (!daily.completed && dailyGoalsDone(goals)) {
    const today = daily.dateKey;
    const yesterday = shiftDateKey(today, -1);
    let streak = 1;
    if (daily.lastStreakDate === yesterday) {
      streak = daily.streak + 1;
    } else if (daily.lastStreakDate === today) {
      streak = daily.streak;
    }
    daily = {
      ...daily,
      completed: true,
      streak,
      lastStreakDate: today,
      bestStreak: Math.max(daily.bestStreak, streak),
    };
    stars += 5;
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("abc-daily-complete", {
          detail: { letter: L, streak },
        }),
      );
    }
  }

  return { ...s, daily, stars };
}

export function getProgress(): ProgressState {
  return read();
}

export function getDailyPath(): DailyPathState {
  return read().daily;
}

export function markVisited(letter: string) {
  const s = read();
  const L = letter.toUpperCase();
  if (!s.visited.includes(L)) {
    write({
      ...s,
      visited: [...s.visited, L],
      stars: s.stars + 1,
    });
  }
}

export function markWordSeen(letter: string, slug: string) {
  let s = read();
  const id = `${letter.toLowerCase()}-${slug}`;
  if (!s.wordsSeen.includes(id)) {
    s = {
      ...s,
      wordsSeen: [...s.wordsSeen, id],
      stars: s.stars + 1,
    };
  }
  s = applyDailyGoal(s, "video", letter);
  write(s);
  tryCompleteLetter(letter);
}

export function markSection(letter: string, section: string) {
  let s = read();
  const L = letter.toUpperCase();
  const id = `${L}:${section}`;
  if (!s.sections.includes(id)) {
    s = {
      ...s,
      sections: [...s.sections, id],
      stars: s.stars + 2,
    };
  }
  if (section === "trace") {
    s = applyDailyGoal(s, "trace", L);
  } else if ((GAME_SECTIONS as readonly string[]).includes(section)) {
    s = applyDailyGoal(s, "game", L);
  }
  write(s);
  tryCompleteLetter(letter);
}

export type LetterChecklist = {
  words: number;
  wordsTotal: number;
  sound: boolean;
  trace: boolean;
  game: boolean;
  complete: boolean;
  justCompleted?: boolean;
};

export function getLetterChecklist(
  letter: string,
  state?: ProgressState,
): LetterChecklist {
  const s = state ?? read();
  const L = letter.toUpperCase();
  const entry = getLetter(L);
  const wordsTotal = entry?.words.length ?? 6;
  const words = entry
    ? entry.words.filter((w) =>
        s.wordsSeen.includes(`${L.toLowerCase()}-${w.slug}`),
      ).length
    : 0;
  const has = (sec: string) => s.sections.includes(`${L}:${sec}`);
  const sound = has("sound");
  const trace = has("trace");
  const game = GAME_SECTIONS.some((sec) => has(sec));
  const complete =
    s.completed.includes(L) ||
    (words >= wordsTotal && sound && trace && game);
  return { words, wordsTotal, sound, trace, game, complete };
}

export function tryCompleteLetter(letter: string): boolean {
  const s = read();
  const L = letter.toUpperCase();
  if (s.completed.includes(L)) return false;
  const check = getLetterChecklist(L, s);
  if (
    !(
      check.words >= check.wordsTotal &&
      check.sound &&
      check.trace &&
      check.game
    )
  ) {
    return false;
  }
  write({
    ...s,
    completed: [...s.completed, L],
    stickers: s.stickers.includes(L) ? s.stickers : [...s.stickers, L],
    stars: s.stars + 10,
  });
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("abc-letter-complete", { detail: { letter: L } }),
    );
  }
  return true;
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(
    (cb) => {
      if (typeof window === "undefined") return () => {};
      const handler = () => {
        // invalidate cache so next getSnapshot recomputes
        snapshotKey = "";
        cb();
      };
      window.addEventListener("abc-progress", handler);
      window.addEventListener("abc-profiles", handler);
      window.addEventListener("storage", handler);
      return () => {
        window.removeEventListener("abc-progress", handler);
        window.removeEventListener("abc-profiles", handler);
        window.removeEventListener("storage", handler);
      };
    },
    () => read(),
    () => empty,
  );
}

export function useDailyPath(): DailyPathState {
  const p = useProgress();
  return p.daily;
}
