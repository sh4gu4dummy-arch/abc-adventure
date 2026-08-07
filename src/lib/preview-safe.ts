/**
 * Live-preview safety helpers.
 *
 * The Grok preview runs this app inside a cross-origin iframe where third-party
 * cookies are often blocked. Service workers + aggressive caching can make that
 * worse (stale shells, broken Set-Cookie on /api/auth). Profiles use local
 * storage which can also throw in locked-down iframes.
 */

export function isEmbeddedPreview(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.top !== window.self) return true;
  } catch {
    // cross-origin top access throws → definitely embedded
    return true;
  }
  return window.location.hostname.endsWith(".grok-sandbox.com");
}

export function isGrokSandboxHost(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hostname.endsWith(".grok-sandbox.com");
}

/** Unregister SWs + clear caches in the embedded preview so auth/cookies work. */
export async function neutralizeServiceWorkerInPreview(): Promise<void> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
  if (!isEmbeddedPreview() && !isGrokSandboxHost()) return;
  try {
    const regs = await navigator.serviceWorker.getRegistrations();
    await Promise.all(regs.map((r) => r.unregister()));
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
  } catch {
    /* best-effort */
  }
}

/**
 * Ask the browser for first-party storage access (Chrome Storage Access API).
 * Must run from a user gesture. Safe no-op when unsupported.
 */
export async function requestPreviewStorageAccess(): Promise<boolean> {
  if (typeof document === "undefined") return true;
  const doc = document as Document & {
    hasStorageAccess?: () => Promise<boolean>;
    requestStorageAccess?: () => Promise<void>;
  };
  try {
    if (typeof doc.hasStorageAccess === "function") {
      if (await doc.hasStorageAccess()) return true;
    }
    if (typeof doc.requestStorageAccess === "function") {
      await doc.requestStorageAccess();
      return true;
    }
  } catch {
    return false;
  }
  return true;
}

/** Open this app outside the iframe (top-level) so cookies/storage work fully. */
export function openPreviewTopLevel(): void {
  if (typeof window === "undefined") return;
  const url = window.location.href;
  try {
    // Prefer a real new tab — works even when parent is cross-origin
    window.open(url, "_blank", "noopener,noreferrer");
  } catch {
    window.location.href = url;
  }
}

// ── resilient local storage (memory fallback when iframe blocks it) ─────────

const memory = new Map<string, string>();

export function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

export function safeSetItem(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
    memory.set(key, value);
  } catch {
    memory.set(key, value);
  }
}

export function safeRemoveItem(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
  memory.delete(key);
}
