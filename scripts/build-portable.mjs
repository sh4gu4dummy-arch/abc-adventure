/**
 * Build a fully offline portable package:
 *   public/portable/ABC-Adventure/
 *     index.html, app.js, app.css, posters/, letters/, audio/, fonts/, README.txt
 *   public/portable/ABC-Adventure-Portable.zip
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
const outDir = join(portableRoot, "ABC-Adventure");
const zipPath = join(portableRoot, "ABC-Adventure-Portable.zip");

function rimraf(p) {
  if (existsSync(p)) rmSync(p, { recursive: true, force: true });
}

function countFiles(dir) {
  let n = 0;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) n += countFiles(p);
    else n += 1;
  }
  return n;
}

console.log("→ Clean portable output");
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

console.log("→ Bundle JS (IIFE)");
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

console.log("→ Copy media assets");
for (const dir of ["posters", "letters", "audio", "fonts"]) {
  cpSync(join(root, "public", dir), join(outDir, dir), { recursive: true });
}

writeFileSync(
  join(outDir, "index.html"),
  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="theme-color" content="#ff6b6b" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <title>ABC Adventure — Letter World (Portable)</title>
  <meta name="description" content="Offline alphabet learning for kids — 26 letters, posters, AI voice, tracing, and games." />
  <link rel="stylesheet" href="./app.css" />
  <script>
    window.__ABC_ASSET_BASE__ = "./";
  </script>
</head>
<body>
  <div id="root"></div>
  <script src="./app.js"></script>
</body>
</html>
`,
);

writeFileSync(
  join(outDir, "README.txt"),
  `ABC Adventure — Portable Offline Package
========================================

HOW TO USE
----------
1. Unzip this folder anywhere (USB drive, laptop, tablet storage).
2. Keep ALL files together — do not move index.html away from the posters/, audio/, letters/, fonts/ folders.
3. Open index.html in Chrome, Edge, Firefox, or Safari.

   • Easiest: double-click index.html
   • If audio or images fail on double-click (some browsers lock file://),
     double-click Open-ABC-Adventure.bat (Windows) or Open-ABC-Adventure.command (Mac),
     or run:  python3 -m http.server 8765
     then visit http://127.0.0.1:8765/

WHAT'S INSIDE
-------------
• 26 letter screens with 6 cartoon word posters each (156 posters)
• Natural AI voice clips for letters, words, rhymes, and games
• Trace, Match, I Spy, and Fun facts
• Progress stars saved on this device (localStorage)

NO INTERNET REQUIRED after download.
NO INSTALL. Works for classroom USB kits and home use.

Made with Grok
`,
);

writeFileSync(
  join(outDir, "Open-ABC-Adventure.command"),
  `#!/bin/bash
cd "$(dirname "$0")"
if command -v python3 >/dev/null 2>&1; then
  echo "Opening ABC Adventure at http://127.0.0.1:8765 …"
  (sleep 1; open "http://127.0.0.1:8765/" 2>/dev/null || xdg-open "http://127.0.0.1:8765/" 2>/dev/null || true) &
  python3 -m http.server 8765
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
where python >nul 2>nul
if %ERRORLEVEL%==0 (
  start "" http://127.0.0.1:8765/
  python -m http.server 8765
) else (
  start "" "%~dp0index.html"
)
`,
);

console.log("→ Zip package (Python)");
rimraf(zipPath);
execSync(
  `python3 -c "import shutil; shutil.make_archive(r'${zipPath.slice(0, -4)}', 'zip', r'${portableRoot}', 'ABC-Adventure')"`,
  { stdio: "inherit" },
);

const zipStat = statSync(zipPath);
const hash = createHash("sha256").update(readFileSync(zipPath)).digest("hex").slice(0, 12);
const meta = {
  name: "ABC-Adventure-Portable.zip",
  bytes: zipStat.size,
  mb: Math.round((zipStat.size / (1024 * 1024)) * 10) / 10,
  builtAt: new Date().toISOString(),
  sha256_12: hash,
  files: countFiles(outDir),
};
writeFileSync(join(portableRoot, "meta.json"), JSON.stringify(meta, null, 2));
console.log("✓ Portable package ready:", meta);
