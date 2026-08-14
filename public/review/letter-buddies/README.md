# Letter Buddies — review pack (v0.008)

What you can actually open and judge. Nothing here is the deleted shaky collage.

## Watch this

- `ep01-stage-420p.mp4` — 60s, 746×420. Real Cat-C, Apple-A, Tiger-T on the stage. One voice line at a time. Same show as **Letter Buddies** in the app.
- Live in the app: Letter Buddies card → play. That is the real characters, not a zoom-shake video.

## Sources (the actual buddies)

- `sources/c.webp` `a.webp` `t.webp` — letter mascots used for the episode.

## Imagine clips

Imagine *did* animate these three (you can see those takes in the chat). They never landed as files on this machine, so they are **not** in this folder.

Why: Imagine writes to `/workspace/artifacts` (a files mount). That mount was dead (permission denied). I remounted it. After remount, Imagine **still** does not hand over a file path — the clip plays in chat, then “could not be saved.” That last step is a platform save bug. Until it works, I cannot put Imagine motion in the app.

When a clip *does* save:

1. `sh scripts/ensure-imagine-artifacts.sh`
2. `sh scripts/pull-imagine-artifacts.sh`
3. Files appear in `public/review/imagine/`

## Not in this pack

- The old Ken-burns / photo-card episode — deleted, not archived.
