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

All **480×720** (same as Meet intro), **10s**, **native diegetic sound** in the MP4 (no teacher voice baked in). Not landscape 854×480.

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

## Look (match shipped Meet intro — do not invent a new A)

Lock the hero from `public/videos/imagine/a.mp4` / `a-little.mp4` and `public/letters/a.webp` / `a-little.webp`. Playlist must not jump to a different mascot.

**Big A (as shipped Meet):** glossy red/coral 3D clay A. Triangle **hole = background color** (not black, not a scribble). Face on the **crossbar** (eyes + smile). Face on the **front only** (a turn shows a blank back). **Nub feet OK** (intro already has them) — no full human arms/legs, no extra limbs. Do **not** swap to a “tiny black-dot / no feet” redesign unless they remake the intro first.

**little a:** Comic-sans / Fredoka **single-story a** (no upper tail). About **half** the stature of Big A. Lots of empty matching background. Match `a-little.mp4` face style. Same play plot, smaller world.

## Shot lists

Same plot for Big and little. Letter **travels** (changes place). No treadmill / running-in-place.

### Play-1 — yard

Sunny kid-yard. A runs (real distance).

1. **Apple** — a real red apple (fruit, **no face**). A rolls it, chases it, bumps it. Apple stays an apple.
2. **Ant** — **one** ant on a path, big enough to read in a mid still (not a speck). A hops **beside** it, never squashes it. Ant keeps walking.
3. **Airplane** — kid-scale toy plane. It taxis then lifts **forward** (never backwards). A runs alongside on the ground.

### Play-2 — dock + sky

1. **Alligator** — friendly cartoon gator in water (not scary, not eating A). They splash. A stays on the bank/dock.
2. **Astronaut** — **one kid-scale astronaut toy** (not a live kid). It bounces/waves. A does **not** become the astronaut; A is never inside the suit.
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

Dump all 5 frames (`python3 scripts/qa-word-frames.py VIDEO.mp4`). Redo if any of this is true:

- Hero does not match shipped Meet A / little a (wrong color family, missing nub feet when intro has them, new eye style, different clay)
- Hole in A is black / scribbled / missing
- Face on the back of a turn
- Extra lumps, human arms, extra legs beyond nub feet, extra apple, extra gator, extra ant
- Running in place / treadmill
- Plane flies backwards
- Apple has a face
- Ant too small to see at mid frame
- Alligator eats A or looks scary; more than one gator
- Astronaut is a live kid, or A is wearing the suit
- Anchor / apple / plane / ant morphs into a person or into A
- little a is a tiny **A** or has an upper tail
- Wrong size: not 480×720

If two takes look usable: **show both, ask which to keep.** Do not pick and ship.

## Build order (trial)

1. Still of Big A in the play-1 yard (show them).
2. Big A **play-1** video only. Stop. They review.
3. If that’s good: little a play-1 (same plot, small a).
4. Then play-2 for Big, then little.
5. App chain: only append a play file once it exists. After play-1 ships, Meet = intro → play-1 (loop). After play-2 ships, Meet = intro → play-1 → play-2. Do not wire a missing URL.
6. **Do not** batch B–Z.

## Beat timing (each 10s clip)

Rough thirds so props don’t smear together:

| Seconds | Play-1 | Play-2 |
|---|---|---|
| 0–3.5 | apple | alligator |
| 3.5–7 | ant | astronaut toy |
| 7–10 | airplane | anchor |

One clear prop per third. Hard cut or obvious handoff OK. Don’t morph apple→ant.

## Still → video

1. I2I / still of Big A in the **yard** (play-1) matching Meet intro hero. Show them.
2. Only then I2V play-1 from that still.
3. Same for little / play-2 stages.

## QA notes on this plan (2026-09-17 — ABC-Adventure-Bot1)

Mistakes found before the edits above:

1. **Look fought the shipped intro.** Plan said tiny black-dot eyes and “glyph only, no legs.” Meet `a.mp4` already uses crossbar face + **nub feet** and bigger toy eyes. A playlist that swaps mascots will look broken.
2. **“480p” was vague.** Meet intros are **480×720**. Landscape 480p would break the Meet player.
3. **Astronaut “kid or toy”** invited a second human hero. Locked to **toy only**.
4. **Tiny ant** would vanish at 480×720 mid-shot. Ant must read in a still.
5. **Wiring “when first clip exists”** needed an explicit partial playlist (don’t 404 play-2).
6. **No beat clock** for 3 words in 10s — morph risk. Added thirds.

Still good: intro stays; files split; no teacher voice in play; apple no face; plane forward; anchor one-way; trial Big play-1 first; no B–Z batch; QA before ship; 2 takes → show user.

## Not this plan

- Do not replace word-lesson videos (`a-apple.mp4` etc.).
- Do not concat the three Meet files into one mp4.
- Do not skip the intro Meet.
- Do not generate until they say **go**.
