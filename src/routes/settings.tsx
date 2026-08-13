import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Settings2, UserRound } from "lucide-react";
import { useState } from "react";
import { LayoutToggle } from "@/components/alphabet/LayoutToggle";
import { GfxToggle } from "@/components/alphabet/GfxToggle";
import { ThemeToggle } from "@/components/alphabet/ThemeToggle";
import { VoiceToggle } from "@/components/alphabet/VoiceToggle";
import { PlayerChip, ProfileGate } from "@/components/alphabet/ProfileGate";
import { clearActiveProfile } from "@/lib/profiles";
import { APP_VERSION_LABEL } from "@/lib/version";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const [switching, setSwitching] = useState(false);

  return (
    <main className="app-shell">
      {switching && (
        <ProfileGate mode="switch" onDone={() => setSwitching(false)} />
      )}

      <Link
        to="/"
        className="pressable mb-4 inline-flex items-center gap-1.5 text-sm font-bold text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Home
      </Link>

      <header className="mb-6">
        <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-primary/12 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Settings2 className="size-3.5" /> Preferences
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">Settings</h1>
        <p className="mt-1 max-w-md text-sm font-medium text-ink-soft">
          Voice, look, and player — saved on this device only.
        </p>
      </header>

      <section className="card-surface mb-4 rounded-[var(--radius-xl)] p-4 sm:p-5">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
          <UserRound className="size-5 text-primary" /> Player
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <PlayerChip onSwitch={() => setSwitching(true)} />
          <button
            type="button"
            onClick={() => setSwitching(true)}
            className="pressable rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-2 text-sm font-bold text-ink"
          >
            Switch player
          </button>
          <button
            type="button"
            onClick={() => clearActiveProfile()}
            className="pressable text-sm font-bold text-muted underline-offset-2 hover:text-ink-soft hover:underline"
          >
            Back to who's learning
          </button>
        </div>
      </section>

      <section className="card-surface mb-4 space-y-4 rounded-[var(--radius-xl)] p-4 sm:p-5">
        <h2 className="font-display text-lg font-bold text-ink">Sound & voice</h2>
        <VoiceToggle />
      </section>

      <section className="card-surface mb-4 space-y-4 rounded-[var(--radius-xl)] p-4 sm:p-5">
        <h2 className="font-display text-lg font-bold text-ink">Display</h2>
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Theme
            </p>
            <ThemeToggle />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Layout
            </p>
            <LayoutToggle />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Graphics
            </p>
            <GfxToggle />
          </div>
        </div>
      </section>

      <p className="text-center text-xs font-medium text-muted">
        App {APP_VERSION_LABEL} · Need offline copies?{" "}
        <Link to="/downloads" className="font-bold text-primary underline-offset-2 hover:underline">
          Downloads
        </Link>
      </p>
    </main>
  );
}
