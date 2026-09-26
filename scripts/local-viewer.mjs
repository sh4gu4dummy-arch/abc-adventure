#!/usr/bin/env node
/**
 * ABC Adventure — local offline viewer (unique port, not 8080).
 *
 * Serves the ready-to-play portable folder over HTTP so media/audio work
 * offline without Vite. Does NOT touch the live-preview contract on :8080.
 *
 * Default port: 26233 (ABC Adventure only — override with ABC_VIEWER_PORT).
 *
 * Usage:
 *   npm run view
 *   npm run view -- --build     # rebuild portable first (heavy)
 *   ABC_VIEWER_PORT=26233 npm run view
 *
 * Needs: public/portable/abc-adventure-v*-portable/ (from npm run build:portable)
 */
import { createServer } from "node:http";
import { existsSync, readdirSync, statSync, createReadStream } from "node:fs";
import { join, extname, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const portableRoot = join(root, "public", "portable");

/** Unique for this game — never 8080 / 8081 (Vite live preview). */
const DEFAULT_PORT = 26233;
const PORT = Number(process.env.ABC_VIEWER_PORT || DEFAULT_PORT);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json",
};

function latestPortableDir() {
  if (!existsSync(portableRoot)) return null;
  const dirs = readdirSync(portableRoot)
    .filter((n) => /^abc-adventure-v[\d.]+-portable$/.test(n))
    .map((n) => join(portableRoot, n))
    .filter((p) => existsSync(join(p, "index.html")))
    .sort((a, b) => {
      const sa = statSync(a).mtimeMs;
      const sb = statSync(b).mtimeMs;
      return sb - sa;
    });
  return dirs[0] || null;
}

function wantBuild() {
  return process.argv.includes("--build") || process.argv.includes("-b");
}

if (wantBuild()) {
  console.log("→ npm run build:portable (this can take a while)…");
  const r = spawnSync("npm", ["run", "build:portable"], {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (r.status !== 0) process.exit(r.status || 1);
}

const serveRoot = latestPortableDir();
if (!serveRoot) {
  console.error(
    [
      "No portable offline build found.",
      "  Expected: public/portable/abc-adventure-v*-portable/index.html",
      "  Build once:  npm run build:portable",
      "  Or:          npm run view -- --build",
    ].join("\n"),
  );
  process.exit(1);
}

if (!Number.isFinite(PORT) || PORT === 8080 || PORT === 8081) {
  console.error(
    `ABC viewer port must be unique (got ${PORT}). Use ABC_VIEWER_PORT≠8080/8081 (default ${DEFAULT_PORT}).`,
  );
  process.exit(1);
}

function safeJoin(base, urlPath) {
  const decoded = decodeURIComponent((urlPath || "/").split("?")[0]);
  const rel = decoded.replace(/^\/+/, "");
  const full = resolve(base, rel || "index.html");
  if (!full.startsWith(resolve(base))) return null;
  return full;
}

const server = createServer((req, res) => {
  let filePath = safeJoin(serveRoot, req.url || "/");
  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, "index.html");
  }
  if (!existsSync(filePath) || !statSync(filePath).isFile()) {
    // SPA-ish fallback for client routes
    const index = join(serveRoot, "index.html");
    if (existsSync(index) && !extname(filePath)) {
      filePath = index;
    } else {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
  }
  const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": type,
    "Cache-Control": "no-cache",
  });
  createReadStream(filePath).pipe(res);
});

server.listen(PORT, "127.0.0.1", () => {
  const name = serveRoot.split(/[/\\]/).pop();
  console.log(`ABC Adventure offline viewer`);
  console.log(`  folder: ${name}`);
  console.log(`  open:   http://127.0.0.1:${PORT}/`);
  console.log(`  (Vite live preview stays on :8080 — this port is viewer-only.)`);
});
