/**
 * Build versioned offline download packages (run ONLY when the user asks).
 *
 * Outputs under public/portable/:
 *   abc-adventure-vX.YYY-portable.zip   — ready-to-play offline HTML app
 *   abc-adventure-vX.YYY-code.zip       — essential source only (no heavy media)
 *   abc-adventure-vX.YYY-codebase.zip   — full source + all assets
 *
 * Version comes from /VERSION (and must match src/lib/version.ts).
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
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const portableRoot = join(root, "public", "portable");

const APP_SLUG = "abc-adventure";

function readVersion() {
  const raw = readFileSync(join(root, "VERSION"), "utf8").trim();
  if (!/^\d+\.\d{3}$/.test(raw)) {
    throw new Error(
      `VERSION must look like 0.001 (got ${JSON.stringify(raw)}). Bump VERSION and src/lib/version.ts together.`,
    );
  }
  // Keep client constant in sync
  const verTs = readFileSync(join(root, "src", "lib", "version.ts"), "utf8");
  const m = verTs.match(/export const APP_VERSION = "([^"]+)"/);
  if (!m || m[1] !== raw) {
    throw new Error(
      `src/lib/version.ts APP_VERSION (${m?.[1] ?? "?"}) must equal VERSION file (${raw}).`,
    );
  }
  return raw;
}

const VERSION = readVersion();
const VTAG = `v${VERSION}`;

function pkgName(kind) {
  if (kind === "portable") return `${APP_SLUG}-${VTAG}-portable.zip`;
  if (kind === "code") return `${APP_SLUG}-${VTAG}-code.zip`;
  if (kind === "codebase") return `${APP_SLUG}-${VTAG}-codebase.zip`;
  if (kind === "apk") return `${APP_SLUG}-${VTAG}.apk`;
  throw new Error(kind);
}

const portableFolderName = `${APP_SLUG}-${VTAG}-portable`;
const outDir = join(portableRoot, portableFolderName);
const appZipPath = join(portableRoot, pkgName("portable"));
const codeZipPath = join(portableRoot, pkgName("code"));
const codebaseZipPath = join(portableRoot, pkgName("codebase"));

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

function zipWithPython(sourceDir, zipPath) {
  rimraf(zipPath);
  const parent = dirname(sourceDir);
  const base = sourceDir.split(/[/\\]/).pop();
  execSync(
    `python3 -c "import shutil; shutil.make_archive(r'${zipPath.slice(0, -4)}', 'zip', r'${parent}', r'${base}')"`,
    { stdio: "inherit" },
  );
}

/**
 * Zip project source.
 * mode "code"     → essential source only (no heavy media / generated assets)
 * mode "codebase" → full project including public media assets
 */
function zipSourceTree(zipPath, mode) {
  rimraf(zipPath);
  const prefix =
    mode === "code"
      ? `${APP_SLUG}-${VTAG}-code`
      : `${APP_SLUG}-${VTAG}-codebase`;

  const scriptFixed = `
import os, zipfile
from pathlib import Path
root = Path(${JSON.stringify(root)})
zip_path = Path(${JSON.stringify(zipPath)})
mode = ${JSON.stringify(mode)}
prefix = ${JSON.stringify(prefix)}
version = ${JSON.stringify(VERSION)}
vtag = ${JSON.stringify(VTAG)}
app_slug = ${JSON.stringify(APP_SLUG)}

include_dirs_code = ["src", "scripts", "migrations"]
include_dirs_full = ["src", "public", "scripts", "migrations", ".grok"]
include_files = [
  "package.json", "package-lock.json", "tsconfig.json", "vite.config.ts",
  "eslint.config.mjs", ".prettierrc", "startup.sh", "PROJECT.md", "AGENTS.md",
  ".gitignore", "VERSION",
]
public_keep_code = {
  "favicon.ico", "favicon.png", "favicon.svg", "apple-touch-icon.png",
  "manifest.webmanifest", "robots.txt", "sw.js",
}
skip_dir_names = {
  "node_modules", ".git", ".vercel", ".tanstack", ".nitro", ".output", "dist",
  "screenshots", "artifacts",
}
skip_file_suffixes = (".zip", ".log")

def should_skip_dir(name: str) -> bool:
  return name in skip_dir_names or (name.startswith(".") and name not in {".grok"})

with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
  for f in include_files:
    p = root / f
    if p.is_file():
      zf.write(p, f"{prefix}/{f}")

  if mode == "code":
    for d in include_dirs_code:
      base = root / d
      if not base.exists():
        continue
      for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [x for x in dirnames if not should_skip_dir(x)]
        for name in filenames:
          if name.endswith(skip_file_suffixes):
            continue
          fp = Path(dirpath) / name
          arc = f"{prefix}/{fp.relative_to(root).as_posix()}"
          zf.write(fp, arc)
    pub = root / "public"
    if pub.exists():
      for name in public_keep_code:
        p = pub / name
        if p.is_file():
          zf.write(p, f"{prefix}/public/{name}")
    readme = f"""ABC Adventure — Code only ({vtag})
=====================================

Essential source to view and build the project.
NO heavy media (posters, videos, audio, letter art, fonts pack).

SETUP
-----
1. Unzip
2. npm install
3. npm run dev
4. To rebuild offline packages (when you have assets): npm run build:portable

For a complete tree with all assets, download:
  {app_slug}-{vtag}-codebase.zip

Version: {version}
"""
    zf.writestr(f"{prefix}/README-CODE.txt", readme)
  else:
    for d in include_dirs_full:
      base = root / d
      if not base.exists():
        continue
      for dirpath, dirnames, filenames in os.walk(base):
        dirnames[:] = [x for x in dirnames if not should_skip_dir(x)]
        for name in filenames:
          if name.endswith(skip_file_suffixes):
            continue
          fp = Path(dirpath) / name
          parts = fp.relative_to(root).parts
          if "portable" in parts:
            continue
          arc = f"{prefix}/{fp.relative_to(root).as_posix()}"
          zf.write(fp, arc)
    readme = f"""ABC Adventure — Full codebase ({vtag})
========================================

Complete project including media assets (posters, videos, audio, fonts).
No node_modules.

SETUP
-----
1. Unzip
2. npm install
3. npm run dev
4. npm run build:portable   # rebuild versioned offline packages

Portable (playable) package is a separate download:
  {app_slug}-{vtag}-portable.zip

Version: {version}
"""
    zf.writestr(f"{prefix}/README-CODEBASE.txt", readme)

print("wrote", zip_path, "bytes", zip_path.stat().st_size)
`;
  const tmp = join(root, "scripts", `.tmp-zip-${mode}.py`);
  writeFileSync(tmp, scriptFixed);
  execSync(`python3 "${tmp}"`, { stdio: "inherit" });
  try {
    rmSync(tmp);
  } catch {
    /* ignore */
  }
}

// ─── Portable HTML app ───────────────────────────────────────────
console.log(`→ Building packages for ${VTAG}`);
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
      const base = p.split(/[/\\]/).pop() || "";
      if (base === "apple-frames") return false;
      return true;
    },
  });
}

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
  <title>ABC Adventure ${VTAG} — Offline</title>
  <meta name="description" content="Fully offline alphabet learning for kids — posters, videos, AI voice, tracing, and games. No internet required." />
  <link rel="stylesheet" href="./app.css" />
  <script>
    window.__ABC_ASSET_BASE__ = "./";
    window.__ABC_PORTABLE__ = true;
    window.__ABC_VERSION__ = ${JSON.stringify(VERSION)};
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
  `ABC Adventure ${VTAG} — Portable Offline App
===========================================

100% offline after download. No install. No account.
Package: ${pkgName("portable")}

HOW TO OPEN
-----------
1. Unzip the whole folder anywhere (USB stick, laptop, tablet).
2. Keep ALL files together (index.html next to posters/, videos/, audio/, …).
3. Open index.html:
   • Double-click index.html
   • Or run Open-ABC-Adventure.bat (Windows) / Open-ABC-Adventure.command (Mac)

WHAT'S INCLUDED
---------------
• 26 letters × 6 word posters (156 cartoon posters)
• 156 short story videos
• Neural AI voice clips (Teacher + Buddy)
• Trace, Match, Pairs, I Spy, Story, Aa hunt
• Stars & progress saved on THIS device only

Version: ${VERSION}
`,
);

writeFileSync(
  join(outDir, "Open-ABC-Adventure.command"),
  `#!/bin/bash
cd "$(dirname "$0")"
PORT=8765
if command -v python3 >/dev/null 2>&1; then
  echo "ABC Adventure ${VTAG} (offline) → http://127.0.0.1:$PORT/"
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

console.log("→ Zip portable HTML app →", pkgName("portable"));
zipWithPython(outDir, appZipPath);

console.log("→ Zip code-only source →", pkgName("code"));
zipSourceTree(codeZipPath, "code");

console.log("→ Zip full codebase + assets →", pkgName("codebase"));
zipSourceTree(codebaseZipPath, "codebase");

// Remove legacy unversioned names if present
for (const legacy of [
  "ABC-Adventure-Portable.zip",
  "ABC-Adventure-Source.zip",
  "ABC-Adventure",
]) {
  const p = join(portableRoot, legacy);
  if (existsSync(p) && p !== outDir) {
    console.log("→ Remove legacy", legacy);
    rimraf(p);
  }
}

const appMeta = fileMeta(appZipPath, pkgName("portable"));
const codeMeta = fileMeta(codeZipPath, pkgName("code"));
const codebaseMeta = fileMeta(codebaseZipPath, pkgName("codebase"));

const meta = {
  version: VERSION,
  versionLabel: VTAG,
  slug: APP_SLUG,
  builtAt: new Date().toISOString(),
  packages: {
    portable: {
      ...appMeta,
      kind: "portable",
      path: `/portable/${pkgName("portable")}`,
      folder: portableFolderName,
      files: countFiles(outDir),
      note: "Ready-to-play offline HTML app (unzip → open index.html).",
    },
    code: {
      ...codeMeta,
      kind: "code",
      path: `/portable/${pkgName("code")}`,
      note: "Essential source only — no posters/videos/audio. Small, fast download.",
    },
    codebase: {
      ...codebaseMeta,
      kind: "codebase",
      path: `/portable/${pkgName("codebase")}`,
      note: "Full source + all media assets. No node_modules.",
    },
  },
  // Convenience aliases used by the UI
  portableApp: {
    ...appMeta,
    kind: "portable",
    path: `/portable/${pkgName("portable")}`,
    folder: portableFolderName,
    files: countFiles(outDir),
  },
  codeOnly: {
    ...codeMeta,
    kind: "code",
    path: `/portable/${pkgName("code")}`,
  },
  sourceCode: {
    ...codebaseMeta,
    kind: "codebase",
    path: `/portable/${pkgName("codebase")}`,
  },
};

writeFileSync(join(portableRoot, "meta.json"), JSON.stringify(meta, null, 2));
console.log("✓ Packages ready for", VTAG);
console.log("  Portable:", appMeta);
console.log("  Code:    ", codeMeta);
console.log("  Codebase:", codebaseMeta);
