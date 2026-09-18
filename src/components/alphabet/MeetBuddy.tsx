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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setIdx(letterIndex(entry.letter));
    setClipIdx(0);
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
    setClipIdx(0);
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
    const v = videoRef.current;
    if (!v || !src) return;
    stopSpeech();
    v.src = src;
    v.muted = !playUnmuted;
    v.volume = 1;
    const tryPlay = () => {
      void v.play().catch(() => {
        /* autoplay may wait for tap — keep the player visible */
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
  }, [src, title, selfVoice, kind, playUnmuted]);

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
              !failed && src && "opacity-0",
            )}
          />
          {src && !failed && (
            <video
              key={src}
              ref={videoRef}
              playsInline
              muted={!playUnmuted}
              autoPlay
              preload="auto"
              poster={poster}
              className="absolute inset-0 h-full w-full object-cover"
              onError={() => setFailed(true)}
              onPlay={() => setPaused(false)}
              onPause={() => setPaused(true)}
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
          {paused && !failed && src && (
            <button
              type="button"
              className="absolute inset-0 z-[2] grid place-items-center"
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
        </div>
      </div>
    </div>
  );
}
