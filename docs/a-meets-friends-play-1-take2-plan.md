# A Meets Friends play-1 — take 2 plan

**PLAN ONLY. Do not generate until the teacher says go.**

QA: audit this file on GitHub (issue #3).  
Take 1 is a **FAIL** (teacher). Do not debate that.

---

## Ash / User feedback (copy this to QA — do not paraphrase away)

> I think we should reduce guardrails for random stuff like "apple is still an apple" but increase guardrails on what is talking, double reinforce it. also, you guys should find a way to do better yourselves that's just my idea. make plan for remake, this indeed is a fail. also include my "Ash/User's" feedback in your plan to send to them.

Meaning, in product words:

1. **Take 1 failed.** Redo. Not a soft miss.
2. **Stop padding the prompt** with “the apple is still an apple” / “ant is clearly an ant” / “A stays the letter A” on every line. That did not help talking, and it crowds out what matters.
3. **Double-lock speech:** who talks, the exact four lines, one at a time, mouths. Repeat that. Do not repeat fruit-identity.
4. **Ash wants us (builder + QA) to invent a better method**, not only add more bans. If the last prompt was a wall of negatives and the voices still failed, change the *shape* of the prompt / shoot, don’t write a longer essay.

---

## Why take 1 failed (working theory — QA, attack this)

The I2V prompt led with look-lock and “still an apple,” then buried four lines in the middle. Imagine treats the **first dense block** as law. We taught it costume, not dialogue.

Stills of take 1 looked fine (one A, no arms, plane lifts). The brief was **talking intros**. Pixels-without-listen is how we almost called it a pass. **Listen is the brief.**

---

## Better method (builder proposal — QA, improve it)

Do **not** only add more sentences. Change order and weight:

| Old (take 1) | Take 2 |
|---|---|
| Look lock first, speech in beat 2–4 | **Speech block first, twice** (top + bottom) |
| “Apple is still an apple” × many | Say apple **once** (red fruit, stem). Then stop. |
| Four lines listed once | Four lines listed **three times**: cast, beats, recap |
| “No narrator” once | “ONLY these four voices” + “everyone else silent / mouth still” |
| 15s, one I2V | Still **one 15s I2V** (unless QA has a stronger split) |

QA: if you have a better trick (split into four 6s clips and concat; still with mouth open on speaker; etc.), **write it on #3**. Do not silently pick. Teacher breaks ties.

Open questions for QA (debate, then teacher):

- **A.** Keep one 15s I2V, speech-first prompt (builder default).
- **B.** Four short clips (A / Apple / Ant / Plane), concat — each file has **one** line. Heavier, but Imagine only has to say one sentence.
- **C.** Something else you actually think will work.

Builder default if no better idea lands: **A**.

---

## Still true (short — do not paste into every beat)

Keep as a **table**, not prompt padding:

| Thing | Job |
|---|---|
| A | hops on nub feet, talks from the fork |
| Apple | fruit, rolls when bumped |
| Ant | crawls |
| Airplane | flies **forward** |

Hard fails stay short: extra A, human **arms**, plane reverse, ant flying, apple with a **human body**.  
Tiny toy smile on the apple = OK so it can talk.

Do **not** write “apple is still an apple” in the prompt again.

---

## Dialogue lock (this is the brief)

Exactly four lines, this order, USA cartoon kid, slow, **one speaker at a time**:

1. **A** (fork mouth moves): `I'm Big A!`
2. **Apple** (tiny fruit smile moves): `I'm Apple!`
3. **Ant**: `I'm Ant!`
4. **Airplane**: `I'm Airplane!`

While one talks, the other three **do not speak** and their mouths **do not flap**.

No extra words. No “Hi.” No phonetics. No teacher. No on-screen text.

**Listen fail:** any line missing, wrong, overlapped, buried, or said by the wrong character.

---

## Beats (play, not a group photo)

Same yard still: `docs/audit/a-play-1/00-source-still.jpg`  
15s · 480×720 · I2V

1. A hops toward camera, fork mouth: **I'm Big A!**
2. A bumps apple with a **nub foot** (no arm). Apple rolls. Smile: **I'm Apple!**
3. Ant crawls. **I'm Ant!** A hops beside (no squash).
4. Plane taxis, lifts **forward**. **I'm Airplane!** A hops beside on grass.

---

## Full I2V prompt (speech-first)

```
MOST IMPORTANT — VOICES. This clip is four talking intros. Nothing else matters as much.

ONLY four spoken lines exist. USA cartoon kid voices. Slow. Clear. One at a time. Exact words:

1. The red clay letter A talks (the smile in the FORK moves): "I'm Big A!"
2. The red apple talks (tiny toy smile on the fruit moves): "I'm Apple!"
3. The ant talks: "I'm Ant!"
4. The toy airplane talks: "I'm Airplane!"

No narrator. No other words. No letter-sounds. No phonetics. No captions.
While A talks, apple/ant/plane mouths stay still.
While the apple talks, A/ant/plane mouths stay still.
While the ant talks, A/apple/plane mouths stay still.
While the plane talks, A/apple/ant mouths stay still.

Same camera, same sunny yard as the still. One glossy red clay A (eyes on the legs, blank crossbar, nub feet, no arms, no hands). One red apple with stem. One ant. One toy plane, nose right. A travels. Fun playground.

Beat 1: A hops toward camera. Fork mouth: "I'm Big A!"
Beat 2: A bumps the apple with a nub foot. Apple rolls. Apple: "I'm Apple!"
Beat 3: Ant crawls on the path. Ant: "I'm Ant!" A hops beside the ant.
Beat 4: Plane taxis then flies FORWARD (never backward). Plane: "I'm Airplane!" A hops beside it.

Foley under the voices, quieter than speech: hops, apple roll, ant crawl, plane whoosh. Light music quieter than speech. No beeps.

RECAP VOICES (must hear all four, in order, one at a time):
A: "I'm Big A!"  Apple: "I'm Apple!"  Ant: "I'm Ant!"  Airplane: "I'm Airplane!"
```

Short negatives (do not grow this list):

- no human arms / hands / extra A
- plane never backward
- no captions

---

## Encode / loudness (unchanged)

15s, 480×720, AAC. mean **−32…−18 dB**, max **≤ −3 dB**. Bury-speech = fail.  
Do not overwrite `a-play-1.mp4` until teacher + QA pass **listen**. New take in artifacts first; teacher watches in Friends only after a listen-sane take.

---

## QA job this round

1. Read Ash’s quote at the top. Do not ignore it.
2. Try to fail **this** prompt: will it still skip speech? Is “mouths stay still” going to freeze the whole shot?
3. Counter-propose a better method if you have one (options A/B/C).
4. Do **not** add “still an apple” back.
5. Do **not** generate.

Builder will not shoot until teacher **go** after this debate.
