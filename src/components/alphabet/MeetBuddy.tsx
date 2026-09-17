import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import {
  LETTERS,
  letterMeetPlaylist,
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

export function MeetBuddyModal({
  entry,
  onClose,
}: {
  entry: LetterEntry;
  onClose: () => void;
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
  }, [entry.letter]);

  const current = LETTERS[idx]!;
  const prev = LETTERS[(idx - 1 + LETTERS.length) % LETTERS.length]!;
  const next = LETTERS[(idx + 1) % LETTERS.length]!;
  const title = caseTitle(current.letter, mode);
  const prevGlyph = displayGlyph(prev.letter, mode);
  const nextGlyph = displayGlyph(next.letter, mode);
  const poster = letterHeroPath(current.letter, mode);
  const playlist = letterMeetPlaylist(current.letter, mode);
  const clip = Math.min(clipIdx, Math.max(0, playlist.length - 1));
  const src = `${playlist[clip]}?v=${APP_VERSION}`;
  const selfVoice = MEET_SELF_VOICE.has(current.letter.toUpperCase());

  const go = (to: number) => {
    primeAudioFromGesture();
    setFailed(false);
    setPaused(true);
    setClipIdx(0);
    setIdx(to);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go((idx - 1 + LETTERS.length) % LETTERS.length);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go((idx + 1) % LETTERS.length);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, onClose]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    stopSpeech();
    v.src = src;
    v.muted = !selfVoice;
    if (selfVoice) v.volume = 1;
    const tryPlay = () => {
      void v.play().catch(() => {
        /* autoplay may wait for tap — keep the player visible */
      });
    };
    v.addEventListener("canplay", tryPlay, { once: true });
    tryPlay();
    if (!selfVoice) {
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
  }, [src, title, selfVoice]);

  return (
    <div
      className="modal-scrim fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Meet ${title}`}
    >
      <div
        className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-surface shadow-[var(--shadow-float)] sm:h-auto sm:max-h-[min(94dvh,880px)] sm:rounded-[var(--radius-xl)] sm:border-2 sm:border-border"
        style={{
          background: `linear-gradient(180deg, ${current.hue}33 0%, var(--color-surface) 46%)`,
        }}
      >
        <div className="flex items-center justify-between gap-2 p-3">
          <p className="px-2 text-sm font-bold tracking-wide text-muted">
            Meet {title}
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
              !failed && "opacity-0",
            )}
          />
          {!failed && (
            <video
              key={src}
              ref={videoRef}
              playsInline
              muted={!selfVoice}
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
                setClipIdx((i) => (i + 1) % playlist.length);
              }}
            />
          )}
          {paused && !failed && (
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
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go((idx - 1 + LETTERS.length) % LETTERS.length);
            }}
            className="absolute left-2 top-1/2 z-[5] flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-on-light shadow-lg"
            aria-label={`Previous, meet ${prevGlyph}`}
          >
            <ChevronLeft className="size-7" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              go((idx + 1) % LETTERS.length);
            }}
            className="absolute right-2 top-1/2 z-[5] flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-on-light shadow-lg"
            aria-label={`Next, meet ${nextGlyph}`}
          >
            <ChevronRight className="size-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
