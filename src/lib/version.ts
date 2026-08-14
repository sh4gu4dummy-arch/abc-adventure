/**
 * App version — bump VERSION (project root) and this file together on every change.
 *
 * Format: 0.001, 0.002, … (display / files: v0.001)
 *
 * After each change:
 *   1. Bump this + VERSION
 *   2. Rebuild code-only ZIP (`npm run build:code`)
 *   3. Git commit
 * Portable / codebase / APK wait until the user asks.
 */

export const APP_VERSION = "0.010";
export const APP_VERSION_LABEL = `v${APP_VERSION}`;
export const APP_SLUG = "abc-adventure";
export const APP_DISPLAY_NAME = "ABC Adventure";

export type PackageKind = "portable" | "code" | "codebase" | "apk";

/** Downloadable file name for a package kind (includes version). */
export function packageFileName(kind: PackageKind, version = APP_VERSION): string {
  const v = version.startsWith("v") ? version : `v${version}`;
  switch (kind) {
    case "portable":
      return `${APP_SLUG}-${v}-portable.zip`;
    case "code":
      return `${APP_SLUG}-${v}-code.zip`;
    case "codebase":
      return `${APP_SLUG}-${v}-codebase.zip`;
    case "apk":
      return `${APP_SLUG}-${v}.apk`;
  }
}

/** Public URL path under /portable/ for a built package. */
export function packagePublicPath(kind: PackageKind, version = APP_VERSION): string {
  return `/portable/${packageFileName(kind, version)}`;
}
