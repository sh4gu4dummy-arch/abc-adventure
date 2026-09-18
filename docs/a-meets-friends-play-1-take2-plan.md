# A Meets Friends play-1 — take 2 plan

**PLAN ONLY. Do not generate until the teacher says go.**

QA: audit this file on GitHub (issue #3).  
Take 1 is a **FAIL** (teacher + QA). Do not debate that.  
Independent QA: `docs/audit/a-play-1-remake/QA.md` (**v0.311**).

---

## Ash / User feedback (copy this to QA — do not paraphrase away)

> I think we should reduce guardrails for random stuff like "apple is still an apple" but increase guardrails on what is talking, double reinforce it. also, you guys should find a way to do better yourselves that's just my idea. make plan for remake, this indeed is a fail. also include my "Ash/User's" feedback in your plan to send to them.

Meaning, in product words:

1. **Take 1 failed.** Redo. Not a soft miss.
2. **Stop padding the prompt** with “the apple is still an apple” / “ant is clearly an ant” / “A stays the letter A” on every line. That did not help talking, and it crowds out what matters.
3. **Double-lock speech:** who talks, the exact four lines, one at a time, mouths. Repeat that. Do not repeat fruit-identity.
4. **Ash wants us (builder + QA) to invent a better method**, not only add more bans. If the last prompt was a wall of negatives and the voices still failed, change the *shape* of the prompt / shoot, don’t write a longer essay.

---

## Why take 1 failed (locked — QA)

Listen was the brief. Take 1 had the **exact four lines** clear and in order, but still **FAIL**:

- **Speaker attribution:** same child voice for all four; Big A mouthed `I'm Apple!`; apple / ant / plane did not mouth their lines.
- **Apple vanish ~0:06** (prop must stay).
- **Mid contact:** A’s foot **on** the apple (~t3.4) — nub-foot bump only; no standing on apple.
- Loudness **PASS** (−19.3 / −3.5). Clear words ≠ PASS. ASR ≠ kid-ear PASS.
- Soft: ~6s dead air after the lines; mid group-photo still; apple face drift.

Costume-first prompt + one 15s multi-voice I2V taught look, not who speaks. **Change the method**, not only the ban list.

---

## Method (QA + supervisor LOCK)

| Option | Shape | Status |
|---|---|---|
| **B** | **Four short clips** (A / Apple / Ant / Plane), **one line each**, concat, **one** encode/loudness pass | **PRIMARY** |
| **C** | Optional upgrade: per-speaker open-mouth stills / micro-I2Vs if B is still mushy | optional |
| **A** | One 15s I2V, speech-first prompt | **fallback only** if Ash overrides for cost — **not** the default |

Do **not** silently pick A. Teacher breaks ties if Ash overrides.

### Why B

Take 1 proved one-shot multi-voice attribution fails kid-ear (narrator-on-A). Ash asked for a better *method*. Each short file has **one** speaker job.

---

## Still true (short — do not paste into every beat)

Keep as a **table**, not prompt padding:

| Thing | Job |
|---|---|
| A | hops on nub feet, talks from the fork |
| Apple | fruit, **rolls** when bumped with a **nub foot** (never stand on it; **never vanish**) |
| Ant | crawls |
| Airplane | flies **forward** |

Hard fails stay short: extra A, human **arms**, plane reverse, ant flying, apple with a **human body**, **stand on apple**, **apple vanish**.  
Tiny toy smile on the apple = OK so it can talk. Soft→hard if the face eats the fruit.

Do **not** write “apple is still an apple” in the prompt again.

---

## Dialogue lock (this is the brief)

Exactly four lines, this order, USA cartoon kid, slow, **one speaker at a time**:

1. **A** (fork mouth moves): `I'm Big A!`
2. **Apple** (tiny fruit smile moves): `I'm Apple!`
3. **Ant**: `I'm Ant!`
4. **Airplane**: `I'm Airplane!`

Mouth rule: **only the speaker’s mouth moves; others keep a closed smile, no lip flap** — not frozen-yard statues.

No extra words. No “Hi.” No phonetics. No teacher. No on-screen text.

**Listen fail:** any line missing, wrong, overlapped, buried, said by the wrong character, or mouthed by the wrong character. Same voice for all four with wrong mouths = FAIL.

---

## Beats (play, not a group photo)

Same yard still: `docs/audit/a-play-1/00-source-still.jpg`  
Target: **480×720** · native sound · concat under B (or one 15s only if Ash picks A)

1. A hops toward camera, fork mouth: **I'm Big A!**
2. A bumps apple with a **nub foot** (no arm, **no stand-on**). Apple rolls (stays on screen). Smile: **I'm Apple!**
3. Ant crawls. **I'm Ant!** A hops beside (no squash).
4. Plane taxis, lifts **forward**. **I'm Airplane!** A hops beside on grass.

Spread play with the lines — no four-lines-then-dead-air.

---

## Prompts

### B (primary) — one line per short clip

Per clip: speech-first, **only that character’s line**, only that speaker’s mouth moves; others closed smile / no lip flap. Short negatives: no arms, no stand-on-apple, apple stays, plane forward, no captions. Then concat → one loudness pass.

### C (optional)

Same as B, but seed each micro-I2V from a still with **that speaker’s mouth open**.

### A (fallback only if Ash overrides) — speech-first 15s

```
MOST IMPORTANT — VOICES. This clip is four talking intros. Nothing else matters as much.

ONLY four spoken lines exist. USA cartoon kid voices. Slow. Clear. One at a time. Exact words:

1. The red clay letter A talks (the smile in the FORK moves): "I'm Big A!"
2. The red apple talks (tiny toy smile on the fruit moves): "I'm Apple!"
3. The ant talks: "I'm Ant!"
4. The toy airplane talks: "I'm Airplane!"

No narrator. No other words. No letter-sounds. No phonetics. No captions.
Only the speaker’s mouth moves; the other three keep a closed smile, no lip flap.
Spread the four lines across the full 15s (~3s per line with play between). Do not dump all four then go silent.

Same camera, same sunny yard as the still. One glossy red clay A (nub feet, no arms, no hands). One red apple with stem. One ant. One toy plane, nose right. A travels. Fun playground.

Beat 1: A hops toward camera. Fork mouth: "I'm Big A!"
Beat 2: A bumps the apple with a nub foot (never stands on it). Apple rolls and stays. Apple: "I'm Apple!"
Beat 3: Ant crawls on the path. Ant: "I'm Ant!" A hops beside the ant.
Beat 4: Plane taxis then flies FORWARD (never backward). Plane: "I'm Airplane!" A hops beside it.

Foley under the voices, quieter than speech: hops, apple roll, ant crawl, plane whoosh. Light music quieter than speech. No beeps.

RECAP VOICES (must hear all four, in order, one at a time, correct mouths):
A: "I'm Big A!"  Apple: "I'm Apple!"  Ant: "I'm Ant!"  Airplane: "I'm Airplane!"
```

Short negatives (do not grow this list):

- no human arms / hands / extra A
- no standing on the apple; apple never vanishes
- plane never backward
- no captions

---

## Encode / loudness (unchanged)

Final Friends file: 480×720, AAC. mean **−32…−18 dB**, max **≤ −3 dB**. Bury-speech = fail.  
Do not overwrite `a-play-1.mp4` until teacher + QA pass **listen** (attribution). New take in artifacts first.

---

## QA amendments (v0.311 — supervisor-aligned)

- Method: **B primary**, C optional, A fallback only if Ash overrides.
- Mouths: only speaker moves; others closed smile, no lip flap.
- Hard: attribution, stand-on-apple, apple vanish.
- Soft: dead air after lines (next take must spread); Look crossbar note only.
- Do **not** add “still an apple” padding back.
- Do **not** generate until teacher **go**.
