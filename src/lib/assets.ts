/**
 * Asset base for online (/) vs portable package (./).
 * Portable index.html sets window.__ABC_ASSET_BASE__ = "./"
 */
declare global {
  interface Window {
    __ABC_ASSET_BASE__?: string;
  }
}

export function assetBase(): string {
  if (typeof window !== "undefined" && window.__ABC_ASSET_BASE__) {
    const b = window.__ABC_ASSET_BASE__;
    return b.endsWith("/") ? b : `${b}/`;
  }
  return "/";
}

export function assetUrl(path: string): string {
  const clean = path.replace(/^\/+/, "");
  return `${assetBase()}${clean}`;
}
