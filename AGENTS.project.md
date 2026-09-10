# ABC Adventure — project rules (user taste)

Read this every turn before making word videos, posters, or sentences.
When the user corrects a clip, **add the lesson here** (and in
`src/data/word-lessons.ts` RULES) in the same change. Do not only remember it
in chat.

## Chat: “lmk”

If they say **lmk** (let me know): **answer in chat only**. Do not edit,
remake, commit, or ship until they ask. Info, not action.
After every GitHub push, **tell them the version** in chat (v0.112, etc.).
Letter **names** use USA pronunciation. H is **aitch** (AY-ch), never haitch / hey-ch.
Meet clips from **J onward**: the letter says **“Hi I’m Big J, Big J, Big J”**
(that letter). Do not remake A–I to this line unless asked. Uppercase first;
lowercase later.

## Word videos

1. Sentence = what is on screen. Write sentence + clip together. Approve
   new letter sentences with the user before filming.
2. If it still sounds like a kid, pack that letter’s sound **2–3 times**.
   Never tongue-twister. Prefer a named subject (a boy, a kid, Ben, the
   puppy) over lazy “they + singular body part.” Body parts as *words* are
   fine. “They blink their eye” is not.
3. Thumbnail = **frame 1** of the video (not the payoff).
4. Action keeps going through the spoken line. Autoplay on open. Prev/next
   arrows stay on that letter’s words.
5. Kid language: “plays” not “strums”; no “sits / rests / waits / is ready”
   unless that is really the clip. No office words (envelope → elbow).
6. **Snappy, not creepy.** Fast cartoon beats. Frog = ninja tongue, insta
   eat — not slow chewing. Hatch = closed egg, then poke, then chick out.
7. Anatomy stays real for that animal: fish fins are fins, not hands.
   Clouds are puffs, not tails. No movie-lookalikes (no McQueen car).
   One of each limb — one tail, two arms, two legs. Extra ends = redo.
   Letter-buddy eyes sit ON the letter body, not in a hole or gap.
   Letter-buddy has a **mouth** (eyes + smile). Face is complete in
   **frame 1** — do not fade the eyes in later.
   Letter-buddy face is on the **front only**. A turn shows a blank back —
   never a second face. Letter-buddy **matches the home-tile color** — don’t
   recolor (home B is blue, not orange). Holes in the letter are empty holes
   — not extra eyes. The letter **must read as that letter** even in a small
   square crop (K is two open legs, never an R-bowl).
   Letter-buddy stills must **fill the tile like the neighbors**: letter-color
   wash to the edges, character large. Never a small figure on white/gray
   studio. After any remake, compare fill vs D/H before shipping. Do not
   wait for the user to catch a thumbnail mismatch.
8. Food is food. Do not put a face on something a kid then eats.
9. Friendly, not scary: dinosaurs smile, no snarl/teeth; fires stay small.
10. **Don’t repeat the same action across word videos.** Each clip needs its
    own gag. Check the whole alphabet, not just the current letter.
    An object stays that object for the whole clip — never morph into a
    person. Check every frame, not just the thumbnail.
    Handheld props stay kid-scale: smaller than the child's head, not
    giant objects that dwarf them.
11. **No talking mouths.** Overlay narration still says the word (×3) then
    the sentence. Characters do not lip-sync or mouth words. Closed-mouth
    smile unless the gag itself is eating, yawning, or blowing. Check
    mid-frames for lip-flap before shipping. I2V will invent talking if you
    don't forbid it — bake "mouth closed, not talking" into still + motion.
    **New remakes include native clip sound** (foley, ambient, cartoon SFX
    matching the gag). Do not bake the teacher voice or a song into the MP4.
    Meet buddy remakes: **one voice** — the letter's. Do not stack extra TTS
    on top of the clip's speech.
    The player mixes clip audio under the overlay voice; overlap is OK. Set
    `nativeAudio: true` on that lesson so the generic music bed stays off.
    Old silent clips keep the bed until remade — don't batch-remake.
    Prompt for diegetic sound (whoosh, splash, footsteps, animal noise)
    and no speech. State-change gags are one-way: peel stays off, wrapper
    stays off, lamp stays lit. No ping-pong reverse.
    **Locomotion must travel:** the body changes place in the frame. No
    treadmill / running-in-place cycles. Travel clips do not loop.
12. Archive old art; never overwrite originals. Use Imagine API download
    into `public/` (locker may fail). Copy stills into the repo immediately.
    **Old video takes:** git history is the backup. Do not keep a second
    `.mp4` copy in `public/art-archive` or a `public/review` dump (Publish
    packs everything under `public/`). Restore from GitHub if we change our
    mind. Stills for the Settings art page can stay.
13. **GitHub:** after every commit, push. Do not ask.
14. **Ship QA — every remake, before replacing `public/videos`.** Look at
    the clip, not just the thumbnail (dump start / mid / end with
    `python3 scripts/qa-word-frames.py VIDEO.mp4`). If anything is
    **obviously wrong** — broken object, extra animal, nonsense anatomy,
    gag that doesn't match the sentence — redo. Do not invent a new
    hyper-specific law from one miss.

## How to write rules

Keep them **general**. Do not turn one incident into a hyper-specific law
(“two animals both eating leaves”). The lesson is “don’t reuse the gag,”
not the leaves.

## When they correct a video

- Fix that clip.
- Write a **general** one-line rule here (not a play-by-play of that one clip).
- Bump version + git commit.
