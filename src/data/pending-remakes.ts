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
    clips: "3 only (1, 2, 4 kept)",
    file: "friends-clips/b-little-play-1.mp4",
    since: "v0.420",
    notes: "Clip 3 redone. Boat says I'm a boat. Bird, banana, and little b stay shut. Boat stays in the water. Not confirmed.",
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
    clips: "2 only, rejected and redone",
    file: "friends-clips/t-play-1.mp4",
    since: "v0.426",
    notes: "Clip 2 rejected for being a still line. Redone: tree says I'm a tree while leaves fall. Tiger, T, and train stay shut. End frame saved as the next lock. Not confirmed.",
  },
  {
    id: "big-u-friends",
    title: "Big U meets friends",
    letter: "u",
    caseKind: "upper",
    kind: "friends",
    clips: "all 4, full redo",
    file: "friends-clips/u-play-1.mp4",
    since: "v0.427",
    notes: "Full redo from the home tile. Both eyes stay on the left upright. Right side is blank. Lines: I'm Big U, I'm Umbrella, I'm Unicorn, I'm under the table. Not confirmed.",
  },
  {
    id: "big-v-friends",
    title: "Big V meets friends",
    letter: "v",
    caseKind: "upper",
    kind: "friends",
    clips: "3 only, 2 kept",
    file: "friends-clips/v-play-1.mp4",
    since: "v0.428",
    notes: "Clip 2 kept. Clip 3 redone. Only the volcano says I'm Volcano. V, violin, and van stay shut. A small smoke puff. Not confirmed.",
  },
  {
    id: "big-w-friends",
    title: "Big W meets friends",
    letter: "w",
    caseKind: "upper",
    kind: "friends",
    clips: "3 and 4 redone, 1 and 2 kept",
    file: "friends-clips/w-play-1.mp4",
    since: "v0.429",
    notes: "Clip 3 redone. No glass. The pond drop says I'm Water. Clip 4 redone. The window says I'm Window. Pond stays full. Not confirmed.",
  },
  {
    id: "big-x-friends",
    title: "Big X meets friends",
    letter: "x",
    caseKind: "upper",
    kind: "friends",
    clips: "4 only, 1–3 kept",
    file: "friends-clips/x-play-1.mp4",
    since: "v0.417",
    notes: "Clip 4 redone. The box already on the right next to X says I'm Box. No second box. Not confirmed.",
  },
  {
    id: "big-y-friends",
    title: "Big Y meets friends",
    letter: "y",
    caseKind: "upper",
    kind: "friends",
    clips: "2–4 redone, 1 kept",
    file: "friends-clips/y-play-1.mp4",
    since: "v0.418",
    notes: "Same wide shot. Yo-yo, Yellow, and Yak each say their own line. Y's mouth stays shut on those clips. Not confirmed.",
  },
  {
    id: "big-z-friends",
    title: "Big Z meets friends",
    letter: "z",
    caseKind: "upper",
    kind: "friends",
    clips: "all 4, full redo",
    file: "friends-clips/z-play-1.mp4",
    since: "v0.419",
    notes: "No bag. Zipper is the cloth zipper. Zoo is a place with no mouth. Z says This is the Zoo. Not confirmed.",
  },
];
