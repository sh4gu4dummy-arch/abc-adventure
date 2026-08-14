# Letter Buddies — review pack (v0.009)

## Watch this

- `ep01-stage-420p.mp4` — 60s, 746×420. Real Cat-C, Apple-A, Tiger-T on the stage.
- Live in the app: Letter Buddies → play.

## How to get Imagine files (the dancing ones)

Chat Imagine **makes** the clip (you see it in this thread) but **does not write a file** into the app. Two ways that actually produce an `.mp4`:

1. **From this chat** — on each Imagine video, use download, then send the file back here. I’ll drop it in the app.
2. **[grok.com/files](https://grok.com/files)** — recent Imagine videos for your account. Download, send back, same thing.
3. **xAI API** (needs a key from [console.x.ai](https://console.x.ai)):
   `XAI_API_KEY=… sh scripts/imagine-i2v-api.sh public/letters/c.webp "waves a paw" public/videos/imagine/c.mp4 10`
   That API returns a real `video.url` we can curl.

If a clip URL looks like `https://vidgen.x.ai/...mp4`:

`sh scripts/fetch-vidgen.sh '<url>' public/review/imagine/videos/name.mp4`


## Sources

- `sources/c.webp` `a.webp` `t.webp`
