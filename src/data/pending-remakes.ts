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
    since: "v0.454",
    notes: "Clip 3 redone. Only the boat's mouth moves. Little b, the banana, and the bird stay speechless. Not confirmed.",
  },
  {
    id: "little-c-friends",
    title: "little c meets friends",
    letter: "c",
    caseKind: "lower",
    kind: "friends",
    clips: "2 only (1, 3, 4 kept)",
    file: "friends-clips/c-little-play-1.mp4",
    since: "v0.445",
    notes: "Clip 2 redone. Only the cloud says I'm Cloud. Little c, the cookie, and the cup stay shut. Not confirmed.",
  },
  {
    id: "little-d-friends",
    title: "little d meets friends",
    letter: "d",
    caseKind: "lower",
    kind: "friends",
    clips: "all 4 redone",
    file: "friends-clips/d-little-play-1.mp4",
    since: "v0.445",
    notes: "All 4 redone so little d stays light blue. 1 little d. 2 donut. 3 drum. 4 the duck says Quack, I'm a duck. Not confirmed.",
  },
  {
    id: "big-t-friends",
    title: "Big T meets friends",
    letter: "t",
    caseKind: "upper",
    kind: "friends",
    clips: "1 ok. 2 3 4 redone same olive",
    file: "friends-clips/t-play-1.mp4",
    since: "v0.471",
    notes: "Clip 1 stays. Clips 2-4 redone so Big T stays olive, not orange. 2 tree says I'm a tree. 3 tiger says I'm Tiger. 4 train says I'm Train. One T. Not confirmed.",
  },
  {
    id: "big-u-friends",
    title: "Big U meets friends",
    letter: "u",
    caseKind: "upper",
    kind: "friends",
    clips: "2 3 4 from the saved file, 1 confirmed",
    file: "friends-clips/u-play-1.mp4",
    since: "v0.473",
    notes: "Clip 1 stays confirmed. Clips 2-4 in docs/library/pending are cut from the saved file. Both eyes on the left stem. Not fully confirmed.",
  },
  {
    id: "big-v-friends",
    title: "Big V meets friends",
    letter: "v",
    caseKind: "upper",
    kind: "friends",
    clips: "3 only, again",
    file: "friends-clips/v-play-1.mp4",
    since: "v0.468",
    notes: "Clip 3 redone again. Only the volcano says I'm Volcano. Big V's mouth stays shut. No text. Not confirmed.",
  },
  {
    id: "big-w-friends",
    title: "Big W meets friends",
    letter: "w",
    caseKind: "upper",
    kind: "friends",
    clips: "all 4 redone",
    file: "friends-clips/w-play-1.mp4",
    since: "v0.469",
    notes: "The two-W file is gone from the saved game. One W. No eyes in the air. Not confirmed.",
  },
  {
    id: "big-y-friends",
    title: "Big Y meets friends",
    letter: "y",
    caseKind: "upper",
    kind: "friends",
    clips: "3 and 4 redone, 2 ok",
    file: "friends-clips/y-play-1.mp4",
    since: "v0.464",
    notes: "Clip 2 kept. Clip 3 redone, only the crayon says I'm Yellow. Clip 4 redone, one Y only, the yak says I'm Yak. No second letter. Not confirmed.",
  },
];
