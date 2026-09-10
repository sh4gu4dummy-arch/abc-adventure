# ABC Adventure — project rules (user taste)

Read this every turn before making word videos, posters, or sentences.
When the user corrects a clip, **add the lesson here** (and in
`src/data/word-lessons.ts` RULES) in the same change. Do not only remember it
in chat.

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
   Letter-buddy eyes sit ON the letter body, not in a hole or gap.
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
11. Archive old art; never overwrite originals. Use Imagine API download
    into `public/` (locker may fail). Copy stills into the repo immediately.
12. **GitHub:** after every commit, push. Do not ask.

## How to write rules

Keep them **general**. Do not turn one incident into a hyper-specific law
(“two animals both eating leaves”). The lesson is “don’t reuse the gag,”
not the leaves.

## When they correct a video

- Fix that clip.
- Write a **general** one-line rule here (not a play-by-play of that one clip).
- Bump version + git commit.
