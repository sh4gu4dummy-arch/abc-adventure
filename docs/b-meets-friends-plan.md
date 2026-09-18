# B MEETS FRIENDS — Big B + little b plans

**PLAN ONLY. Do not generate until the teacher says go.**

Ash (move on from A, note two misses, plan B):

> anchor fails listen (probably because no face).
> I want to move on but note down 2 things: color keeps drifting both big A and small A the A gets darker throughout the video
> also, we need to catch if inanimate objects we give them a face or think of a plan. astronaut said "I'm anchor" probably because anchor no face (why is this obvious issue not QA's beforehand?)
> anyway, proceed with plans for little/Big B

A take 2: keep as-is. Do **not** remake A this round.  
QA: little-a take 2 FAIL — `docs/audit/a-little-play-2/QA.md`.

QA issue for this plan: https://github.com/sh4gu4dummy-arch/abc-adventure/issues/5  
QA amendments **v0.326**.

---

## Standing (from A, now law)

1. **Talking mouth.** Every friend with a spoken line needs a **visible toy mouth** on the **source still**. Inanimate (ball, boat, banana as fruit, anchor, etc.) = tiny smile, no arms/legs. Animals already have faces. **Blank object + a line = FAIL the still before I2V.** That is why astronaut ate Anchor’s line.
2. **Color lock.** Letter hue matches Meet intro in **01 and 05**. Fail if it clearly darkens / muddies over the concat. Prompt: same paint as the still, do not shade into maroon/brown/navy. **Audit proof:** dump Meet 01 + Friends 01 + Friends 05 **side-by-side** (not prose only).
3. **Big Friends ≠ little Friends.** `wordsForCase` first-3 Big, last-3 little.
4. Look lock = **this case’s Meet intro**, not the home tile.
5. Method B: four 6s one-line clips, frame-lock, concat → `public/friends-clips/`. curl 200. Artifacts-first; don’t clobber a FAIL.
6. **Per-clip 05-end:** cast + count==1 for letter + named friends **before** chaining the next I2V / concat.
7. **Helmet / clear-face props:** photoreal **kid face** showing through a clear helmet (astronaut-class) = **fail the still** — use toy face / opaque visor / no live child.
8. Encode: mean **−32…−18 dB**, max **≤ −3**. Exciting play foley under voices; **voices on top** (bury-speech = fail).

---

## Product check (B)

`alphabet.ts` B words: Ball, Bear, Butterfly, Banana, Boat, Bird.

| Mode | Meet lock | Friends (3) | File (after PASS) |
|---|---|---|---|
| Big B | `videos/imagine/b.mp4` — blue (#4DABF7) clay **B**, not orange | **Ball, Bear, Butterfly** | `friends-clips/b-play-1.mp4` |
| little b | `videos/imagine/b-little.mp4` — Comic-sans **b**, half stature | **Banana, Boat, Bird** | `friends-clips/b-little-play-1.mp4` |

Blue B, not pumpkin. little b is not a tiny Big B.

**Meet swatch:** before I2V, paste a Meet frame crop (or note locked hue from Meet) into the audit folder so Imagine does not invent color.

---

## Dialogue

**Big B**

1. Big B: `I'm Big B!`
2. Ball: `I'm Ball!`
3. Bear: `I'm Bear!`
4. Butterfly: `I'm Butterfly!`

**little b**

1. little b: `I'm little b!`
2. Banana: `I'm Banana!`
3. Boat: `I'm Boat!`
4. Bird: `I'm Bird!`

USA cartoon kid. One speaker. Only that mouth moves. Different voices. No teacher. No captions.

**Inanimate mouths (hard on source still):** Ball, Boat, Banana each need a **tiny toy smile** before I2V. Bear / Butterfly / Bird already have animal faces.

---

## True nature

| Friend | Must | Must not |
|---|---|---|
| Ball | round ball; **bounces**; tiny toy smile | arms/legs; goes flat; extra balls |
| Bear | friendly teddy/bear; walks or sits | scary; extra bears; eat B |
| Butterfly | flutters **forward**; insect | reverse flap; extra pair of wings as a second bug |
| Banana | yellow fruit; tiny smile; may sit | human body; clones after peel; extra bananas |
| Boat | floats / sails **forward**; tiny smile | flies; sinks then clones |
| Bird | flies / hops; bird face | plane; extra birds |

Letter: nub feet OK if Meet has them. No human arms on the letter.

Color: Big B stays **the same blue** as Meet B through 05-end. little b stays **the same hue as Meet little b** (lock from Meet frame crop — don’t invent).

---

## Source still (each case)

Side-by-side vs Meet 01. Fail if:

- wrong glyph / wrong color family
- any talker has **no mouth** (esp. Ball / Boat / Banana)
- wrong trio
- letter already darker than Meet
- clear-helmet photoreal kid face on a “toy” prop

Show Ash if 2 usable stills.

---

## Beats (sketch)

**Big:** B hops → ball bounces beside B → bear friendly beside → butterfly flutters forward, majority in frame.

**little:** b hops → banana (fruit, smile) → boat sails forward on a puddle/pond → bird hops/flies, majority in frame.

Cast lock + 05-end + no eclipse-clone still apply. Per-clip end cast before concat.

---

## QA fail if

- talker with no mouth on the still or in 01
- letter clearly darker at 05 than 01 (side-by-side proof)
- Big/little same trio
- glyph ≠ Meet of that case
- banana extra / peel-clone
- boat flies; ball grows limbs
- photoreal kid face in clear helmet
- loudness / bury-speech fail

Do **not** generate until **go**. **Big B first** unless they say both.
