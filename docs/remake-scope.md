# Remake scope (hard)

Ash: I care more about meta-ability than one clip. Builder diagnosed
the **character** instead of the **moment**, then proposed remaking all
4 Friends clips when only one line was wrong.

**Memory = this file + START-HERE.** Chat does not persist.

## Before any remake plan

Write this table first. If you cannot fill it, **ask one question**. Do
not invent a full-letter reshoot.

| Time | Who should talk | Line | What actually happened |
|---|---|---|---|
| clip ? | ? | ? | ? |

## Default

- **Remake the broken clip only.**
- Keep list vs remake list in the plan. Remake list starts at **one**.
- Ban “redo the letter / redo all 4” as the first move.
- A later clip’s wrong line is **that clip**, not the earlier speaker’s clip.
  Example: Bear says “I'm Butterfly” during Butterfly’s line → **clip 4**,
  not clip 3. If Ash says “I'm Bear is fine,” do not remake clip 3.
- Reshoot the *next* clip only if the new last frame cannot join (visible jump).
  Not before you see a jump.

## Friends 4-clip map (so you don’t guess)

1. letter — “I'm Big X” / “I'm little x”
2. friend 1
3. friend 2
4. friend 3

Wrong spoken name on friend 3’s beat = clip 4.

**Letter AND friend both say the friend’s line** (Ash: M and Moon both
“I'm Moon”, H and House both “I'm House”): the **friend clip is correct**.
Remake **clip 1** (the letter) only. Do not remake the friend.

**Ship gate:** `python3 scripts/friends-stt-check.py FILE --letter X --friends A B C`
must print `"ok": true` before you replace the public mp4. Clip 1 must not
contain a friend name.

Center-object leak: if a friend fills the middle of the still (moon, house,
cake), clip 1 prompt names the letter’s **side** and bans all three friend
names. Frames cannot catch this — STT can.

## Plan shape Ash expects

Keep: clips …  
Remake: clip N only  
Stitch: old 1+2+3 + new N  

Do not film until Ash says go.
