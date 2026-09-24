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
    since: "v0.444",
    notes: "Clip 3 redone again. Only the boat says I'm a boat. Little b, the banana, and the bird stay shut. The boat stays in the water. Not confirmed.",
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
    clips: "all 4 redone",
    file: "friends-clips/t-play-1.mp4",
    since: "v0.446",
    notes: "All 4 redone so Big T stays the home-tile red-orange. 1 Big T. 2 the tree. 3 the tiger. 4 the train. Not confirmed.",
  },
  {
    id: "big-u-friends",
    title: "Big U meets friends",
    letter: "u",
    caseKind: "upper",
    kind: "friends",
    clips: "3 redone, 1 and 2 kept, 4 still the girl under the table",
    file: "friends-clips/u-play-1.mp4",
    since: "v0.447",
    notes: "The girl-and-picnic clip is redone. Same purple U, both eyes on the left upright. The unicorn says I'm Unicorn. No girl. No floating head. Clip 4 still has the girl under the table, so that cut jumps. Not confirmed.",
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
