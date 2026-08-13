import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Award,
  ExternalLink,
  Plus,
  Sparkles,
  Star,
  Sticker,
  Trash2,
  UserRound,
} from "lucide-react";
import {
  AVATAR_OPTIONS,
  createProfile,
  deleteProfile,
  formatLastPlayed,
  profileStats,
  selectProfile,
  ensureDefaultProfile,
  useActiveProfile,
  useProfileStore,
  type AvatarId,
} from "@/lib/profiles";
import { ACHIEVEMENTS } from "@/lib/progress-core";
import { useProgress } from "@/lib/progress";
import { PlayerAvatar } from "./AvatarIcon";
import { cn } from "@/lib/utils";
import {
  isEmbeddedPreview,
  openPreviewTopLevel,
  requestPreviewStorageAccess,
} from "@/lib/preview-safe";

const MAX_PROFILES = 8;

/**
 * Full-screen "Who's learning?" hub — pick a saved journey or start a new one.
 */
export function ProfileGate({
  mode = "gate",
  onDone,
}: {
  /** gate = no active player; switch = change player from home */
  mode?: "gate" | "switch";
  onDone?: () => void;
}) {
  const store = useProfileStore();
  const [creating, setCreating] = useState(store.profiles.length === 0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("star");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    setEmbedded(isEmbeddedPreview());
  }, []);

  // Embedded preview: skip the gate — local profile, zero cookie/sign-in.
  useEffect(() => {
    if (mode !== "gate") return;
    if (typeof window === "undefined") return;
    if (!isEmbeddedPreview() && !isGrokSandboxHost()) return;
    void (async () => {
      await requestPreviewStorageAccess();
      ensureDefaultProfile("Explorer");
      onDone?.();
    })();
  }, [mode, onDone]);

  const sorted = useMemo(
    () => [...store.profiles].sort((a, b) => b.lastPlayedAt - a.lastPlayedAt),
    [store.profiles],
  );

  async function withStorage<T>(fn: () => T): Promise<T> {
    await requestPreviewStorageAccess();
    return fn();
  }

  async function startNew() {
    await withStorage(() => {
      const profile = createProfile({ name: name || "Explorer", avatar });
      selectProfile(profile.id);
      setCreating(false);
      setName("");
      onDone?.();
    });
  }

  async function continueAs(id: string) {
    await withStorage(() => {
      selectProfile(id);
      onDone?.();
    });
  }

  /** One-tap guest so cookie/storage locks never block play */
  async function quickPlay() {
    await withStorage(() => {
      const existing = store.profiles[0];
      if (existing) {
        selectProfile(existing.id);
      } else {
        const profile = createProfile({ name: "Explorer", avatar: "star" });
        selectProfile(profile.id);
      }
      onDone?.();
    });
  }

  return (
    <div
      className={cn("profile-gate", mode === "switch" && "profile-gate-modal")}
      role="dialog"
      aria-labelledby="profile-gate-title"
    >
      <div className="profile-gate-card">
        <div className="text-center">
          <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <Sparkles className="size-3.5" /> Saved journeys
          </p>
          <h1
            id="profile-gate-title"
            className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl"
          >
            {mode === "switch" ? "Switch player" : "Who's learning?"}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm font-medium text-ink-soft sm:text-base">
            Each kid keeps their own stars, stickers, and achievements on this device
            — no Grok sign-in needed.
          </p>
        </div>

        {mode === "gate" && (
          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => void quickPlay()}
              className="pressable flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-primary px-4 py-3.5 text-base font-bold text-white shadow-[var(--shadow-letter)]"
            >
              <Sparkles className="size-5" />
              Play now
            </button>
            {/* Play now uses on-device storage only — no Grok cookies needed.
                Optional escape hatch if the host chrome still shows a cookie note. */}
            {embedded && (
              <button
                type="button"
                onClick={() => openPreviewTopLevel()}
                className="pressable flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-border bg-surface px-4 py-2 text-xs font-semibold text-ink-soft"
              >
                <ExternalLink className="size-3.5" />
                Open in full window
              </button>
            )}
          </div>
        )}

        {!creating && sorted.length > 0 && (
          <div className="mt-6 space-y-3">
            {sorted.map((p) => {
              const stats = profileStats(p);
              const achCount = p.progress.achievements?.length ?? 0;
              return (
                <div key={p.id} className="profile-save-card">
                  <button
                    type="button"
                    onClick={() => void continueAs(p.id)}
                    className="pressable flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <PlayerAvatar
                      avatar={p.avatar}
                      color={p.color}
                      name={p.name}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-lg font-bold text-ink">
                        {p.name}
                      </p>
                      <p className="text-xs font-semibold text-muted">
                        Last played {formatLastPlayed(p.lastPlayedAt)}
                      </p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs font-bold text-ink-soft">
                        <span className="inline-flex items-center gap-1">
                          <Star className="size-3.5 fill-star text-star" />
                          {stats.stars}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Sticker className="size-3.5 text-accent" />
                          {stats.stickers}/26
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Award className="size-3.5 text-primary" />
                          {achCount}/{ACHIEVEMENTS.length}
                        </span>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${p.name}`}
                    className="pressable rounded-full p-2 text-muted hover:bg-rose-50 hover:text-rose-500"
                    onClick={() => setConfirmDelete(p.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {confirmDelete && (
          <div className="mt-4 rounded-[var(--radius-md)] border border-rose-200 bg-rose-50 p-3 text-sm">
            <p className="font-semibold text-rose-800">Delete this journey?</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="pressable rounded-md bg-rose-500 px-3 py-1.5 font-bold text-white"
                onClick={() => {
                  deleteProfile(confirmDelete);
                  setConfirmDelete(null);
                }}
              >
                Delete
              </button>
              <button
                type="button"
                className="pressable rounded-md px-3 py-1.5 font-bold text-ink-soft"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {creating ? (
          <div className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-muted">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Explorer"
                maxLength={20}
                className="mt-1 w-full rounded-[var(--radius-md)] border-2 border-border bg-surface px-3 py-2.5 font-semibold text-ink outline-none focus:border-primary"
              />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">
                Avatar
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAvatar(a.id)}
                    className={cn(
                      "pressable rounded-full p-1 ring-2 ring-transparent",
                      avatar === a.id && "ring-primary",
                    )}
                    aria-label={a.label}
                  >
                    <PlayerAvatar
                      avatar={a.id}
                      color="#FF6B6B"
                      name={a.label}
                      size="sm"
                    />
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => void startNew()}
              className="pressable flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-primary px-4 py-3 font-bold text-white"
            >
              <UserRound className="size-5" />
              Start journey
            </button>
            {store.profiles.length > 0 && (
              <button
                type="button"
                onClick={() => setCreating(false)}
                className="w-full text-sm font-semibold text-ink-soft"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div className="mt-6">
            {store.profiles.length < MAX_PROFILES && (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="pressable flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border-2 border-dashed border-border px-4 py-3 font-bold text-ink-soft hover:border-primary hover:text-primary"
              >
                <Plus className="size-5" />
                New player
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function RequirePlayer({ children }: { children: React.ReactNode }) {
  const store = useProfileStore();
  const profile = store.profiles.find((p) => p.id === store.activeId) ?? null;

  useLayoutEffect(() => {
    if (!profile) ensureDefaultProfile("Explorer");
  }, [profile]);

  if (!profile) return null;
  return <>{children}</>;
}

/** Active player chip + switch control for headers. */
export function PlayerChip({ onSwitch }: { onSwitch?: () => void }) {
  const profile = useActiveProfile();
  if (!profile) return null;
  return (
    <button
      type="button"
      onClick={onSwitch}
      className="pressable inline-flex items-center gap-2 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-2.5 py-1 text-left"
      aria-label={`Player ${profile.name}. Switch player.`}
    >
      <PlayerAvatar
        avatar={profile.avatar}
        color={profile.color}
        name={profile.name}
        size="sm"
      />
      <span className="max-w-[7rem] truncate text-xs font-bold text-ink sm:text-sm">
        {profile.name}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wide text-muted">
        Switch
      </span>
    </button>
  );
}

/** Grid of unlockable achievements for the active player. */
export function AchievementsPanel() {
  const { achievements } = useProgress();
  const unlocked = new Set(achievements ?? []);
  return (
    <section
      className="card-surface rounded-[var(--radius-xl)] p-4 sm:p-5"
      aria-label="Achievements"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="font-display text-lg font-bold text-ink sm:text-xl">
          Achievements
        </h2>
        <span className="text-xs font-bold uppercase tracking-wide text-muted">
          {unlocked.size}/{ACHIEVEMENTS.length}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
        {ACHIEVEMENTS.map((a) => {
          const on = unlocked.has(a.id);
          return (
            <div
              key={a.id}
              className={cn(
                "rounded-[var(--radius-md)] border-2 px-2.5 py-2.5",
                on
                  ? "border-star/40 bg-star/10"
                  : "border-border/60 bg-surface-soft/60 opacity-70",
              )}
            >
              <div className="flex items-center gap-1.5">
                <Award
                  className={cn(
                    "size-4 shrink-0",
                    on ? "text-star" : "text-muted",
                  )}
                />
                <p className="truncate text-xs font-bold text-ink">{a.title}</p>
              </div>
              <p className="mt-1 text-[10px] font-medium leading-snug text-ink-soft">
                {a.hint}
              </p>
              <p className="mt-1 text-[10px] font-bold text-muted">+{a.stars}★</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
