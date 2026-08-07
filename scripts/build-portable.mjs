/**
 * Build offline download packages:
 *  1) Portable HTML app  → public/portable/ABC-Adventure/ + ABC-Adventure-Portable.zip
 *  2) Full source code   → public/portable/ABC-Adventure-Source.zip
 *
 * Usage: npm run build:portable
 */
import * as esbuild from "esbuild";
import { execSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  rmSync,
  existsSync,
  readdirSync,
  statSync,
  copyFileSync,
} from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const portableRoot = join(root, "public", "portable");
const outDir = join(portableRoot, "ABC-Adventure");
const appZipPath = join(portableRoot, "ABC-Adventure-Portable.zip");
const sourceZipPath = join(portableRoot, "ABC-Adventure-Source.zip");

function rimraf(p) {
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}

function countFiles(dir) {
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) n += countFiles(p);
    else n += 1;
  }
  return n;
}

function fileMeta(path, name) {
  if (!existsSync(path)) return null;
  const st = statSync(path);
  const hash = createHash("sha256").update(readFileSync(path)).digest("hex").slice(0, 12);
  return {
    name,
    bytes: st.size,
    mb: Math.round((st.size / (1024 * 1024)) * 10) / 10,
    sha256_12: hash,
  };
}

function zipWithPython(sourceDir, zipPath, rootName) {
  rimraf(zipPath);
  // zip contents of sourceDir as rootName/
  const parent = dirname(sourceDir);
  const base = sourceDir.split(/[/\\]/).pop();
  execSync(
    `python3 -c "import shutil; shutil.make_archive(r'${zipPath.slice(0, -4)}', 'zip', r'${parent}', r'${base}')"`,
    { stdio: "inherit" },
  );
  void rootName;
}

function zipSourceTree(zipPath) {
  rimraf(zipPath);
  // Python zip of selected roots into ABC-Adventure-Source/
  const script = `
import os, zipfile
from pathlib import Path
root = Path(${JSON.stringify(root)})
zip_path = Path(${JSON.stringify(zipPath)})
include_dirs = ["src", "public", "scripts", "migrations", ".grok"]
include_files = [
  "package.json", "package-lock.json", "tsconfig.json", "vite.config.ts",
  "eslint.config.mjs", ".prettierrc", "startup.sh", "PROJECT.md", "AGENTS.md", ".gitignore",
]
skip_dir_names = {
  "node_modules", ".git", ".vercel", ".tanstack", ".nitro", ".output", "dist",
  "screenshots", "artifacts", "ABC-Adventure",
}
skip_file_suffixes = (".zip", ".log")
skip_file_names = {"ABC-Adventure-Portable.zip", "ABC-Adventure-Source.zip"}

def should_skip_dir(name: str) -> bool:
  return name in skip_dir_names or name.startswith(".")

with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
  prefix = "ABC-Adventure-Source"
  for f in include_files:
    p = root / f
    if p.is_file():
      zf.write(p, f"{prefix}/{f}")
  for d in include_dirs:
    base = root / d
    if not base.exists():
      continue
    for dirpath, dirnames, filenames in os.walk(base):
      # prune
      dirnames[:] = [x for x in dirnames if not should_skip_dir(x)]
      # also prune portable built app folder under public/portable
      rel = Path(dirpath).relative_to(root)
      for name in filenames:
        if name in skip_file_names or name.endswith(skip_file_suffixes):
          continue
        # skip large QA cutouts under public/videos frames if any non-mp4 noise except cutouts we keep? keep all public media
        fp = Path(dirpath) / name
        # skip nested portable app rebuild folder
        parts = fp.relative_to(root).parts
        if "portable" in parts and "ABC-Adventure" in parts:
          continue
        if name == "meta.json" and "portable" in parts:
          continue
        arc = f"{prefix}/{fp.relative_to(root).as_posix()}"
        zf.write(fp, arc)
  # tiny README for source package
  readme = """ABC Adventure — Full Source Code
================================

This ZIP is the complete project source (no node_modules).

SETUP
-----
1. Unzip
2. npm install
3. npm run dev          # online app on port 8080
4. npm run build:portable  # rebuild offline HTML package

See PROJECT.md for product notes.
"""
  zf.writestr(f"{prefix}/README-SOURCE.txt", readme)
print("source zip files:", len(zf.namelist()) if False else "ok")
print("wrote", zip_path, "bytes", zip_path.stat().st_size)
`;
  writeFileSync(join(root, "scripts", ".tmp-zip-source.py"), script);
  execSync(`python3 "${join(root, "scripts", ".tmp-zip-source.py")}"`, { stdio: "inherit" });
  try {
    rmSync(join(root, "scripts", ".tmp-zip-source.py"));
  } catch {
    /* ignore */
  }
}

// ─── Portable HTML app ───────────────────────────────────────────
console.log("→ Clean portable app output");
rimraf(outDir);
mkdirSync(outDir, { recursive: true });

console.log("→ Tailwind CSS (portable)");
const cssIn = join(root, "src", "styles.css");
const cssOut = join(outDir, "app.css");
execSync(`npx --yes @tailwindcss/cli -i "${cssIn}" -o "${cssOut}" --minify`, {
  cwd: root,
  stdio: "inherit",
});
let css = readFileSync(cssOut, "utf8");
css = css.replace(/url\(\s*["']?\/fonts\//g, 'url("./fonts/');
css = css.replace(/url\(\s*["']?\/public\/fonts\//g, 'url("./fonts/');
writeFileSync(cssOut, css);

console.log("→ Bundle JS (IIFE, fully offline)");
await esbuild.build({
  entryPoints: [join(root, "src", "portable", "entry.tsx")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  outfile: join(outDir, "app.js"),
  minify: true,
  sourcemap: false,
  jsx: "automatic",
  loader: {
    ".tsx": "tsx",
    ".ts": "ts",
    ".css": "empty",
    ".svg": "dataurl",
    ".png": "dataurl",
    ".webp": "file",
  },
  define: {
    "process.env.NODE_ENV": '"production"',
    "import.meta.env.DEV": "false",
    "import.meta.env.PROD": "true",
    "import.meta.env.SSR": "false",
    "import.meta.env.MODE": '"production"',
  },
  alias: {
    "@": join(root, "src"),
  },
  logLevel: "info",
});

console.log("→ Copy media (posters, letters, audio, fonts, videos)");
for (const dir of ["posters", "letters", "audio", "fonts", "videos"]) {
  const src = join(root, "public", dir);
  if (!existsSync(src)) {
    console.warn("  skip missing", dir);
    continue;
  }
  cpSync(src, join(outDir, dir), {
    recursive: true,
    filter: (p) => {
      // skip frame dumps / huge debug folders inside videos if any
      const base = p.split(/[/\\]/).pop() || "";
      if (base === "apple-frames") return false;
      if (base.endsWith(".wav") && p.includes(`${join("audio", "sfx")}`)) {
        // keep mp3 only in sfx to shrink a bit — optional, keep wav for reliability
      }
      return true;
    },
  });
}

// Drop huge non-essential debug assets from videos
const appleFrames = join(outDir, "videos", "apple-frames");
if (existsSync(appleFrames)) rimraf(appleFrames);
const cutout = join(outDir, "videos", "apple-cutout.png");
if (existsSync(cutout)) rmSync(cutout);

writeFileSync(
  join(outDir, "index.html"),
  `<!DOCTYPE html>
<html lang="en" data-theme="light" data-theme-pref="auto" data-gfx="high" data-gfx-pref="auto" class="theme-light gfx-high">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#ff6b6b" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="color-scheme" content="light dark" />
  <title>ABC Adventure — Offline</title>
  <meta name="description" content="Fully offline alphabet learning for kids — posters, videos, AI voice, tracing, and games. No internet required." />
  <link rel="stylesheet" href="./app.css" />
  <script>
    window.__ABC_ASSET_BASE__ = "./";
    window.__ABC_PORTABLE__ = true;
    (function(){
      try{
        var gk='abc-gfx-pref-v1';var gp=localStorage.getItem(gk)||'auto';
        var lite=false;
        try{
          var n=navigator;
          if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)lite=true;
          if(n.connection&&n.connection.saveData)lite=true;
          if(typeof n.deviceMemory==='number'&&n.deviceMemory>0&&n.deviceMemory<=2)lite=true;
        }catch(e){}
        var gr=gp==='lite'?'lite':gp==='high'?'high':(lite?'lite':'high');
        var h=document.documentElement;
        h.dataset.gfx=gr;h.dataset.gfxPref=gp;
        h.classList.remove('gfx-high','gfx-lite');
        h.classList.add(gr==='lite'?'gfx-lite':'gfx-high');
      }catch(e){}
      try{
        var tk='abc-theme-pref-v1';var tp=localStorage.getItem(tk)||'auto';
        var dark=false;
        try{if(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)dark=true;}catch(e){}
        var tr=tp==='dark'?'dark':tp==='light'?'light':(dark?'dark':'light');
        var h2=document.documentElement;
        h2.dataset.theme=tr;h2.dataset.themePref=tp;
        h2.classList.remove('theme-dark','theme-light');
        h2.classList.add(tr==='dark'?'theme-dark':'theme-light');
        h2.style.colorScheme=tr;
      }catch(e){}
    })();
  </script>
</head>
<body>
  <div id="root"></div>
  <noscript>
    <p style="font-family:system-ui;padding:2rem;text-align:center">
      ABC Adventure needs JavaScript enabled. Open this file in Chrome, Edge, Firefox, or Safari.
    </p>
  </noscript>
  <script src="./app.js"></script>
</body>
</html>
`,
);

writeFileSync(
  join(outDir, "README.txt"),
  `ABC Adventure — Portable Offline App
====================================

100% offline after download. No install. No account.

HOW TO OPEN
-----------
1. Unzip the whole folder anywhere (USB stick, laptop, tablet).
2. Keep ALL files together (index.html next to posters/, videos/, audio/, …).
3. Open index.html:
   • Double-click index.html   (works in most browsers)
   • Or run Open-ABC-Adventure.bat (Windows) / Open-ABC-Adventure.command (Mac)
     if your browser blocks media on file:// links.

WHAT'S INCLUDED
---------------
• 26 letters × 6 word posters (156 cartoon posters)
• 156 short story videos
• Neural AI voice clips (Teacher + Buddy)
• Trace, Match, Pairs, I Spy, Story, Aa hunt
• Stars & progress saved on THIS device only
• Dark / light theme + graphics High / Lite

TIPS
----
• Classroom USB: copy the whole ABC-Adventure folder.
• If sound or video fails after double-click, use the Open-… helper
  (starts a tiny local server — still fully offline).
• Progress is per browser / device (localStorage).

Made with Grok
`,
);

writeFileSync(
  join(outDir, "Open-ABC-Adventure.command"),
  `#!/bin/bash
cd "$(dirname "$0")"
PORT=8765
if command -v python3 >/dev/null 2>&1; then
  echo "ABC Adventure (offline) → http://127.0.0.1:$PORT/"
  (sleep 1; open "http://127.0.0.1:$PORT/" 2>/dev/null || xdg-open "http://127.0.0.1:$PORT/" 2>/dev/null || true) &
  python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  (sleep 1; open "http://127.0.0.1:$PORT/" 2>/dev/null || true) &
  python -m http.server "$PORT"
else
  open index.html 2>/dev/null || xdg-open index.html 2>/dev/null || true
fi
`,
);
try {
  execSync(`chmod +x "${join(outDir, "Open-ABC-Adventure.command")}"`);
} catch {
  /* ignore */
}

writeFileSync(
  join(outDir, "Open-ABC-Adventure.bat"),
  `@echo off
cd /d "%~dp0"
set PORT=8765
where python >nul 2>nul
if %ERRORLEVEL%==0 (
  start "" http://127.0.0.1:%PORT%/
  python -m http.server %PORT%
) else (
  where py >nul 2>nul
  if %ERRORLEVEL%==0 (
    start "" http://127.0.0.1:%PORT%/
    py -m http.server %PORT%
  ) else (
    start "" "%~dp0index.html"
  )
)
`,
);

console.log("→ Zip portable HTML app");
zipWithPython(outDir, appZipPath, "ABC-Adventure");

console.log("→ Zip full source codebase");
zipSourceTree(sourceZipPath);

const appMeta = fileMeta(appZipPath, "ABC-Adventure-Portable.zip");
const srcMeta = fileMeta(sourceZipPath, "ABC-Adventure-Source.zip");
const meta = {
  builtAt: new Date().toISOString(),
  portableApp: {
    ...appMeta,
    folder: "ABC-Adventure",
    files: countFiles(outDir),
    includes: ["posters", "letters", "videos", "audio", "fonts", "app.js", "app.css"],
  },
  sourceCode: {
    ...srcMeta,
    note: "Full project source without node_modules. Run npm install after unzip.",
  },
};
writeFileSync(join(portableRoot, "meta.json"), JSON.stringify(meta, null, 2));
console.log("✓ Packages ready:");
console.log("  App:   ", appMeta);
console.log("  Source:", srcMeta);
console.log("  Files in app folder:", meta.portableApp.files);
