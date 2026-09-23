/**
 * Local remakes Ash has not confirmed yet.
 * Builder: add a row when a clip is in the app but not on GitHub.
 * After Ash pastes CONFIRM in chat: commit that file, delete the row.
 * After REJECT: revert the file, delete the row.
 */
export type PendingKind = "friends" | "meet" | "story" | "word";

export type PendingRemake = {
  id: string;
  title: string;
  letter: string;
  caseKind: "upper" | "lower";
  kind: PendingKind;
  clips: string;
  file: string;
  since: string;
  notes: string;
};

export const PENDING_REMAKES: PendingRemake[] = [
  {
    id: "little-b-friends",
    title: "little b meets friends",
    letter: "b",
    caseKind: "lower",
    kind: "friends",
    clips: "3–4 (1–2 kept)",
    file: "friends-clips/b-little-play-1.mp4",
    since: "v0.403",
    notes: "Boat stays in the pond. Clip 3 chorus remake. Clip 4 kept.",
  },
  {
    id: "little-c-friends",
    title: "little c meets friends",
    letter: "c",
    caseKind: "lower",
    kind: "friends",
    clips: "2 only (1, 3, 4 kept)",
    file: "friends-clips/c-little-play-1.mp4",
    since: "v0.412",
    notes: "Clip 2 reshot. Only the cloud says I'm Cloud. Cookie smile opens a little after the line. 1, 3, 4 kept. Not confirmed.",
  },
  {
    id: "little-d-friends",
    title: "little d meets friends",
    letter: "d",
    caseKind: "lower",
    kind: "friends",
    clips: "1 and 3 redone, 2 kept, 4 still Doc",
    file: "friends-clips/d-little-play-1.mp4",
    since: "v0.413",
    notes: "Clip 2 kept (I'm Donut). Clips 1 and 3 redone. Clip 4 still says I'm Doc, not I'm Duck. Not confirmed.",
  },
  {
    id: "big-t-friends",
    title: "Big T meets friends",
    letter: "t",
    caseKind: "upper",
    kind: "friends",
    clips: "2 and 3 redone, 1 and 4 kept",
    file: "friends-clips/t-play-1.mp4",
    since: "v0.414",
    notes: "Clips 2 and 3 redone. Tree says I'm a tree, mouth only. Tiger says I'm Tiger, mouth only. 1 and 4 kept. Not confirmed.",
  },
  {
    id: "big-u-friends",
    title: "Big U meets friends",
    letter: "u",
    caseKind: "upper",
    kind: "friends",
    clips: "all 4, full redo",
    file: "friends-clips/u-play-1.mp4",
    since: "v0.415",
    notes: "Full redo from the home-tile U. Thin even stroke, black-dot eyes, no square base. Not confirmed.",
  },
  {
    id: "big-v-friends",
    title: "Big V meets friends",
    letter: "v",
    caseKind: "upper",
    kind: "friends",
    clips: "local remake",
    file: "friends-clips/v-play-1.mp4",
    since: "local vs git",
    notes: "File differs from GitHub. Watch, then confirm or reject.",
  },
  {
    id: "big-w-friends",
    title: "Big W meets friends",
    letter: "w",
    caseKind: "upper",
    kind: "friends",
    clips: "3 and 4 redone, 1 and 2 kept",
    file: "friends-clips/w-play-1.mp4",
    since: "v0.416",
    notes: "Pond stays full. Whale floats, no tail slap. Water says I'm Water. Window says I'm Window. Not confirmed.",
  },
  {
    id: "big-x-friends",
    title: "Big X meets friends",
    letter: "x",
    caseKind: "upper",
    kind: "friends",
    clips: "local remake",
    file: "friends-clips/x-play-1.mp4",
    since: "local vs git",
    notes: "File differs from GitHub. Watch, then confirm or reject.",
  },
  {
    id: "big-y-friends",
    title: "Big Y meets friends",
    letter: "y",
    caseKind: "upper",
    kind: "friends",
    clips: "local remake",
    file: "friends-clips/y-play-1.mp4",
    since: "local vs git",
    notes: "File differs from GitHub. Watch, then confirm or reject.",
  },
  {
    id: "big-z-friends",
    title: "Big Z meets friends",
    letter: "z",
    caseKind: "upper",
    kind: "friends",
    clips: "local remake",
    file: "friends-clips/z-play-1.mp4",
    since: "local vs git",
    notes: "File differs from GitHub. Watch, then confirm or reject.",
  },
];
