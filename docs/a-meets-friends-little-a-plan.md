# a meets friends — little a play-1 plan

**PLAN ONLY. Do not generate until the teacher says go.**

QA: audit this file — https://github.com/sh4gu4dummy-arch/abc-adventure/issues/4  
Big A take 2 is **PASS for now**. Do not remake Big A this round.

Target file: `public/videos/imagine/a-little-play-1.mp4`  
Button: **a meets friends** (little abc mode). Wire `FRIENDS_LOWER` only after a listen-sane take.

---

## Ash / User feedback (copy to QA — do not paraphrase away)

> good enough for pass for now but first. i need the time bar so I can skip ahead/back (btw what is that thing called again?) also the still for the letter by itself like the homescreen thumb has a blink at the beginning when starting the video, why? well when I watch again it didn't, check lmk if bug if not maybe just cache?

*(Seek bar shipped v0.313. Blink = home-tile poster vs first video frame; first load only.)*

> small things to watch out for for next rounds. but the quality of the imagery scenery is good. the sound decent hopefully it will have more exciting sound include my feedback. in the next start here. hope to see improvements for subsequent rounds. some minor misses, the A disappears at the very end, also the Apple gets elipsed behind the A and then a new apple appears, we need to make sure we lock the characters they should all remain visibile at all times to prevent this. make plan for small a, save in repo/update start here prepare for next audit.

Meaning:

1. **Keep** the yard/scenery quality. Do not flatten or cheapen the world.
2. Sound was **ok**. Next rounds need **more exciting diegetic sound** (real play: hops, roll, crawl, engine/whoosh, laughs). Not random UI beeps. Not quiet bed.
3. **Minor misses to hard-fail next time:**
   - Letter **gone at the end** (05-end must still show the hero).
   - Apple **hidden behind A**, then a **second apple** pops in. Eclipse-then-clone.
4. **Cast lock:** little a, apple, ant, airplane — **all four visible in every still** (start / 25 / mid / 75 / end) and throughout. Overlap is ok if you can still tell they are there. Covering one completely, then spawning a replacement = **FAIL**.
5. Subsequent rounds should **improve**, not drift.

---

## Standing gates (Friends, all future letters)

| Gate | Fail if |
|---|---|
| **Cast lock** | Any named friend missing from a 5-frame dump |
| **No clone** | Count of a prop changes (1 apple → 0 → 2) |
| **No vanish-end** | Hero cropped out / gone on **05-end** |
| **Speech** | Wrong speaker, missing line, A narrating everyone’s line |
| **True job** | Ant flies, plane reverse, apple grows a body |
| **Sound** | Silent / mean < −40 dB, or beep-spam instead of play foley |

Keep scenery as good as Big A take 2. Raise the mix: foley **under** voices, but **interesting**.

---

## Method (same as Big A take 2)

**B:** four **6s** I2V clips, **one line each**, concat → one 480×720 file.  
Each clip starts from the **previous clip’s last frame** (frame lock).

**C** (open-mouth stills) only if B still mushy after teacher listen.

Do **not** default back to one 15s multi-voice soup.

### Dialogue (little)

1. little **a** (bowl mouth): `I'm little a!`
2. Apple: `I'm Apple!`
3. Ant: `I'm Ant!`
4. Airplane: `I'm Airplane!`

USA cartoon kid. One speaker at a time. Only that mouth moves. Different voices (tiny a, fruit, tiny ant, plane). No teacher. No phonetics. No captions.

---

## Look lock

Match **Meet little a** (`public/videos/imagine/a-little.mp4`), **not** `letters/a-little.webp`.

- Comic-sans / Fredoka **single-story a** (no upper tail)
- About **half** Big A’s stature, lots of empty matching background
- Oval eyes on the **bowl**, not a tiny capital **A**
- No human arms

Yard can match Big A’s sunny kid-yard (scenery was the good part) — just a **smaller** a.

Source still: generate **one** little-a-in-yard still when they say go. Show Ash if two options. Do **not** I2V from the home tile.

---

## Beats

Same jobs as Big A, scaled down:

1. little a hops toward camera: **I'm little a!**
2. Nub-foot / body bump from the **side** (never stand on the apple). Apple rolls, **stays in view**: **I'm Apple!**
3. Ant crawls: **I'm Ant!** a hops **beside**
4. Plane taxis, flies **forward**: **I'm Airplane!** a hops beside

**Framing:** pull the camera back enough that a, apple, ant, **and** plane stay inside the 480×720 the whole 24s. Do not chase so tight that a walks off the right edge at the end.

**Apple:** keep it in a **gap** (left of a, or in front). Never fully behind the bowl, never a second apple.

---

## Prompt shape (speech-first, per clip)

Clip 1 example (others swap the one line + job):

```
MOST IMPORTANT — VOICE. Only the small red clay letter a talks. One line,
slow USA cartoon kid: "I'm little a!" Mouth on the bowl moves.

Nobody else talks. Apple, ant, plane: closed smiles, no lip flap.

Same sunny yard as the still. One small single-story a (half-size, no upper
tail, no arms). One apple, one ant, one toy plane. ALL FOUR stay fully
visible the whole clip — none walk off, none hide, none duplicate.
a hops toward camera on nub feet.

Foley louder than take-1 quiet beds: grass hops, light happy music under
the voice (voice still on top). No beeps. No captions.
```

Short negatives only: no arms, no extra a/apple/ant/plane, plane never backward, apple never behind the letter completely, hero in frame at the last frame.

---

## Encode

Concat four 6s → ~24s, 480×720, AAC. mean **−32…−18 dB**, max **≤ −3**.  
Do not overwrite anything until teacher + QA listen. New file is `a-little-play-1.mp4` (Big A file stays).

Seek bar already works on Friends.

---

## QA dump

`python3 scripts/qa-word-frames.py` on the **concat**. Also glance each clip’s 05-end before chaining.

Fail the concat if **any** of 01–05 is missing a, apple, ant, or plane, or if apple count ≠ 1.

Do **not** generate until teacher **go**.
