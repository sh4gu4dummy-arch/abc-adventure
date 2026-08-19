/**
 * Build a real Android APK (Capacitor + SDK).
 * Run ONLY when the user asks — not on every feature change.
 *
 * Prerequisites (already set up in this workspace when available):
 *   - Android SDK at /workspace/.android-sdk
 *   - JDK 21 at /workspace/.jdk-21
 *   - Portable web app at public/portable/abc-adventure-vX.YYY-portable/
 *
 * Output:
 *   public/portable/abc-adventure-vX.YYY.apk
 *
 * Usage: npm run build:apk
 */
import { execSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  copyFileSync,
  statSync,
} from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const version = readFileSync(join(root, "VERSION"), "utf8").trim();
const vtag = `v${version}`;
const APP_SLUG = "abc-adventure";
const apkName = `${APP_SLUG}-${vtag}.apk`;
const portableDir = join(root, "public", "portable", `${APP_SLUG}-${vtag}-portable`);
const portableRoot = join(root, "public", "portable");
const outApk = join(portableRoot, apkName);

const androidHome = process.env.ANDROID_HOME || join(root, ".android-sdk");
const javaHome = process.env.JAVA_HOME || join(root, ".jdk-21");

function sh(cmd, opts = {}) {
  console.log("→", cmd);
  execSync(cmd, { stdio: "inherit", cwd: root, ...opts });
}

if (!existsSync(join(javaHome, "bin", "java"))) {
  throw new Error(`JDK 21 not found at ${javaHome}. Install/unpack Temurin 21 there.`);
}
if (!existsSync(androidHome)) {
  throw new Error(`Android SDK not found at ${androidHome}.`);
}
if (!existsSync(join(portableDir, "index.html"))) {
  throw new Error(
    `Portable web assets missing: ${portableDir}\nRun npm run build:portable first.`,
  );
}

// Ensure local.properties
writeFileSync(
  join(root, "android", "local.properties"),
  `sdk.dir=${androidHome.replace(/\\/g, "/")}\n`,
);

// Sync version into app/build.gradle
const appGradle = join(root, "android", "app", "build.gradle");
let gradle = readFileSync(appGradle, "utf8");
const versionCode = (() => {
  const [maj, min] = version.split(".");
  return Number(maj) * 1000 + Number(min);
})();
gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`);
gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${version}"`);
writeFileSync(appGradle, gradle);

const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  ANDROID_HOME: androidHome,
  ANDROID_SDK_ROOT: androidHome,
  PATH: `${join(javaHome, "bin")}:${join(androidHome, "platform-tools")}:${process.env.PATH || ""}`,
};

console.log(`→ Building Android APK ${vtag}`);
sh("npx cap sync android", { env });
sh("./gradlew assembleRelease --no-daemon", {
  cwd: join(root, "android"),
  env,
});

const built = join(
  root,
  "android",
  "app",
  "build",
  "outputs",
  "apk",
  "release",
  "app-release.apk",
);
if (!existsSync(built)) {
  throw new Error(`Gradle did not produce ${built}`);
}

mkdirSync(portableRoot, { recursive: true });
copyFileSync(built, outApk);
const bytes = statSync(outApk).size;
const hash = createHash("sha256").update(readFileSync(outApk)).digest("hex").slice(0, 12);
const apkMeta = {
  name: apkName,
  bytes,
  mb: Math.round((bytes / (1024 * 1024)) * 10) / 10,
  sha256_12: hash,
  kind: "apk",
  version,
  builtAt: new Date().toISOString(),
  path: `/portable/${apkName}`,
  note: "Android installable APK (sideload). Offline letter world with media bundled.",
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
meta.version = version;
meta.versionLabel = vtag;
meta.slug = APP_SLUG;
meta.builtAt = apkMeta.builtAt;
meta.appVersion = version;
meta.appVersionLabel = vtag;
meta.apk = apkMeta;
meta.packages = { ...(meta.packages || {}), apk: apkMeta };
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + "\n");

console.log("✓ APK ready:");
console.log(" ", outApk);
console.log(" ", apkMeta);
