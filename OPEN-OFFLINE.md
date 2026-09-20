# Open ABC Adventure on your computer

Grok preview can be slow. This is the same app, local.

## What you need

You already said you have these. That’s enough:

- **Git**
- **Node.js 22+** and **npm** (check: `node -v` should be v22 or v20)
- A browser

**Not needed:** Python, Visual Studio, ffmpeg, any API key.

Disk: about **1.5 GB** after `npm install` (app + videos + packages).

Clone with `--depth 1` so it isn’t a 700 MB history pull:

```text
git clone --depth 1 https://github.com/sh4gu4dummy-arch/abc-adventure.git
cd abc-adventure
```

If you already cloned, just `cd` into the folder.

## Run it

In that folder:

```text
npm install
npm run dev
```

Then open: [http://localhost:8080](http://localhost:8080)

Leave that terminal open. Stop with Ctrl+C.

**Windows shortcut:** double-click `start-offline.cmd` in this folder (runs install if needed, then the app).

## If it fails

| You see | Do this |
|---|---|
| `node` not found | Install Node 22 LTS from https://nodejs.org — tick npm |
| Port 8080 busy | In `package.json`, change `8080` to `5173`, run `npm run dev` again, open that port |
| Videos missing / old | `git pull` (or clone fresh with `--depth 1`) |
| Sign-in weird | Ignore it. The alphabet works signed out. |

Python is unused here. Don’t open `startup.sh` — that’s only for the Grok sandbox.
