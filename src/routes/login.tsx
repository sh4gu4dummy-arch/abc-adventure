import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import {
  isEmbeddedPreview,
  openPreviewTopLevel,
  requestPreviewStorageAccess,
} from "@/lib/preview-safe";

/**
 * Optional cloud sign-in (Google / X via Grok broker).
 * Letter World does NOT require this — local profiles work without cookies.
 *
 * Live preview uses popup + bearer token (partitioned iframe cookies).
 */
export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const embedded = typeof window !== "undefined" && isEmbeddedPreview();

  return (
    <main className="grid min-h-[calc(100dvh-var(--grok-banner-h,0px))] place-items-center p-6">
      <div className="card-surface w-full max-w-sm space-y-4 rounded-[var(--radius-xl)] p-8">
        <Link to="/" className="text-sm font-semibold text-ink-soft hover:text-ink">
          ← Back to Letter World
        </Link>
        <h1 className="font-display text-2xl font-bold text-ink">Sign in</h1>
        <p className="text-sm text-ink-soft">
          Optional — each kid's stars and stickers already save on this device
          without an account.
        </p>

        {embedded && authEnabled && (
          <div className="rounded-[var(--radius-md)] border border-border bg-surface-soft px-3 py-2 text-xs font-medium text-ink-soft">
            Cloud sign-in is optional. Letter World saves progress on this device
            without cookies.{" "}
            <button
              type="button"
              className="font-bold text-primary underline"
              onClick={() => openPreviewTopLevel()}
            >
              Open full window
            </button>{" "}
            only if you want Grok account sign-in.
          </div>
        )}

        {authEnabled ? (
          GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              onClick={() => {
                void (async () => {
                  await requestPreviewStorageAccess();
                  await signIn(p.providerId, { callbackURL: "/" });
                })();
              }}
              className="pressable w-full rounded-[var(--radius-md)] border-2 border-border bg-surface-soft px-4 py-3 font-semibold text-ink"
            >
              Continue with {p.label}
            </button>
          ))
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled for this build.</p>
        )}

        <Link
          to="/"
          className="pressable block w-full rounded-[var(--radius-md)] bg-primary px-4 py-3 text-center font-bold text-white"
        >
          Continue without signing in
        </Link>
      </div>
    </main>
  );
}
