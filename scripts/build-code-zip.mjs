/**
 * Rebuild the small "code only" source ZIP for the current VERSION.
 * Run after every change (with a version bump). Does NOT rebuild
 * portable / codebase / APK — those wait for an explicit ask.
 *
 *   npm run build:code
 */
import { execSync } from "node:child_process";
import {
  writeFileSync,
  readFileSync,
  rmSync,
  existsSync,
  statSync,
  mkdirSync,
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
    throw new Error(`VERSION must look like 0.001 (got ${JSON.stringify(raw)})`);
  }
  const verTs = readFileSync(join(root, "src", "lib", "version.ts"), "utf8");
  const m = verTs.match(/export const APP_VERSION = "([^"]+)"/);
  if (!m || m[1] !== raw) {
    throw new Error(
      `src/lib/version.ts APP_VERSION (${m?.[1] ?? "?"}) must equal VERSION (${raw}).`,
    );
  }
  return raw;
}

const VERSION = readVersion();
const VTAG = `v${VERSION}`;
const zipName = `${APP_SLUG}-${VTAG}-code.zip`;
const zipPath = join(portableRoot, zipName);

function fileMeta(path, name) {
  const st = statSync(path);
  const hash = createHash("sha256").update(readFileSync(path)).digest("hex").slice(0, 12);
  return { name, bytes: st.size, mb: Math.round((st.size / (1024 * 1024)) * 10) / 10, sha256_12: hash };
}

const prefix = `${APP_SLUG}-${VTAG}-code`;
const script = `
import os, zipfile, json
from pathlib import Path
root = Path(${JSON.stringify(root)})
zip_path = Path(${JSON.stringify(zipPath)})
prefix = ${JSON.stringify(prefix)}
version = ${JSON.stringify(VERSION)}
vtag = ${JSON.stringify(VTAG)}
app_slug = ${JSON.stringify(APP_SLUG)}

include_dirs = ["src", "scripts", "migrations"]
include_files = [
  "package.json", "package-lock.json", "tsconfig.json", "vite.config.ts",
  "eslint.config.mjs", ".prettierrc", "startup.sh", "PROJECT.md", "AGENTS.md",
  ".gitignore", "VERSION", "capacitor.config.ts",
]
public_keep = {
  "favicon.ico", "favicon.png", "favicon.svg", "apple-touch-icon.png",
  "manifest.webmanifest", "robots.txt", "sw.js",
}
skip_dir_names = {
  "node_modules", ".git", ".vercel", ".tanstack", ".nitro", ".output", "dist",
  "screenshots", "artifacts",
}

def skip_dir(name):
  return name in skip_dir_names or (name.startswith(".") and name not in {".grok"})

if zip_path.exists():
  zip_path.unlink()
zip_path.parent.mkdir(parents=True, exist_ok=True)

with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
  for f in include_files:
    p = root / f
    if p.is_file():
      zf.write(p, f"{prefix}/{f}")
  for d in include_dirs:
    base = root / d
    if not base.exists():
      continue
    for dirpath, dirnames, filenames in os.walk(base):
      dirnames[:] = [x for x in dirnames if not skip_dir(x)]
      for name in filenames:
        if name.endswith((".zip", ".log", ".apk")):
          continue
        fp = Path(dirpath) / name
        zf.write(fp, f"{prefix}/{fp.relative_to(root).as_posix()}")
  pub = root / "public"
  if pub.exists():
    for name in public_keep:
      p = pub / name
      if p.is_file():
        zf.write(p, f"{prefix}/public/{name}")
  zf.writestr(f"{prefix}/README-CODE.txt", f"""ABC Adventure — Code only ({vtag})
=====================================

Essential source to view and build the project.
NO heavy media (posters, videos, audio, letter art).

SETUP
-----
1. Unzip
2. npm install
3. npm run dev

Portable / APK / full codebase are separate downloads and may
be an older version until those packages are rebuilt.

Version: {version}
""")
print("wrote", zip_path, "bytes", zip_path.stat().st_size)
`;

mkdirSync(portableRoot, { recursive: true });
const tmp = join(root, "scripts", ".tmp-zip-code.py");
writeFileSync(tmp, script);
execSync(`python3 "${tmp}"`, { stdio: "inherit" });
try {
  rmSync(tmp);
} catch {
  /* ignore */
}

const codeMeta = {
  ...fileMeta(zipPath, zipName),
  kind: "code",
  version: VERSION,
  path: `/portable/${zipName}`,
  note: "Essential source only — no posters/videos/audio. Small, fast download.",
  builtAt: new Date().toISOString(),
};

const metaPath = join(portableRoot, "meta.json");
let meta = {};
if (existsSync(metaPath)) {
  try {
    meta = JSON.parse(readFileSync(metaPath, "utf8"));
  } catch {
    meta = {};
  }
}
meta.appVersion = VERSION;
meta.appVersionLabel = VTAG;
meta.version = VERSION;
meta.versionLabel = VTAG;
meta.slug = APP_SLUG;
meta.codeBuiltAt = codeMeta.builtAt;
meta.packages = { ...(meta.packages || {}), code: codeMeta };
meta.codeOnly = codeMeta;
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");

console.log("✓ Code-only ZIP ready:", zipName, codeMeta);
