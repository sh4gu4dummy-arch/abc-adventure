# Meet A play-with-words plan

Saved 2026-09-17. **Do not shoot until they say go.**
If they ask for this plan later, remind them from this file — don’t start building unless they say to.

## Goal

Big **A** and little **a** get **extra Meet videos**: the letter **runs around and plays** with the words from that letter’s page (apple, ant, …).

This is **not** a remake of the intro Meet clip. Intro stays. Play clips are new files. In the app they play **as one Meet** (intro → play), same auto-chain as story theater.

## What stays

| File | Role |
|---|---|
| `public/videos/imagine/a.mp4` | Meet Big A intro (“Big… A…”) |
| `public/videos/imagine/a-little.mp4` | Meet little a intro (“little a”) |

Do **not** remake these unless they ask.

## A’s words (the page)

Apple · Ant · Airplane · Alligator · Astronaut · Anchor

Little abc mode uses the same six, lowercase UI.

Six words in one 6–10s shot is unreadable. Split **two 10s playgrounds per case** (3 words each).

## New files (keep separate on disk)

All **480p**, **10s**, **native diegetic sound** in the MP4 (no teacher voice baked in).

| File | Cast | Words |
|---|---|---|
| `public/videos/imagine/a-play-1.mp4` | Big A | apple, ant, airplane |
| `public/videos/imagine/a-play-2.mp4` | Big A | alligator, astronaut, anchor |
| `public/videos/imagine/a-little-play-1.mp4` | little a | same as play-1 |
| `public/videos/imagine/a-little-play-2.mp4` | little a | same as play-2 |

Later B–Z: same pattern, only after they approve A.

## How it plays in the app

Meet modal becomes a **short playlist** (files stay split):

1. Intro Meet  
2. Play-1  
3. Play-2  

One Play tap. Next clip starts when the last ends. No extra tap between. After play-2, replay from intro.

Letter arrows still go A↔B (whole playlist), not scene-by-scene.

## Look

**Big A:** red 3D clay A. Triangle **hole = background color** (not black, not a scribble). Tiny black-dot eyes. Mouth on the **crossbar**. Face on the **front only** (a turn shows a blank back). Glyph only — no extra arms/legs.

**little a:** Comic-sans / Fredoka **single-story a** (no upper tail). About **half** the stature of Big A. Lots of empty matching background. Tiny black-dot eyes. Same play plot, smaller world.

## Shot lists

Same plot for Big and little. Letter **travels** (changes place). No treadmill / running-in-place.

### Play-1 — yard

Sunny kid-yard. A runs (real distance).

1. **Apple** — a real red apple (fruit, **no face**). A rolls it, chases it, bumps it. Apple stays an apple.
2. **Ant** — one tiny ant on a path. A hops **beside** it, never squashes it. Ant keeps walking.
3. **Airplane** — kid-scale toy plane. It taxis then lifts **forward** (never backwards). A runs alongside on the ground.

### Play-2 — dock + sky

1. **Alligator** — friendly cartoon gator in water (not scary, not eating A). They splash. A stays on the bank/dock.
2. **Astronaut** — a kid in a small space suit **or** a kid-scale astronaut toy. They bounce/wave. A does **not** become the astronaut.
3. **Anchor** — one anchor on a small boat. A tugs the rope; the anchor splashes in and **stays down** (one-way).

## Sound + voice

- Play clips: **foley only** in the file (footsteps, apple roll, ant, plane whoosh, splash, rope). Letter may **laugh**. No teacher overlay baked in.
- Do **not** make the letter say “apple / ant / …” in the play clip — word videos already teach the words.
- Do **not** paste phonetics (`AY`, `ah`, `says ă like apple`) into the Imagine prompt as dialogue.
- Intro Meet still owns the name line. Play clips do not repeat “Hi I’m Big A.”
- Narration vs Video-sound toggle: Meet intro is self-voice; play clips follow the same Meet rule (clip sound, no teacher stack).

## QA before ship (every take)

**QA agent** looks at the 5-frame dump before anything replaces a public
file. Builder does not self-pass and ship. Fail = redo, don’t argue taste
nitpicks. Two usable takes: show the user, don’t pick.

Dump start / mid / end (`python3 scripts/qa-word-frames.py VIDEO.mp4`). Redo if any of this is true:

- Hole in A is black / scribbled / missing
- Face on the back of a turn
- Extra lumps, extra legs, extra apple, extra gator
- Running in place
- Plane flies backwards
- Apple has a face
- Alligator eats A or looks scary
- Anchor / apple / plane morphs into a person
- little a is a tiny **A** or has an upper tail

If two takes look usable: **show both, ask which to keep.** Do not pick and ship.

## Build order (trial)

1. Still of Big A in the play-1 yard (show them).
2. Big A **play-1** video only. Stop. They review.
3. If that’s good: little a play-1 (same plot, small a).
4. Then play-2 for Big, then little.
5. Wire the Meet playlist in the app when the first clip exists.
6. **Do not** batch B–Z.

## Not this plan

- Do not replace word-lesson videos (`a-apple.mp4` etc.).
- Do not concat the three Meet files into one mp4.
- Do not skip the intro Meet.
- Do not generate until they say **go**.
