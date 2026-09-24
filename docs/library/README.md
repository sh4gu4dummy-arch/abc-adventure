# Video library

Nothing was deleted. Three places:

## live

Shortcuts to the files the game plays. Do not delete these. Deleting one can delete the game file.

| Folder | What the game uses it for | Real file |
|---|---|---|
| `live/words` | Word videos (apple, ant, …) | `public/videos/{letter}-{word}.mp4` |
| `live/meet` | Meet the letter | `public/videos/imagine/{letter}.mp4` and `{letter}-little.mp4` |
| `live/friends` | Meets Friends, full 4-clip video | `public/friends-clips/` |
| `live/stories` | Story, 3 scenes | `public/story-clips/` |

`public/videos/buddies/` is an old fallback. The game does not play it while the imagine file exists.
`public/videos/cutouts/` is pictures for an old build script, not a video the game plays.

## pending

Real copies, not shortcuts. Only the clips still waiting on a yes or no. The game does not play this folder. It still plays the full video in `live/friends`.

Not on GitHub. Do not commit this folder's mp4 files.

- little-b clip 3
- little-c clip 2
- little-d clips 1, 3, 4
- big-t clip 2
- big-u clips 1–4
- big-v clip 3
- big-w clips 3, 4
- big-y clips 2–4
- big-z clips 3, 4

## old

Moved here so the rest is easier to look through. Not played.

- `old/audit-frames` — old check frames and rejected takes
- `old/see-big-u` — the Big U face comparison
- `old/not-used-by-app` — extra C tests and an old story file the game does not load
