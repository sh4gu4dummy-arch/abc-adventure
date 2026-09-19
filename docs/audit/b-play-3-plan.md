# Big B Friends remake — name-swap (plan, no I2V until Ash go)

**Ash:** Bear said **"I'm Butterfly."** Still is fine. Film is not.

**Keep still:** `docs/audit/b-play-2/00-source-still.jpg`  
(sky-blue B, red/white/blue ball, honey-pot bear + scarf prop, rainbow butterfly)

**Ship as:** `public/friends-clips/b-play-3.mp4` (keep `b-play-2.mp4` in git)

## Why it failed

Clip 3 is Bear. Clip 4 is Butterfly. Both names start with **B**.
I2V mixed the lines. Same class as Ball/Bear/Butterfly — one letter, three B-names.

Looks-pass + wrong spoken name = **FAIL**. Frames cannot catch this. **Listen** can.

## What changes on the remake

1. Same still. Same 4-clip chain. Same 6s / 480p.
2. Each clip prompt: **look-lock the speaker** + **exact line** + **ban the other two names**.
3. **Listen each 6s clip before the next I2V.** If Bear says Butterfly, reshoot that clip only.
4. Distinct voices. Letter mouth closed on friend lines.

## Lines (unchanged)

| Clip | Speaker (look) | Says | Must not say |
|---|---|---|---|
| 1 | sky-blue clay B, lower-bowl mouth | I'm Big B! | Ball / Bear / Butterfly |
| 2 | red-white-blue patch ball | I'm Ball! | Bear / Butterfly / Big B |
| 3 | honey-pot bear (scarf = still prop) | I'm Bear! | Butterfly / Ball |
| 4 | rainbow fuzzy butterfly | I'm Butterfly! | Bear / Ball |

## Clip 3 prompt (the miss)

MOST IMPORTANT — VOICE. ONLY the honey-pot brown BEAR talks. Exact line, slow warm USA cartoon kid: "I'm Bear!" Repeat: the bear says "I'm Bear!" The bear does NOT say Butterfly. The bear does NOT say Ball.

Only the bear's mouth moves. Letter B, ball, and butterfly mouths CLOSED. No narrator. No captions.

CAMERA STAYS WIDE. Bear takes a small step or wave. Keep EXACT B, one ball, one bear, one butterfly. Hero in last frame.

Foley: soft steps. Voice on top. No beeps.

## Clip 4 prompt (anti-swap twin)

MOST IMPORTANT — VOICE. ONLY the rainbow BUTTERFLY talks. Exact line, light USA cartoon kid: "I'm Butterfly!" The butterfly does NOT say Bear. The butterfly does NOT say Ball.

Only the butterfly's mouth moves. B, ball, bear CLOSED. CAMERA STAYS WIDE. Butterfly flutters forward, majority in frame. Count balls = 1. Hero in last frame.

Foley: wing flutter. Voice on top. No beeps.

Clips 1–2: same as `docs/b-i2v-prompts.md` plus "does not say the other B-names."

## Listen gate (builder, not optional)

After each clip, play it. Fail if:
- spoken name ≠ speaker
- same voice on two speakers
- letter mouths a friend line

Do not concat a clip you have not heard.
