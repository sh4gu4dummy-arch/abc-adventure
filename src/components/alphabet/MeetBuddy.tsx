import { useEffect, useRef, useState } from "react";
import { Play, X } from "lucide-react";
import {
  letterBuddyVideoPath,
  letterHeroPath,
  type LetterEntry,
} from "@/data/alphabet";
import { speak, stopSpeech, primeAudioFromGesture } from "@/lib/speak";
import { APP_VERSION } from "@/lib/version";
import { cn } from "@/lib/utils";

/** Meet A–R: cartoon letter voice is in the clip. No teacher overlay. */
const MEET_SELF_VOICE = new Set("ABCDEFGHIJKLMNOPQR".split(""));

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
  return (
    <button
      type="button"
      onClick={() => {
        primeAudioFromGesture();
        onOpen();
      }}
      className="pressable inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-pill)] bg-white/95 px-4 py-2.5 text-sm font-bold shadow"
      style={{ color: entry.accent }}
    >
      <Play className="size-4 fill-current" /> Meet {entry.letter}
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);
  const [failed, setFailed] = useState(false);
  const poster = letterHeroPath(entry.letter);
  const src = `${letterBuddyVideoPath(entry.letter)}?v=${APP_VERSION}`;
  const selfVoice = MEET_SELF_VOICE.has(entry.letter.toUpperCase());

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
      void speak(`The letter ${entry.letter}`);
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
  }, [src, entry.letter, selfVoice]);

  return (
    <div
      className="modal-scrim fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Meet letter ${entry.letter}`}
    >
      <div
        className="relative flex h-full w-full max-w-md flex-col overflow-hidden bg-surface shadow-[var(--shadow-float)] sm:h-auto sm:max-h-[min(94dvh,880px)] sm:rounded-[var(--radius-xl)] sm:border-2 sm:border-border"
        style={{
          background: `linear-gradient(180deg, ${entry.hue}33 0%, var(--color-surface) 46%)`,
        }}
      >
        <div className="flex items-center justify-between gap-2 p-3">
          <p className="px-2 text-sm font-bold uppercase tracking-wide text-muted">
            Meet {entry.letter}
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
            background: `linear-gradient(160deg, ${entry.hue}55, ${entry.hue}18)`,
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
                if (!selfVoice) void speak(entry.rhyme);
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
        </div>

        <p className="px-5 py-4 text-center text-sm font-semibold text-ink-soft">
          {entry.soundCue}
        </p>
      </div>
    </div>
  );
}
