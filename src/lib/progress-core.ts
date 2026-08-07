/** Shared progress shape + pure helpers (no storage). */

export type DailyGoals = {
  /** Watch a word video / unlock a word for today's letter */
  video: boolean;
  /** Trace today's letter */
  trace: boolean;
  /** Finish any mini-game for today's letter */
  game: boolean;
};

export type DailyPathState = {
  /** Local calendar day YYYY-MM-DD */
  dateKey: string;
  /** Featured letter for this day */
  letter: string;
  goals: DailyGoals;
  /** All 3 goals done today */
  completed: boolean;
  /** Consecutive days with a completed daily path */
  streak: number;
  /** Last day (YYYY-MM-DD) the daily path was fully completed */
  lastStreakDate: string | null;
  bestStreak: number;
};

export type ProgressState = {
  visited: string[];
  wordsSeen: string[];
  sections: string[];
  /** Letters that earned a completion sticker */
  completed: string[];
  /** Sticker ids (same as letter for v1) */
  stickers: string[];
  stars: number;
  /** Unlocked achievement ids */
  achievements: string[];
  /** Today's path + streak (per player) */
  daily: DailyPathState;
};

export function emptyDailyGoals(): DailyGoals {
  return { video: false, trace: false, game: false };
}

export function emptyDaily(letter = "A"): DailyPathState {
  return {
    dateKey: "",
    letter,
    goals: emptyDailyGoals(),
    completed: false,
    streak: 0,
    lastStreakDate: null,
    bestStreak: 0,
  };
}

export function emptyProgress(): ProgressState {
  return {
    visited: [],
    wordsSeen: [],
    sections: [],
    completed: [],
    stickers: [],
    stars: 0,
    achievements: [],
    daily: emptyDaily(),
  };
}

function normalizeDaily(raw: unknown): DailyPathState {
  const e = emptyDaily();
  if (!raw || typeof raw !== "object") return e;
  const d = raw as Partial<DailyPathState>;
  const goals = d.goals && typeof d.goals === "object" ? d.goals : {};
  return {
    dateKey: typeof d.dateKey === "string" ? d.dateKey : "",
    letter:
      typeof d.letter === "string" && /^[A-Za-z]$/.test(d.letter)
        ? d.letter.toUpperCase()
        : "A",
    goals: {
      video: Boolean((goals as DailyGoals).video),
      trace: Boolean((goals as DailyGoals).trace),
      game: Boolean((goals as DailyGoals).game),
    },
    completed: Boolean(d.completed),
    streak: typeof d.streak === "number" && d.streak >= 0 ? d.streak : 0,
    lastStreakDate:
      typeof d.lastStreakDate === "string" || d.lastStreakDate === null
        ? (d.lastStreakDate as string | null)
        : null,
    bestStreak:
      typeof d.bestStreak === "number" && d.bestStreak >= 0 ? d.bestStreak : 0,
  };
}

export function normalizeProgress(
  raw: Partial<ProgressState> | null | undefined,
): ProgressState {
  const e = emptyProgress();
  if (!raw || typeof raw !== "object") return e;
  return {
    visited: Array.isArray(raw.visited) ? [...raw.visited] : [],
    wordsSeen: Array.isArray(raw.wordsSeen) ? [...raw.wordsSeen] : [],
    sections: Array.isArray(raw.sections) ? [...raw.sections] : [],
    completed: Array.isArray(raw.completed) ? [...raw.completed] : [],
    stickers: Array.isArray(raw.stickers) ? [...raw.stickers] : [],
    stars: typeof raw.stars === "number" ? raw.stars : 0,
    achievements: Array.isArray(raw.achievements) ? [...raw.achievements] : [],
    daily: normalizeDaily(raw.daily),
  };
}

/** Local calendar key YYYY-MM-DD */
export function localDateKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function shiftDateKey(key: string, days: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const dt = new Date(y!, m! - 1, d!);
  dt.setDate(dt.getDate() + days);
  return localDateKey(dt);
}

/** Pick today's featured letter: first incomplete, else rotate by day. */
export function pickDailyLetter(
  completedLetters: string[],
  dateKey: string,
): string {
  const order = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const done = new Set(completedLetters.map((c) => c.toUpperCase()));
  for (const L of order) {
    if (!done.has(L)) return L;
  }
  // All stickers earned — still feature a letter so daily path stays fun
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) hash = (hash * 31 + dateKey.charCodeAt(i)) | 0;
  return order[Math.abs(hash) % 26]!;
}

export function dailyGoalsDone(g: DailyGoals): boolean {
  return g.video && g.trace && g.game;
}

export type AchievementDef = {
  id: string;
  title: string;
  hint: string;
  stars: number;
  check: (s: ProgressState) => boolean;
};

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_step",
    title: "First step",
    hint: "Visit any letter",
    stars: 3,
    check: (s) => s.visited.length >= 1,
  },
  {
    id: "word_watcher",
    title: "Word watcher",
    hint: "See 6 word posters",
    stars: 3,
    check: (s) => s.wordsSeen.length >= 6,
  },
  {
    id: "poster_pro",
    title: "Poster pro",
    hint: "See 30 word posters",
    stars: 5,
    check: (s) => s.wordsSeen.length >= 30,
  },
  {
    id: "game_on",
    title: "Game on",
    hint: "Finish any mini-game",
    stars: 3,
    check: (s) =>
      s.sections.some((x) =>
        /:(match|ispy|memory|story|cases)$/.test(x),
      ),
  },
  {
    id: "story_time",
    title: "Story time",
    hint: "Finish a letter story",
    stars: 4,
    check: (s) => s.sections.some((x) => x.endsWith(":story")),
  },
  {
    id: "trace_ace",
    title: "Trace ace",
    hint: "Trace a letter",
    stars: 3,
    check: (s) => s.sections.some((x) => x.endsWith(":trace")),
  },
  {
    id: "sticker_start",
    title: "Sticker start",
    hint: "Earn 1 letter sticker",
    stars: 5,
    check: (s) => s.completed.length >= 1 || s.stickers.length >= 1,
  },
  {
    id: "sticker_five",
    title: "Sticker squad",
    hint: "Earn 5 letter stickers",
    stars: 8,
    check: (s) => (s.completed.length || s.stickers.length) >= 5,
  },
  {
    id: "halfway_hero",
    title: "Halfway hero",
    hint: "Visit 13 letters",
    stars: 8,
    check: (s) => s.visited.length >= 13,
  },
  {
    id: "alphabet_star",
    title: "Alphabet star",
    hint: "Complete all 26 letters",
    stars: 26,
    check: (s) => s.completed.length >= 26,
  },
  {
    id: "daily_first",
    title: "Daily explorer",
    hint: "Finish today's path once",
    stars: 4,
    check: (s) => s.daily.bestStreak >= 1 || s.daily.completed,
  },
  {
    id: "streak_3",
    title: "3-day streak",
    hint: "Complete the daily path 3 days in a row",
    stars: 8,
    check: (s) => s.daily.bestStreak >= 3 || s.daily.streak >= 3,
  },
  {
    id: "streak_7",
    title: "Week warrior",
    hint: "Complete the daily path 7 days in a row",
    stars: 14,
    check: (s) => s.daily.bestStreak >= 7 || s.daily.streak >= 7,
  },
];

/** Unlock any newly earned achievements; returns updated state + newly unlocked ids. */
export function applyAchievements(state: ProgressState): {
  state: ProgressState;
  unlocked: AchievementDef[];
} {
  const have = new Set(state.achievements);
  const unlocked: AchievementDef[] = [];
  let stars = state.stars;
  for (const a of ACHIEVEMENTS) {
    if (have.has(a.id)) continue;
    if (a.check(state)) {
      have.add(a.id);
      unlocked.push(a);
      stars += a.stars;
    }
  }
  if (!unlocked.length) return { state, unlocked };
  return {
    state: {
      ...state,
      achievements: [...have],
      stars,
    },
    unlocked,
  };
}
