# Meet-asset debt (little Meets that are Big-shaped)

**Product bug:** Friends cannot lock a lying Meet glyph. If the little Meet master
is Big-case shaped, a still that matches Meet can still be wrong for the little slot.

**Status (v0.344):** **queued** remakes — not shoot-now. Linked from issue [#9](https://github.com/sh4gu4dummy-arch/abc-adventure/issues/9).

| Little Meet | Path (audit ref / product) | Note |
|---|---|---|
| little p | `docs/audit/p-little-play-1/meet-little-p-01.jpg` · `public/videos/imagine/p-little.mp4` | Big-P form (no descender) |
| little s | `docs/audit/s-little-play-1/meet-little-s-01.jpg` · `public/videos/imagine/s-little.mp4` | Big-S-shaped |
| little v | `docs/audit/v-little-play-1/meet-little-v-01.jpg` · `public/videos/imagine/v-little.mp4` | Big-V-shaped |
| little w | `docs/audit/w-little-play-1/meet-little-w-01.jpg` · `public/videos/imagine/w-little.mp4` | Big-W-shaped |
| little x | `docs/audit/x-little-play-1/meet-little-x-01.jpg` · `public/videos/imagine/x-little.mp4` | X form (case-ambiguous OK) — review |
| little z | `docs/audit/z-little-play-1/meet-little-z-01.jpg` · `public/videos/imagine/z-little.mp4` | looks Big-Z |

Also watch **little o** (o/O same ring — usually OK).

**Rule:** fix Meet masters so future stills lock to true little glyphs where shapes differ (esp. **p, s, z**). Stills that already match a Big-shaped Meet were **not** auto-failed for case-vs-Meet; trio/human/face gates still applied. Clear wrong-case-vs-Meet FAIL: **y-little** (Meet = little-y descender; still = Big Y).
