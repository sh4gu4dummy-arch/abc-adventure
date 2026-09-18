# little a meets friends — take 2 plan

**PLAN ONLY. Do not generate until the teacher says go.**  
**This is the shoot doc** for take 2. Take 1 FAIL inventory: `docs/audit/a-little-play-1/QA.md`.

Take 1 (`friends-clips/a-little-play-1.mp4`) is a **FAIL**. Do not defend it.  
**Artifacts-first:** new take lands in artifacts / a new filename until teacher + QA PASS. Do **not** clobber FAIL inventory until PASS.

Issue: https://github.com/sh4gu4dummy-arch/abc-adventure/issues/4

---

## Ash / User to QA supervisor (copy — do not paraphrase away)

> ABC little a video, you have GOT TO BE KIDDING ME.
> 1. not even the right little a (wrong font, doesn't match our character)
> 2. NOT EVEN MEETING THE RIGHT FRIENDS why would we want him meeting the same friends as big A, this is absurdly ridiculous, how could you let this happen? do I even need you? you are in danger of being fired, I cannot except you running an entire team of QA with this janky junk getting shipped. I'm shocked.

---

## Why take 1 is FAIL (not “soft”)

1. **Wrong letter.** Shipped little a drifted into a lumpy blob. Must match **Meet little a** (`a-little.mp4`): Comic-sans / Fredoka **single-story a**, oval eyes on the bowl, half stature, no extra lobe, no tiny capital A.
2. **Wrong friends.** Copied Big A’s cast (apple, ant, airplane). Little mode is a **different show**. Use the **other** A words.

| Mode | Friends (3) |
|---|---|
| Big A (shipped, pass-for-now) | Apple, Ant, Airplane |
| little a (take 2) | **Alligator, Astronaut, Anchor** |

Standing rule for every letter: **Big Friends ≠ little Friends.** Split the 6 words: first three Big, last three little — unless the teacher names a different split.

Product check before LOCK / before I2V: Meet path `public/videos/imagine/a-little.mp4` + last-3 trio from `wordsForCase`.

---

## Look lock (hard)

Match Meet little a. Before go: **source still side-by-side** vs `docs/audit/a-little-play-1/meet-a-little-01.jpg` (or first Meet frame). Fail the still if the glyph isn’t our little a.

---

## True nature (must / must not)

| Thing | Must | Must not |
|---|---|---|
| little a | Meet single-story look; hops; talks from bowl | double-story; lumpy cousin; tiny capital A; home-tile I2V |
| Alligator | friendly swim/snap/crawl by water | eat a; scary gore; walk like a person |
| Astronaut | **one kid-scale toy** in a suit; float or boot-walk | live / photoreal kid; a inside the suit; extra humans |
| Anchor | heavy; **drops and stays down** (one-way) | floats away; clones |

Tiny toy smiles OK on friends that talk. Cast lock = **identifiable** a + alligator + astronaut + anchor in every still (silhouette OK; cover-then-spawn = fail). Count those four in **every** still.

---

## Method B

Four **6s** clips, one line each, frame-lock, concat → ~24s · 480×720 → `public/friends-clips/a-little-play-1.mp4` only after PASS. curl 200 before claiming it plays.

**Hard before concat:** each clip’s **05-end** must pass cast + count==1 for a/alligator/astronaut/anchor. Else re-shoot that clip (no frame-lock poison).

### Dialogue

1. little **a**: `I'm little a!`
2. Alligator: `I'm Alligator!`
3. Astronaut: `I'm Astronaut!`
4. Anchor: `I'm Anchor!`

Only that mouth moves. Different voices. No teacher. No captions.

### Beats (sketch)

1. little a hops: **I'm little a!**
2. Alligator by water, friendly: **I'm Alligator!** a beside (not eaten)
3. Astronaut toy: **I'm Astronaut!** a hops beside
4. Anchor drops, stays: **I'm Anchor!** a hops beside

---

## Encode / sound

mean **−32…−18 dB**, max **≤ −3**. Exciting play foley (splash, boot, chain/drop, hops) under voices; **voices on top** (bury-speech = fail). No beep-spam.

---

## QA fail if

- glyph ≠ Meet little a
- any of apple/ant/plane as the three friends
- Big/little same cast
- true-nature must-nots
- cast missing on any still / 05-end / per-clip end
- loudness / bury-speech fail

Do **not** generate until **go**.
