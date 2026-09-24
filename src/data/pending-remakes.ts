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
    clips: "1 redone, 2 3 4 still orange",
    file: "friends-clips/t-play-1.mp4",
    since: "v0.459",
    notes: "Clip 1 redone. Big T is the yellow-green home tile, not orange. Only Big T says I'm Big T. Clips 2-4 are still the old orange T, so the cut jumps. Not confirmed.",
  },
  {
    id: "big-u-friends",
    title: "Big U meets friends",
    letter: "u",
    caseKind: "upper",
    kind: "friends",
    clips: "1 confirmed, 2 still waiting",
    file: "friends-clips/u-play-1.mp4",
    since: "v0.460",
    notes: "Clip 1 is OK and stays in the game. Clip 2 is the reshoot, not confirmed. Clips 3 and 4 were not confirmed.",
  },
  {
    id: "big-v-friends",
    title: "Big V meets friends",
    letter: "v",
    caseKind: "upper",
    kind: "friends",
    clips: "3 only, 2 kept",
    file: "friends-clips/v-play-1.mp4",
    since: "v0.448",
    notes: "Clip 3 redone. No writing on the screen. V's mouth stays shut. Both eyes stay on the left stroke. Only the volcano says I'm Volcano. Not confirmed.",
  },
  {
    id: "big-w-friends",
    title: "Big W meets friends",
    letter: "w",
    caseKind: "upper",
    kind: "friends",
    clips: "all 4 redone",
    file: "friends-clips/w-play-1.mp4",
    since: "v0.449",
    notes: "All 4 redone wider. 1 Big W. 2 whale. 3 water drop. 4 window, small mouth, no teeth. Same blue W. Not confirmed.",
  },
  {
    id: "big-y-friends",
    title: "Big Y meets friends",
    letter: "y",
    caseKind: "upper",
    kind: "friends",
    clips: "4 redone, 3 ok",
    file: "friends-clips/y-play-1.mp4",
    since: "v0.450",
    notes: "Clip 3 kept. Clip 4 redone. The yak says I'm Yak. Y's mouth stays shut. One yo-yo by the tree. Not confirmed.",
  },
];
