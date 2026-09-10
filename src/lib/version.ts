/**
 * App version — bump VERSION (project root) and this file together on every change.
 *
 * Format: 0.001, 0.002, … (display / files: v0.001)
 *
 * After each change:
 *   1. Bump this + VERSION
 *   2. Rebuild code-only ZIP (`npm run build:code`)
 *   3. Git commit
 *   4. Push GitHub (every commit — do not ask)
 * Portable / codebase / APK wait until the user asks.
 * Grok Publish: still remind at v0.070, v0.080… so the public link can match.
 */

export const APP_VERSION = "0.098";
export const APP_VERSION_LABEL = `v${APP_VERSION}`;
export const APP_SLUG = "abc-adventure";
export const APP_DISPLAY_NAME = "ABC Adventure";

export type PackageKind = "portable" | "code" | "codebase" | "apk" | "media";

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
    case "media":
      return `${APP_SLUG}-${v}-media.zip`;
    case "apk":
      return `${APP_SLUG}-${v}.apk`;
  }
}

/** Public URL path that actually streams the file (not the SPA). */
export function packagePublicPath(kind: PackageKind, version = APP_VERSION): string {
  return `/dl/${packageFileName(kind, version)}`;
}

/** "v0.017 · Updated Aug 19, 2026, 8:12 AM" for download cards. */
export function formatPackageUpdated(
  iso?: string | null,
  version?: string | null,
): string {
  const v = version
    ? version.startsWith("v")
      ? version
      : `v${version}`
    : "";
  if (!iso) return v;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return v;
  const when = d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  return v ? `${v} · Updated ${when}` : `Updated ${when}`;
}
