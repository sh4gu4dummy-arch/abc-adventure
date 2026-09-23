import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Users, X } from "lucide-react";
import {
  LETTERS,
  letterMeetPlaylist,
  letterFriendsPlaylist,
  letterHasFriends,
  friendsHeading,
  letterHeroPath,
  displayGlyph,
  caseTitle,
  type LetterEntry,
} from "@/data/alphabet";
import { speak, stopSpeech, primeAudioFromGesture } from "@/lib/speak";
import { APP_VERSION } from "@/lib/version";
import { cn } from "@/lib/utils";
import { useCaseMode } from "@/lib/case-mode";

/** Meet A–Z: cartoon letter voice is in the clip. No teacher overlay. */
const MEET_SELF_VOICE = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));

export type ClipKind = "meet" | "friends";

function letterIndex(letter: string) {
  const i = LETTERS.findIndex(
    (l) => l.letter.toUpperCase() === letter.toUpperCase(),
  );
  return i < 0 ? 0 : i;
}

/**
 * 10s 480p "meet the buddy" — tap to play. Original still stays as poster.
 */
export function MeetBuddyButton({
  entry,
  onOpen,
}: {
  entry: LetterEntry;
  onOpen: () => void;
}) {
  const { mode } = useCaseMode();
  const glyph = displayGlyph(entry.letter, mode);
  return (
    <button
      type="button"
      onClick={() => {
        primeAudioFromGesture();
        onOpen();
      }}
      className="pressable inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-white/95 px-4 py-2.5 text-sm font-bold shadow"
      style={{ color: entry.accent }}
    >
      <Play className="size-4 fill-current" /> Meet {glyph}
    </button>
  );
}

export function FriendsBuddyButton({
  entry,
  onOpen,
}: {
  entry: LetterEntry;
  onOpen: () => void;
}) {
  const { mode } = useCaseMode();
  if (!letterHasFriends(entry.letter, mode)) return null;
  return (
    <button
      type="button"
      onClick={() => {
        primeAudioFromGesture();
        onOpen();
      }}
      className="pressable inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-white/95 px-4 py-2.5 text-sm font-bold shadow"
      style={{ color: entry.accent }}
    >
      <Users className="size-4" /> {friendsHeading(entry.letter, mode)}
    </button>
  );
}

export function MeetBuddyModal({
  entry,
  onClose,
  kind = "meet",
}: {
  entry: LetterEntry;
  onClose: () => void;
  kind?: ClipKind;
}) {
  const { mode } = useCaseMode();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [idx, setIdx] = useState(() => letterIndex(entry.letter));
  const [clipIdx, setClipIdx] = useState(0);
  const [paused, setPaused] = useState(true);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [seekReady, setSeekReady] = useState(false);

  useEffect(() => {
    setIdx(letterIndex(entry.letter));
    setClipIdx(0);
    setProgress(0);
    setSeekReady(false);
    setStarted(false);
  }, [entry.letter, kind]);

  const current = LETTERS[idx]!;
  const playlist =
    kind === "friends"
      ? letterFriendsPlaylist(current.letter, mode)
      : letterMeetPlaylist(current.letter, mode);
  const friendCount = LETTERS.filter((l) =>
    letterHasFriends(l.letter, mode),
  ).length;
  const showArrows = kind === "meet" || friendCount > 1;
  const prev = LETTERS[(idx - 1 + LETTERS.length) % LETTERS.length]!;
  const next = LETTERS[(idx + 1) % LETTERS.length]!;
  const title = caseTitle(current.letter, mode);
  const heading =
    kind === "friends" ? friendsHeading(current.letter, mode) : `Meet ${title}`;
  const prevGlyph = displayGlyph(prev.letter, mode);
  const nextGlyph = displayGlyph(next.letter, mode);
  const poster = letterHeroPath(current.letter, mode);
  const clip = Math.min(clipIdx, Math.max(0, playlist.length - 1));
  const src = playlist.length
    ? `${playlist[clip]}?v=${APP_VERSION}`
    : "";
  const selfVoice =
    kind === "meet" && MEET_SELF_VOICE.has(current.letter.toUpperCase());
  const playUnmuted = kind === "friends" || selfVoice;

  const stepLetter = (dir: 1 | -1) => {
    primeAudioFromGesture();
    setFailed(false);
    setPaused(true);
    setStarted(false);
    setClipIdx(0);
    setProgress(0);
    setSeekReady(false);
    let i = idx;
    for (let n = 0; n < LETTERS.length; n++) {
      i = (i + dir + LETTERS.length) % LETTERS.length;
      if (kind === "meet" || letterHasFriends(LETTERS[i]!.letter, mode)) {
        setIdx(i);
        return;
      }
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && showArrows) {
        e.preventDefault();
        stepLetter(-1);
      } else if (e.key === "ArrowRight" && showArrows) {
        e.preventDefault();
        stepLetter(1);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!started) return;
    const v = videoRef.current;
    if (!v || !src) return;
    stopSpeech();
    v.src = src;
    v.muted = !playUnmuted;
    v.volume = 1;
    setProgress(0);
    setSeekReady(false);
    const tryPlay = () => {
      void v.play().catch(() => {
        /* tap already happened — keep the poster if play is blocked */
      });
    };
    v.addEventListener("canplay", tryPlay, { once: true });
    tryPlay();
    if (kind === "meet" && !selfVoice) {
      void speak(`The letter ${title}`);
    }
    return () => {
      stopSpeech();
      v.removeEventListener("canplay", tryPlay);
      try {
        v.pause();
        v.removeAttribute("src");
        v.load();
      } catch {
        /* ignore */
      }
    };
  }, [started, src, title, selfVoice, kind, playUnmuted]);

  function fractionFromEvent(el: HTMLElement, clientX: number) {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }

  function applySeek(frac: number) {
    const v = videoRef.current;
    const f = Math.min(1, Math.max(0, frac));
    if (v && v.duration && Number.isFinite(v.duration) && v.duration > 0) {
      v.currentTime = f * v.duration;
    }
    setProgress(f);
  }

  return (
    <div
      className="modal-scrim fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={heading}
    >
      <div
        className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-surface shadow-[var(--shadow-float)] sm:h-auto sm:max-h-[min(94dvh,880px)] sm:rounded-[var(--radius-xl)] sm:border-2 sm:border-border"
        style={{
          background: `linear-gradient(180deg, ${current.hue}33 0%, var(--color-surface) 46%)`,
        }}
      >
        <div className="flex items-center justify-between gap-2 p-3">
          <p className="px-2 text-sm font-bold tracking-wide text-muted">
            {heading}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full bg-surface text-ink shadow-md"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        <div
          className="relative mx-3 aspect-[2/3] overflow-hidden rounded-[var(--radius-lg)] border-2 border-white/70 shadow-[var(--shadow-poster)] sm:mx-5"
          style={{
            background: `linear-gradient(160deg, ${current.hue}55, ${current.hue}18)`,
          }}
        >
          <img
            src={poster}
            alt=""
            className={cn(
              "absolute inset-0 h-full w-full object-cover",
              !failed && started && "opacity-0",
            )}
          />
          {started && src && !failed && (
            <video
              key={src}
              ref={videoRef}
              playsInline
              muted={!playUnmuted}
              preload="none"
              poster={poster}
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setFailed(true)}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
              onLoadedMetadata={(e) => {
                const d = e.currentTarget.duration;
                if (d && Number.isFinite(d) && d > 0) setSeekReady(true);
              }}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                if (v.duration && Number.isFinite(v.duration) && v.duration > 0) {
                  setProgress(v.currentTime / v.duration);
                }
              }}
              onClick={(e) => {
                const v = e.currentTarget;
                if (v.paused) void v.play();
                else v.pause();
              }}
              onEnded={() => {
                if (playlist.length > 1) {
                  setClipIdx((i) => (i + 1) % playlist.length);
                } else {
                  setPaused(true);
                }
              }}
            />
          )}
          {!started && src && (
            <button
              type="button"
              className="absolute inset-0 z-[2] grid place-items-center"
              onClick={() => {
                primeAudioFromGesture();
                setStarted(true);
                setPaused(false);
              }}
              aria-label="Play"
            >
              <span className="grid size-16 place-items-center rounded-full bg-white/90 text-ink shadow-lg">
                <Play className="size-7 fill-current" />
              </span>
            </button>
          )}
          {started && paused && !failed && src && (
            <button
              type="button"
              className="absolute inset-x-0 top-0 z-[2] grid place-items-center"
              style={{ bottom: seekReady ? "2.75rem" : 0 }}
              onClick={() => void videoRef.current?.play()}
              aria-label="Play"
            >
              <span className="grid size-16 place-items-center rounded-full bg-white/90 text-ink shadow-lg">
                <Play className="size-7 fill-current" />
              </span>
            </button>
          )}
          {showArrows && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepLetter(-1);
                }}
                className="absolute left-2 top-1/2 z-[5] flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-on-light shadow-lg"
                aria-label={`Previous, ${prevGlyph}`}
              >
                <ChevronLeft className="size-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  stepLetter(1);
                }}
                className="absolute right-2 top-1/2 z-[5] flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-on-light shadow-lg"
                aria-label={`Next, ${nextGlyph}`}
              >
                <ChevronRight className="size-7" />
              </button>
            </>
          )}
          {src && !failed && seekReady && (
            <div
              className="absolute inset-x-0 bottom-0 z-[6] h-11 cursor-pointer touch-none px-2"
              role="slider"
              aria-label="Video time"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress * 100)}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
                applySeek(fractionFromEvent(e.currentTarget, e.clientX));
              }}
              onPointerMove={(e) => {
                if (e.buttons === 0) return;
                e.preventDefault();
                e.stopPropagation();
                applySeek(fractionFromEvent(e.currentTarget, e.clientX));
              }}
            >
              <div className="absolute inset-x-3 bottom-3 h-2.5 overflow-hidden rounded-full bg-black/40">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${progress * 100}%`, background: current.accent }}
                />
              </div>
              <div
                className="pointer-events-none absolute bottom-[0.45rem] size-4 rounded-full border-2 border-white shadow"
                style={{
                  left: `calc(${progress * 100}% * 0.92 + 0.75rem)`,
                  background: current.accent,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
