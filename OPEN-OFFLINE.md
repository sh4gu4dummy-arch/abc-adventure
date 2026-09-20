# Open ABC Adventure on your computer

If this folder is already the git repo and it’s up to date, skip clone.

## What you need

- **Node.js 22+** and **npm** (`node -v`)
- A browser

**Not needed:** Python, Visual Studio, ffmpeg, any API key.

## Run it

In this folder:

```text
npm install
npm run dev
```

Then open: [http://localhost:8080](http://localhost:8080)

`npm install` is only slow the first time (or after dependencies change). After that, `npm run dev` is enough.

Leave that terminal open. Stop with Ctrl+C.

**Windows:** double-click `start-offline.cmd` in this folder.

## If it fails

| You see | Do this |
|---|---|
| `node` not found | Install Node 22 LTS from https://nodejs.org — tick npm |
| Port 8080 busy | In `package.json`, change `8080` to `5173`, run `npm run dev` again, open that port |
| Videos missing / old | `git pull` |
| Sign-in weird | Ignore it. The alphabet works signed out. |

Don’t open `startup.sh` — that’s only for the Grok sandbox.

---

First time on a new machine only:

```text
git clone --depth 1 https://github.com/sh4gu4dummy-arch/abc-adventure.git
cd abc-adventure
```
