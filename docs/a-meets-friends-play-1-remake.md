# A Meets Friends — play-1 remake plan

Saved 2026-09-17. **PLAN ONLY. Do not generate until the teacher says go.**

QA: audit this file (and the prompt) on GitHub **before** a shoot.
Desk: https://github.com/sh4gu4dummy-arch/abc-adventure/issues/1  
This round’s issue: https://github.com/sh4gu4dummy-arch/abc-adventure/issues/3

Shipped trial clip stays until a new take is approved:
`public/videos/imagine/a-play-1.mp4` (yard, apple/ant/plane — hops more than it plays).

Teacher: art style is **good**. Keep the clay A and the yard. Redo for
**talking intros**, **real play**, **more sound**, **more fun**.

---

## What this clip is

**A MEETS FRIENDS** (not Meet A). Meet A stays the name intro.

This file: Big A + **apple, ant, airplane** in the same sunny yard.

**15 seconds**, **480×720**, I2V from the locked yard still
(`docs/audit/a-play-1/00-source-still.jpg`). Native sound in the mp4
(cartoon voices + foley). No teacher overlay.

---

## Standing rule — things act like what they are

Every letter and every word must show a **true, kid-readable fact** of
that thing. Style can be clay/cartoon. Physics and job cannot be random.

| Thing | Must do (true) | Must not |
|---|---|---|
| **A** | Walk/hop on its two legs, talk from the fork, stay the letter A | Human arms, face on the back, treadmill hop |
| **Apple** | Stay a **fruit** (red, stem, leaf). **Roll / bump / bounce** | Grow legs, become a person, second apple, morph into A |
| **Ant** | Stay an **ant**. **Crawl** on six legs along the path. Tiny. | Fly, walk upright like a person, vanish, extra ants |
| **Airplane** | Stay a **plane**. **Taxi then fly forward** (nose the way it goes) | Fly backward, walk, become a bird, sit the whole time |
| Later: alligator | Water, friendly swim/snap (not eat A) | Walk like a person, smash, scary |
| Later: astronaut | Toy figure in a suit | Live kid, A wearing the suit |
| Later: anchor | Heavy, **drops and stays down** | Floats away, clones |

This rule is for **all future Friends clips**, not only A.

---

## Dialogue (in the video, USA kid cartoon voices)

Four lines, in this order, **heard in the file**:

1. **A:** `I'm Big A!`  
   Slow enough: I'm… Big… A. Not “IMBIGA.” Not “Hi I'm Big A” (Meet already did hi).
2. **Apple:** `I'm Apple!`
3. **Ant:** `I'm Ant!`
4. **Airplane:** `I'm Airplane!`

One speaker at a time. No extra words. No phonetics (`AY`, `ah`, `ă`).
No teacher. No second language. Each line matches a **visible action**.

### Apple may smile (speech only)

Old gate “apple has zero face” fights “I'm Apple!”  
**Allowed:** the fruit keeps apple shape + stem + leaf; a **tiny toy smile**
so it can talk.  
**Fail:** human head, arms, legs, a second apple-person, eyes bigger than
the fruit.

Ant: tiny cartoon eyes OK; it still **crawls**.  
Plane: toy cockpit “eyes” OK; it still **flies forward**.

---

## Beats (order, not a stopwatch)

Imagine will not cut at exact seconds. Fail only if a line is missing,
two talk at once, or a thing does the wrong job.

1. **A** hops toward the camera on nub feet and says **I'm Big A!**
2. A **bumps** the apple; the apple **rolls**; apple says **I'm Apple!**
3. The ant **crawls** along the path (real crawl, not a slide); ant says
   **I'm Ant!** A hops **beside** it (never squashes).
4. The plane **taxis, then lifts forward**; plane says **I'm Airplane!**
   A runs alongside on the grass. Plane never reverses.

More play than the trial: contact, chase, crawl, takeoff — not a group photo.

---

## Look lock (do not redesign)

Same A as Meet intro / trial still:

- Glossy red/coral 3D clay **A**
- Triangle hole = **background**, not black
- Oval toy eyes on the **legs**, smile in the **fork**, **blank crossbar**
- Nub feet. **Zero human arms / hands**
- Face on the **front only**
- One A. One apple. One ant. One plane.
- Yard flowers have no faces

Source still: `docs/audit/a-play-1/00-source-still.jpg`  
Do **not** I2V from `letters/a.webp`.

---

## Sound (must be interesting, must be real)

Bake a **full mix** as if there will be no overlay:

- Four clear voice lines (above)
- A’s hops / grass
- Apple **roll** (woody fruit, not a ball bounce only)
- Ant **tiny crawl** ticks
- Plane **engine + whoosh** on takeoff (not a random beep)
- Light happy music under, quieter than voices
- **No** UI beeps, no reverse whoosh, no scary stingers

Loudness after encode (standing):

- mean **−32…−20 dB**, max **≤ −3 dB**
- mean **< −40 dB** = do not ship
- Proof with `volumedetect` on `/tmp` before replacing the public file

---

## Encode

- **15s**, **480×720**, 24 fps, AAC stereo
- Do not concat Meet intro into this file
- Do not overwrite `a-play-1.mp4` until teacher + QA pass. Keep the trial
  in git. New take lives in artifacts until READY, then replace public file.

---

## Full I2V prompt (copy this)

Use I2V from `docs/audit/a-play-1/00-source-still.jpg`. Duration **15**.
Portrait 2:3 / 480×720.

```
Same locked camera and same sunny kid-yard as the still. Keep the exact
same glossy red clay letter A: triangle hole matches the sky/grass, oval
toy eyes on the two legs, smile in the fork, blank crossbar, nub feet,
NO human arms, NO hands, face on the front only. Exactly one A. Exactly
one red apple fruit with a stem and a tiny leaf. Exactly one small ant
on the dirt path. Exactly one toy airplane on the grass, nose pointing
right.

This is a fun 15-second playground, not a posed photo. The letter A
travels (changes place). No treadmill. No morphs. No extra A. No people.
No readable text on screen.

Beat 1: A hops toward camera on its nub feet and says in a clear USA
cartoon kid voice, slowly: "I'm Big A!"

Beat 2: A bumps the apple with a foot. The apple ROLLS like a real fruit
(round, stem up). The apple is still an apple. A tiny toy smile is OK so
it can talk — no arms, no legs, no human head. Apple says: "I'm Apple!"

Beat 3: The ant CRAWLS on six legs along the path (real crawl, not
flying, not walking upright). Ant is clearly an ant. It says: "I'm Ant!"
A hops beside the ant and does not squash it.

Beat 4: The toy airplane taxis then LIFTS and FLIES FORWARD to the right
(never backward). It says: "I'm Airplane!" A runs along the grass under
it.

Sound: all four lines clearly spoken, one at a time. Foley: grass hops,
apple roll, tiny ant crawl ticks, plane engine and whoosh on takeoff.
Light happy music under the voices, quieter than speech. No beeps, no
horror, no teacher narrator.

USA English only. Do not add extra words. Do not say letter sounds or
phonetics.
```

Negatives to keep in the tool call / retry:

- zero human arms, zero hands, zero second A
- plane never flies backward
- ant never flies, never stands up
- apple never grows limbs, never becomes a person
- hole in A never black / scribbled
- no face on the back of A
- no on-screen captions

---

## QA gates (try to fail)

Dump 5 frames (`01-start` … `05-end`) plus listen to the audio.

**Hard fail**

- Missing any of the four lines (or wrong words)
- Extra A / human arms / apple with a human body
- Plane reverse
- Ant flying or walking like a person
- Apple not a fruit
- Treadmill (end pose = start, no travel, no contact)
- Not 480×720, or mean < −40 dB
- Teacher voice / phonetics / extra sentence
- Hero left the frame for good (gone, not a soft edge crop)

**Soft miss** (list even if you ship a trial)

- Lines rushed / overlap
- Weak crawl or weak takeoff
- Quiet music covering speech
- End crop of A (still readable = soft)

**Mid still:** someone is **doing** the current beat (roll / crawl / fly),
not a group photo.

Two usable takes: **show the teacher both**. Do not pick.

---

## Open for QA (debate before go)

1. **15s vs 10s** — four lines + play in 10s will rush. Plan is 15s.
2. **Apple toy-smile** — needed to say “I'm Apple!” without growing a body.
3. Prompt: anything that will spawn arms / clone A / reverse the plane?

Do **not** shoot until the teacher says **go** after this audit.
