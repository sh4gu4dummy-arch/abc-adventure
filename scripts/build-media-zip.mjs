/**
 * Media-only ZIP: letters, posters, videos, audio, icons, art archive.
 * No source code. Rebuild when asked (or with a media download request).
 *
 *   npm run build:media
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
const zipName = `${APP_SLUG}-${VTAG}-media.zip`;
const zipPath = join(portableRoot, zipName);

function fileMeta(path, name) {
  const st = statSync(path);
  const hash = createHash("sha256").update(readFileSync(path)).digest("hex").slice(0, 12);
  return {
    name,
    bytes: st.size,
    mb: Math.round((st.size / (1024 * 1024)) * 10) / 10,
    sha256_12: hash,
  };
}

const prefix = `${APP_SLUG}-${VTAG}-media`;
const script = `
import os, zipfile
from pathlib import Path
root = Path(${JSON.stringify(root)})
zip_path = Path(${JSON.stringify(zipPath)})
prefix = ${JSON.stringify(prefix)}
version = ${JSON.stringify(VERSION)}
vtag = ${JSON.stringify(VTAG)}

include_dirs = [
  "public/letters",
  "public/posters",
  "public/posters-scene",
  "public/videos",
  "public/audio",
  "public/icons",
  "public/art-archive",
  "public/review",
]
skip_dir_names = {
  "node_modules", ".git", "portable", "screenshots", "artifacts",
}
skip_suffixes = (".zip", ".log", ".apk")

def skip_dir(name):
  return name in skip_dir_names or name.startswith(".")

if zip_path.exists():
  zip_path.unlink()
zip_path.parent.mkdir(parents=True, exist_ok=True)

count = 0
with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_STORED) as zf:
  for d in include_dirs:
    base = root / d
    if not base.exists():
      continue
    for dirpath, dirnames, filenames in os.walk(base):
      dirnames[:] = [x for x in dirnames if not skip_dir(x)]
      for name in filenames:
        if name.endswith(skip_suffixes):
          continue
        fp = Path(dirpath) / name
        rel = fp.relative_to(root).as_posix()
        zf.write(fp, f"{prefix}/{rel}")
        count += 1
  zf.writestr(f"{prefix}/README-MEDIA.txt", f"""ABC Adventure — Media only ({vtag})
=======================================

Pictures, videos, and voice — no app source.

  letters/        Letter-buddy characters (home tiles)
  posters/        Word pictures (apple, cat, dog…)
  posters-scene/  Extra scene fills
  videos/         Word clips, meet-the-buddy, series
  audio/          Letter and word voice
  icons/          App icons
  art-archive/    Old tiles we kept
  review/         Letter Buddies review clips

Version: {version}
""")
print("wrote", zip_path, "files", count, "bytes", zip_path.stat().st_size)
`;

mkdirSync(portableRoot, { recursive: true });
const tmp = join(root, "scripts", ".tmp-zip-media.py");
writeFileSync(tmp, script);
execSync(`python3 "${tmp}"`, { stdio: "inherit" });
try {
  rmSync(tmp);
} catch {
  /* ignore */
}

const mediaMeta = {
  ...fileMeta(zipPath, zipName),
  kind: "media",
  version: VERSION,
  path: `/portable/${zipName}`,
  note: "Letters, posters, videos, audio, and archived art. No source code.",
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
meta.mediaBuiltAt = mediaMeta.builtAt;
meta.packages = { ...(meta.packages || {}), media: mediaMeta };
meta.mediaOnly = mediaMeta;
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");

console.log("✓ Media-only ZIP ready:", zipName, mediaMeta);
