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
    since: "v0.434",
    notes: "Clip 2 redone again. T's mouth stays shut. The tiger's mouth stays shut. Only the tree says I'm a tree. Leaves fall. Not confirmed.",
  },
  {
    id: "big-u-friends",
    title: "Big U meets friends",
    letter: "u",
    caseKind: "upper",
    kind: "friends",
    clips: "1 redone, 2–4 kept",
    file: "friends-clips/u-play-1.mp4",
    since: "v0.435",
    notes: "Clip 1 redone. Exactly two eyes on the left upright. The extra pair is gone. Clips 2–4 kept for now. Not confirmed.",
  },
  {
    id: "big-v-friends",
    title: "Big V meets friends",
    letter: "v",
    caseKind: "upper",
    kind: "friends",
    clips: "3 only, 2 kept",
    file: "friends-clips/v-play-1.mp4",
    since: "v0.436",
    notes: "Clip 3 redone again. V's mouth stays shut. Only the volcano says I'm Volcano. A small smoke puff. Not confirmed.",
  },
  {
    id: "big-w-friends",
    title: "Big W meets friends",
    letter: "w",
    caseKind: "upper",
    kind: "friends",
    clips: "3 and 4 redone, 1 and 2 kept",
    file: "friends-clips/w-play-1.mp4",
    since: "v0.438",
    notes: "Clip 3: only the pond drop says I'm Water. Clip 4 redone. The window says I'm Window. Its mouth stays small. No teeth. Not confirmed.",
  },
  {
    id: "big-y-friends",
    title: "Big Y meets friends",
    letter: "y",
    caseKind: "upper",
    kind: "friends",
    clips: "2–4 redone, 1 kept",
    file: "friends-clips/y-play-1.mp4",
    since: "v0.431",
    notes: "Clip 2 redone. The yo-yo by the tree is the only yo-yo and it says I'm Yo-yo. No second yo-yo. Clip 3: yellow crayon says I'm Yellow. Clip 4: yak says I'm Yak. Wide shot kept. Not confirmed.",
  },
  {
    id: "big-z-friends",
    title: "Big Z meets friends",
    letter: "z",
    caseKind: "upper",
    kind: "friends",
    clips: "3 and 4 redone, 1 and 2 kept",
    file: "friends-clips/z-play-1.mp4",
    since: "v0.433",
    notes: "Clips 1 and 2 kept. Clip 3 redone again: real steps toward the gate, then Z says This is the Zoo. The sweater was already on the zebra in clip 2. Clip 4 follows that end. The zipper says I'm Zipper. Not confirmed.",
  },
];
