import { useEffect, useRef, useState } from "react";
import { Check, Play, X, Volume2 } from "lucide-react";
import type { WordEntry } from "@/data/alphabet";
import type { WordLesson } from "@/data/word-lessons";
import { LetterWord } from "./LetterWord";
import { VoiceToggle } from "./VoiceToggle";
import { assetUrl } from "@/lib/assets";
import { speak, stopSpeech } from "@/lib/speak";
import { markWordSeen } from "@/lib/progress";
import { getGfxSnapshot, shouldPlayLessonVideo } from "@/lib/gfx-pref";
import { cn } from "@/lib/utils";

type Phase = "ready" | "playing" | "done";
type Caption = "none" | "word" | "sentence";

function playSfx(path: string | undefined, volume = 0.35): HTMLAudioElement | null {
  if (!path || typeof window === "undefined") return null;
  try {
    const a = new Audio(assetUrl(path));
    a.volume = volume;
    void a.play().catch(() => {});
    return a;
  } catch {
    return null;
  }
}

/** Freeze on the last painted frame — never snap back to t=0. */
function holdLastFrame(video: HTMLVideoElement | null) {
  if (!video) return;
  try {
    video.pause();
    const d = video.duration;
    if (d && Number.isFinite(d) && d > 0.05) {
      video.currentTime = Math.max(0, d - 0.08);
    }
  } catch {
    /* ignore */
  }
}

/**
 * Fullscreen word lesson:
 * - High: story MP4 + soft music (src attached only on play)
 * - Lite: sharp poster cinema (no video decode — better look, far less GPU)
 */
export function WordLessonModal({
  letter,
  accent,
  hue,
  word,
  imageSrc,
  lesson,
  alreadySeen,
  onClose,
  onUnlocked,
}: {
  letter: string;
  accent: string;
  hue: string;
  word: WordEntry;
  imageSrc: string;
  lesson: WordLesson;
  alreadySeen: boolean;
  onClose: () => void;
  onUnlocked?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [phase, setPhase] = useState<Phase>(alreadySeen ? "done" : "ready");
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState<Caption>("none");
  const [showVideo, setShowVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const finishing = useRef(false);
  const skipRef = useRef(false);
  const wantVideo = shouldPlayLessonVideo() && !videoFailed;
  const lite = getGfxSnapshot().resolved === "lite";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    return () => {
      stopSpeech();
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.removeAttribute("src");
        try {
          v.load();
        } catch {
          /* ignore */
        }
      }
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current = null;
      }
    };
  }, []);

  async function finishLesson() {
    if (finishing.current) return;
    finishing.current = true;
    skipRef.current = true;
    holdLastFrame(videoRef.current);
    markWordSeen(letter, word.slug);
    setPhase("done");
    setProgress(1);
    setCaption("sentence");
    if (musicRef.current) {
      const m = musicRef.current;
      const step = () => {
        if (!m) return;
        m.volume = Math.max(0, m.volume - 0.05);
        if (m.volume > 0.02) requestAnimationFrame(step);
        else {
          m.pause();
          musicRef.current = null;
        }
      };
      requestAnimationFrame(step);
    }
    playSfx(lesson.sfxSuccess, 0.4);
    onUnlocked?.();
    void speak("Great job!");
  }

  async function playLesson() {
    if (phase === "playing") return;
    setPhase("playing");
    setProgress(0);
    setCaption("none");
    setShowVideo(false);
    finishing.current = false;
    skipRef.current = false;

    playSfx(lesson.sfxPop, 0.3);

    if (lesson.music && !lite) {
      try {
        const m = new Audio(assetUrl(lesson.music));
        m.loop = true;
        m.volume = 0.18;
        musicRef.current = m;
        void m.play().catch(() => {});
      } catch {
        /* optional */
      }
    }

    // Attach video src only when High and playing — never preload 156 clips
    if (wantVideo) {
      const video = videoRef.current;
      if (video) {
        try {
          const src = assetUrl(lesson.video);
          if (video.getAttribute("src") !== src) {
            video.src = src;
          }
          video.muted = true;
          video.loop = true;
          try {
            video.currentTime = 0;
          } catch {
            /* not seekable yet */
          }
          await video.play();
          setShowVideo(true);
        } catch {
          setVideoFailed(true);
          setShowVideo(false);
        }
      }
    }

    const start = Date.now();
    const estMs = Math.max((lesson.durationSec ?? 6) * 1000, 6500);
    const tick = window.setInterval(() => {
      const v = videoRef.current;
      if (v && v.duration && Number.isFinite(v.duration) && v.duration > 0) {
        setProgress(Math.min(0.97, v.currentTime / v.duration));
      } else {
        setProgress(Math.min(0.97, (Date.now() - start) / estMs));
      }
    }, lite ? 160 : 100);

    try {
      setCaption("word");
      playSfx(lesson.sfxSparkle, 0.28);

      for (let i = 0; i < 3; i++) {
        if (skipRef.current) return;
        await speak(lesson.word);
        if (skipRef.current) return;
        await new Promise((r) => setTimeout(r, 180));
      }

      if (skipRef.current) return;
      setCaption("sentence");
      playSfx(lesson.sfxSparkle, 0.22);
      await speak(lesson.sentence);
      if (skipRef.current) return;
    } finally {
      window.clearInterval(tick);
    }

    if (skipRef.current) return;
    holdLastFrame(videoRef.current);
    await finishLesson();
  }

  function fractionFromEvent(el: HTMLElement, clientX: number) {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }

  function applySeek(frac: number) {
    if (phase !== "playing" || finishing.current) return;
    const v = videoRef.current;
    if (v && v.duration && Number.isFinite(v.duration) && v.duration > 0) {
      v.currentTime = frac * v.duration;
      setProgress(frac);
      if (frac < 0.45) setCaption("word");
      else setCaption("sentence");
      if (frac >= 0.92) {
        stopSpeech();
        void finishLesson();
      }
      return;
    }
    setProgress(frac);
    if (frac >= 0.92) {
      stopSpeech();
      void finishLesson();
    }
  }

  function closeNow() {
    skipRef.current = true;
    stopSpeech();
    const v = videoRef.current;
    if (v) {
      try {
        v.pause();
      } catch {
        /* ignore */
      }
    }
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current = null;
    }
    onClose();
  }

  function skipAhead() {
    if (phase !== "playing" || finishing.current) return;
    const v = videoRef.current;
    if (v && v.duration && Number.isFinite(v.duration) && v.duration > 0) {
      const jump = Math.max(2, v.duration * 0.2);
      applySeek(Math.min(1, (v.currentTime + jump) / v.duration));
      return;
    }
    applySeek(Math.min(1, progress + 0.25));
  }

  return (
    <div
      className="modal-scrim fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${word.word} video lesson`}
    >
      <div
        className="relative flex h-full w-full max-w-lg flex-col overflow-hidden bg-surface shadow-[var(--shadow-float)] sm:h-auto sm:max-h-[min(94dvh,900px)] sm:rounded-[var(--radius-xl)] sm:border-2 sm:border-border"
        style={{ background: `linear-gradient(180deg, ${hue}33 0%, var(--color-surface) 42%)` }}
      >
        <div className="flex items-center justify-between gap-2 p-3">
          <VoiceToggle compact preview={phase !== "playing"} />
          <button
            type="button"
            onClick={closeNow}
            className="flex size-11 items-center justify-center rounded-full bg-surface text-ink shadow-md"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

                <div
          className="relative mx-3 aspect-[3/4] overflow-hidden rounded-[var(--radius-lg)] border-2 border-white/70 shadow-[var(--shadow-poster)] sm:mx-5"
          style={{
            background: `linear-gradient(160deg, ${hue}44, ${hue}11 55%, #1a1d2e)`,
          }}
        >
          {/* Poster always visible — same paint path as grid cards */}
          <img
            src={imageSrc}
            alt=""
            className={cn(
              "poster-art relative z-0 block h-full w-full object-cover",
              phase === "playing" && !showVideo && "lesson-cinema-motion",
              showVideo && "opacity-0",
            )}
            decoding="async"
            fetchPriority="high"
            draggable={false}
          />

          {wantVideo && (
            <video
              ref={videoRef}
              playsInline
              muted
              preload="none"
              poster={imageSrc}
              loop
              className={cn(
                "absolute inset-0 z-[1] h-full w-full object-cover",
                showVideo ? "opacity-100" : "opacity-0",
              )}
              onEnded={(e) => holdLastFrame(e.currentTarget)}
              onError={() => {
                setVideoFailed(true);
                setShowVideo(false);
              }}
              onPause={(e) => {
                const v = e.currentTarget;
                if (v.duration && v.currentTime >= v.duration - 0.15) {
                  holdLastFrame(v);
                }
              }}
            />
          )}

          {/* Soft edge only — no full-frame overlays that can blank bitmaps */}
          <div
            className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] shadow-[inset_0_0_0_1px_rgb(255_255_255/0.35)]"
            aria-hidden
          />

          <div
            className="absolute left-3 top-3 z-[3] flex size-12 items-center justify-center rounded-2xl font-display text-2xl font-bold text-white shadow-lg"
            style={{ background: accent }}
          >
            {letter.toUpperCase()}
          </div>

          {(phase === "playing" || phase === "done") && (
            <div className="pointer-events-none absolute inset-x-0 bottom-14 z-[3] flex justify-center px-4">
              {caption === "word" && (
                <div
                  className="rounded-[var(--radius-lg)] bg-white px-5 py-3 text-center shadow-lg"
                  style={{ border: `3px solid ${accent}` }}
                >
                  <p
                    className="font-display text-4xl font-black tracking-wide text-on-light sm:text-5xl"
                  >
                    {lesson.word.toUpperCase()}
                  </p>
                </div>
              )}
              {caption === "sentence" && (
                <div className="rounded-[var(--radius-lg)] bg-white px-5 py-3 text-center shadow-lg">
                  <p className="font-display text-xl font-bold text-on-light sm:text-2xl">
                    {lesson.sentence}
                  </p>
                </div>
              )}
            </div>
          )}

          {phase === "playing" && (
            <>
              <button
                type="button"
                className="absolute inset-0 z-[2] cursor-pointer bg-transparent"
                aria-label="Skip ahead"
                onClick={skipAhead}
              />
              <div
                className="absolute inset-x-0 bottom-0 z-[4] h-11 cursor-pointer touch-none px-2"
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
                  applySeek(fractionFromEvent(e.currentTarget, e.clientX));
                }}
              >
                <div className="absolute inset-x-3 bottom-3 h-2.5 overflow-hidden rounded-full bg-black/40">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${progress * 100}%`, background: accent }}
                  />
                </div>
                <div
                  className="pointer-events-none absolute bottom-[0.45rem] size-4 rounded-full border-2 border-white bg-white shadow"
                  style={{
                    left: `calc(${progress * 100}% * 0.92 + 0.75rem)`,
                    background: accent,
                  }}
                />
              </div>
            </>
          )}

          {phase === "ready" && (
            <button
              type="button"
              onClick={() => void playLesson()}
              className="pressable absolute inset-0 z-[3] flex flex-col items-center justify-center gap-3 bg-ink/20"
            >
              <span
                className="flex size-20 items-center justify-center rounded-full text-white shadow-lg"
                style={{ background: accent }}
              >
                <Play className="size-10 fill-white" />
              </span>
              <span className="rounded-[var(--radius-pill)] bg-white px-4 py-2 font-display text-lg font-bold text-on-light shadow">
                Tap to play story
              </span>
            </button>
          )}

          {phase === "done" && (
            <div className="pointer-events-none absolute inset-x-0 top-4 z-[3] flex justify-center">
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-success px-4 py-2 font-bold text-white shadow-md">
                <Check className="size-4" /> Word unlocked!
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3 p-4 sm:p-5">
          <LetterWord word={word.word} accent={accent} size="xl" />
          <p className="text-base font-semibold text-ink-soft">{lesson.sentence}</p>
          <p className="text-xs font-medium text-muted">
            {alreadySeen || phase === "done"
              ? lite
                ? "Replay anytime — sharp poster story."
                : "Replay anytime. Soft music + story video."
              : "Watch the little story all the way through to unlock this word."}
          </p>

          <div className="flex flex-wrap gap-2">
            {(alreadySeen || phase === "done") && (
              <button
                type="button"
                onClick={() => {
                  finishing.current = false;
                  void playLesson();
                }}
                className="pressable inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-4 font-bold text-ink"
              >
                <Play className="size-4" /> Replay
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (phase === "playing") return;
                onClose();
              }}
              disabled={phase === "playing"}
              className={cn(
                "pressable inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[var(--radius-pill)] px-4 font-bold text-white",
                phase === "playing" && "opacity-50",
              )}
              style={{ background: accent }}
            >
              <Volume2 className="size-4" />
              {phase === "playing" ? "Playing…" : "Done"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
