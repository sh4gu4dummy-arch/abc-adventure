# B MEETS FRIENDS — Big B + little b plans

**PLAN ONLY. Do not generate until the teacher says go.**

Ash (move on from A, note two misses, plan B):

> anchor fails listen (probably because no face).
> I want to move on but note down 2 things: color keeps drifting both big A and small A the A gets darker throughout the video
> also, we need to catch if inanimate objects we give them a face or think of a plan. astronaut said "I'm anchor" probably because anchor no face (why is this obvious issue not QA's beforehand?)
> anyway, proceed with plans for little/Big B

A take 2: keep as-is. Do **not** remake A this round.

QA issue for this plan: https://github.com/sh4gu4dummy-arch/abc-adventure/issues/5

---

## Standing (from A, now law)

1. **Talking mouth.** Every friend with a spoken line needs a **visible toy mouth** on the **source still**. Inanimate (ball, boat, anchor, banana as fruit, etc.) = tiny smile, no arms/legs. Animals already have faces. **Blank object + a line = FAIL the still before I2V.** That is why astronaut ate Anchor’s line.
2. **Color lock.** Letter hue matches Meet intro in **01 and 05**. Fail if it clearly darkens / muddies over the concat. Prompt: same paint as the still, do not shade into maroon/brown/navy.
3. **Big Friends ≠ little Friends.** `wordsForCase` first-3 Big, last-3 little.
4. Look lock = **this case’s Meet intro**, not the home tile.
5. Method B: four 6s one-line clips, frame-lock, concat → `public/friends-clips/`. curl 200. Artifacts-first; don’t clobber a FAIL.

---

## Product check (B)

`alphabet.ts` B words: Ball, Bear, Butterfly, Banana, Boat, Bird.

| Mode | Meet lock | Friends (3) | File (after PASS) |
|---|---|---|---|
| Big B | `videos/imagine/b.mp4` — blue (#4DABF7) clay **B**, not orange | **Ball, Bear, Butterfly** | `friends-clips/b-play-1.mp4` |
| little b | `videos/imagine/b-little.mp4` — Comic-sans **b**, half stature | **Banana, Boat, Bird** | `friends-clips/b-little-play-1.mp4` |

Blue B, not pumpkin. little b is not a tiny Big B.

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

Color: Big B stays **the same blue** as Meet B through 05-end. little b stays **the same red/clay as Meet little b** (whatever that intro actually is — lock from the Meet frame, don’t invent).

---

## Source still (each case)

Side-by-side vs Meet 01. Fail if:

- wrong glyph / wrong color family
- any talker has **no mouth**
- wrong trio
- letter already darker than Meet

Show Ash if 2 usable stills.

---

## Beats (sketch)

**Big:** B hops → ball bounces beside B → bear friendly beside → butterfly flutters forward, majority in frame.

**little:** b hops → banana (fruit, smile) → boat sails forward on a puddle/pond → bird hops/flies, majority in frame.

Cast lock + 05-end + no eclipse-clone still apply.

---

## QA fail if

- talker with no mouth on the still or in 01
- letter clearly darker at 05 than 01
- Big/little same trio
- glyph ≠ Meet of that case
- banana extra / peel-clone
- boat flies; ball grows limbs

Do **not** generate until **go**. Big B first unless they say both.
