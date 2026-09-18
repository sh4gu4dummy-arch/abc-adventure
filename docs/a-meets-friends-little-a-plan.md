# a meets friends — little a play-1 plan

**PLAN ONLY. Do not generate until the teacher says go.**

QA: https://github.com/sh4gu4dummy-arch/abc-adventure/issues/4  
Take 1 = **FAIL (product)** — see `docs/audit/a-little-play-1/QA.md`. Keep bad take as inventory; do not overwrite until Ash says.

### Product brief (why this cast)

This clip is **little a** meeting **alligator / astronaut / anchor** because `wordsForCase` uses the **last 3** A words for little abc.

`src/data/alphabet.ts` A words: Apple, Ant, Airplane, Alligator, Astronaut, Anchor.  
**Big** Friends = first 3 (apple, ant, airplane). **Little** Friends = last 3 (alligator, astronaut, anchor).  
Big and little **never share the same three friends**.

Target: `public/videos/imagine/a-little-play-1.mp4` (+ friends-clips copy when shipping).  
Wire `FRIENDS_LOWER` only after a listen-sane take.

---

## Ash / User feedback (copy — do not paraphrase away)

> ABC little a video, you have GOT TO BE KIDDING ME.
> 1) not even the right little a (wrong font, doesn't match our character)
> 2) NOT EVEN MEETING THE RIGHT FRIENDS why would we want him meeting the same friends as big A, this is absurdly ridiculous

Earlier (still true for remakes): keep scenery quality; more exciting foley; cast lock / no vanish-end / no eclipse-clone on the **correct** cast.

---

## Standing gates (this letter + all future Friends)

| Gate | Fail if |
|---|---|
| **Case word trio** | Friends ≠ `wordsForCase` for that case (Big first-3 / little last-3) |
| **Look lock** | Hero ≠ Meet clip of **that** case (`a-little.mp4` for little) |
| **Cast lock** | Named friends not **identifiable** in every still (silhouette OK; cover-then-spawn = fail) |
| **No vanish-end** | Hero gone on 05-end |
| **Speech** | Wrong speaker / missing line / letter narrates all; bury-speech |
| **True job** | Friend does the wrong physics (see table) |
| **Sound** | Silent / mean < −40 dB / beep-spam; voices must stay on top |

Before plan LOCK: supervisor/QA paste **Meet path + word trio from product**. Cast-lock SOP does **not** replace this.

---

## Look lock (hard)

Match **Meet little a**: `public/videos/imagine/a-little.mp4` (still: `docs/audit/a-little-play-1/meet-a-little-01.jpg`).

- Comic Neue / Fredoka **single-story a** (no upper tail, no double-story)
- About half Big stature; bowl eyes; match Meet limbs/blush
- Home-tile / wrong font / capital-A-looking little = **FAIL**
- Do **not** I2V from the home tile

---

## Cast + true nature

little a + **alligator + astronaut + anchor** only. Never apple / ant / airplane.

| Thing | Must | Must not |
|---|---|---|
| little a | Meet single-story look; hops; talks from bowl | double-story; tiny capital A; wrong font |
| Alligator | water-friendly swim/snap; stays alligator | walk like a person; eat a; scary gore |
| Astronaut | **one kid-scale toy** in a suit; wave/bounce | live kid; a inside the suit |
| Anchor | heavy; **drops and stays down** (one-way) | floats away; clones |

---

## Method B

Four **6s** I2V clips, **one line each**, frame-lock (each from previous end), concat → ~24s · 480×720.

**Before concat:** each clip 05-end passes cast + count==1. Else re-shoot that clip.

**Source still:** new yard still with correct look + alligator/astronaut/anchor. Ash OK + cast lock before any I2V.

**C** (open-mouth stills) only if B still mushy after teacher listen.

---

## Dialogue (Title Case — same pattern as Big)

1. little a: `I'm little a!`
2. Alligator: `I'm Alligator!`
3. Astronaut: `I'm Astronaut!`
4. Anchor: `I'm Anchor!`

USA cartoon kid. One speaker at a time. Only that mouth moves. Different voices. No teacher. No phonetics. No captions.

---

## Beats

1. little a hops toward camera: **I'm little a!**
2. Alligator by water, friendly: **I'm Alligator!** a hops beside (not eaten)
3. Astronaut toy waves: **I'm Astronaut!** a hops beside
4. Anchor drops, **stays down**: **I'm Anchor!** a hops beside

Framing: all four identifiable the whole ~24s. Exciting play foley under voices; voices on top. Keep scenery quality.

---

## Prompt shape (speech-first, per clip)

Clip 1 example:

```
MOST IMPORTANT — VOICE. Only the small red clay single-story letter a talks.
One line, slow USA cartoon kid: "I'm little a!" Mouth on the bowl moves.

Nobody else talks. Alligator, astronaut toy, anchor: closed smiles / no lip flap.

Same sunny yard as the still. One small Comic/Fredoka single-story a (half-size,
bowl eyes, match Meet little a — NOT double-story, NOT a tiny capital A).
One friendly alligator, one kid-scale astronaut toy, one heavy anchor.
ALL FOUR stay identifiable the whole clip — none hide completely, none duplicate.
a hops toward camera.

Foley interesting under the voice; voice on top. No beeps. No captions.
```

Short negatives: no double-story a; no apple/ant/airplane; no live kid astronaut; anchor never floats away; no captions.

---

## Encode

Concat → ~24s, 480×720, AAC. mean **−32…−18 dB**, max **≤ −3**.  
New take in artifacts first. Do not wipe FAIL inventory until Ash. Then replace `a-little-play-1.mp4` only after teacher + QA PASS.

---

## QA dump

Per-clip end cast+count before concat. Concat 5-frame dump. Count **a, alligator, astronaut, anchor** in every still.

Do **not** generate until teacher **go**.
