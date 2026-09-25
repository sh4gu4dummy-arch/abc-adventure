/**
 * Local remakes Ash has not confirmed yet.
 * `parts` are the short clips in docs/library/pending (served at /dev-clips).
 * The Dev tab plays those, not the full four-clip file.
 * `file` is the full video the letter page still uses.
 */
export type PendingKind = "friends" | "meet" | "story" | "word";

export type PendingPart = {
  label: string;
  file: string;
};

export type PendingRemake = {
  id: string;
  title: string;
  letter: string;
  caseKind: "upper" | "lower";
  kind: PendingKind;
  clips: string;
  file: string;
  parts: PendingPart[];
  since: string;
  notes: string;
};

function clip(name: string, n: number): PendingPart {
  return { label: `Clip ${n}`, file: `dev-clips/${name}` };
}

export const PENDING_REMAKES: PendingRemake[] = [
  {
    id: "little-c-friends",
    title: "little c meets friends",
    letter: "c",
    caseKind: "lower",
    kind: "friends",
    clips: "all 4 redone",
    file: "friends-clips/c-little-play-1.mp4",
    parts: [
      clip("little-c-clip1.mp4", 1),
      clip("little-c-clip2.mp4", 2),
      clip("little-c-clip3.mp4", 3),
      clip("little-c-clip4.mp4", 4),
    ],
    since: "v0.489",
    notes: "Clip 1 redone. Only little c says I'm little c. Same kitchen. 2 cloud. 3 cup. 4 cookie.",
  },
  {
    id: "little-d-friends",
    title: "little d meets friends",
    letter: "d",
    caseKind: "lower",
    kind: "friends",
    clips: "all 4, one at a time",
    file: "friends-clips/d-little-play-1.mp4",
    parts: [
      clip("little-d-clip1.mp4", 1),
      clip("little-d-clip2.mp4", 2),
      clip("little-d-clip3.mp4", 3),
      clip("little-d-clip4.mp4", 4),
    ],
    since: "v0.484",
    notes: "Clip 1 redone. Black dot eyes, no white eyes, no pink cheeks. Clips 2-4 locked to that face. 1 little d. 2 donut. 3 drum. 4 the duck says Quack, I'm a duck.",
  },
  {
    id: "big-t-friends",
    title: "Big T meets friends",
    letter: "t",
    caseKind: "upper",
    kind: "friends",
    clips: "all 4 redone",
    file: "friends-clips/t-play-1.mp4",
    parts: [
      clip("big-t-clip1.mp4", 1),
      clip("big-t-clip2.mp4", 2),
      clip("big-t-clip3.mp4", 3),
      clip("big-t-clip4.mp4", 4),
    ],
    since: "v0.485",
    notes: "Clip 1 redone again. Only Big T says I'm Big T. Same olive. Clips 2-4 locked to it. 2 tree. 3 tiger. 4 train.",
  },
  {
    id: "big-u-friends",
    title: "Big U meets friends",
    letter: "u",
    caseKind: "upper",
    kind: "friends",
    clips: "2 redone, 3 and 4 locked to it",
    file: "friends-clips/u-play-1.mp4",
    parts: [
      clip("big-u-clip2.mp4", 2),
      clip("big-u-clip3.mp4", 3),
      clip("big-u-clip4.mp4", 4),
    ],
    since: "v0.486",
    notes: "Clip 1 stays. Clip 2 redone. Eyes stay on the left stem. Uniform width. No fat base. 2 umbrella. 3 unicorn. 4 the girl says I'm under the table.",
  },
  {
    id: "big-v-friends",
    title: "Big V meets friends",
    letter: "v",
    caseKind: "upper",
    kind: "friends",
    clips: "3 only",
    file: "friends-clips/v-play-1.mp4",
    parts: [clip("big-v-clip3.mp4", 3)],
    since: "v0.468",
    notes: "Only the volcano says I'm Volcano. Big V's mouth stays shut. No text.",
  },
  {
    id: "big-w-friends",
    title: "Big W meets friends",
    letter: "w",
    caseKind: "upper",
    kind: "friends",
    clips: "all 4, one at a time",
    file: "friends-clips/w-play-1.mp4",
    parts: [
      clip("big-w-clip1.mp4", 1),
      clip("big-w-clip2.mp4", 2),
      clip("big-w-clip3.mp4", 3),
      clip("big-w-clip4.mp4", 4),
    ],
    since: "v0.469",
    notes: "One W. No eyes in the air.",
  },
  {
    id: "big-y-friends",
    title: "Big Y meets friends",
    letter: "y",
    caseKind: "upper",
    kind: "friends",
    clips: "4 only",
    file: "friends-clips/y-play-1.mp4",
    parts: [clip("big-y-clip4.mp4", 4)],
    since: "v0.480",
    notes: "Clip 3 stays. Clip 4: only the yak says I'm Yak. One Y.",
  },
];
