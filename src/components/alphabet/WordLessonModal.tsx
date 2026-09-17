import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Play, X, Volume2 } from "lucide-react";
import type { CaseKind, WordEntry } from "@/data/alphabet";
import type { WordLesson } from "@/data/word-lessons";
import { VoiceToggle } from "./VoiceToggle";
import { LessonSoundToggle } from "./LessonSoundToggle";
import { assetUrl } from "@/lib/assets";
import { speak, stopSpeech, primeAudioFromGesture } from "@/lib/speak";
import { markWordSeen } from "@/lib/progress";
import { getGfxSnapshot, shouldPlayLessonVideo } from "@/lib/gfx-pref";
import { useLessonSound } from "@/lib/lesson-sound";
import { APP_VERSION } from "@/lib/version";
import { cn } from "@/lib/utils";

type Phase = "ready" | "playing" | "done";
type Caption = "none" | "word" | "sentence";

/** Clip foley only in Video sound mode. Narration = overlay voice, clip muted. */
const MUSIC_VOLUME = 0.18;

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

function clipHasAudio(video: HTMLVideoElement): boolean | null {
  const v = video as HTMLVideoElement & {
    mozHasAudio?: boolean;
    webkitAudioDecodedByteCount?: number;
    audioTracks?: { length: number };
  };
  if (typeof v.mozHasAudio === "boolean") return v.mozHasAudio;
  if (v.audioTracks && typeof v.audioTracks.length === "number") {
    return v.audioTracks.length > 0;
  }
  if (typeof v.webkitAudioDecodedByteCount === "number" && v.webkitAudioDecodedByteCount > 0) {
    return true;
  }
  return null;
}

function applyClipAudio(video: HTMLVideoElement | null, clipSound: boolean) {
  if (!video) return;
  if (clipSound) {
    video.muted = false;
    video.volume = 1;
  } else {
    video.muted = true;
    video.volume = 0;
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
 * - High: story MP4 + native clip sound (or soft bed if the file is silent)
 * - Overlay narration OR the clip's own sound — never both at once
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
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  caseKind = "upper",
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
  onPrev?: () => void;
  onNext?: () => void;
  prevLabel?: string;
  nextLabel?: string;
  caseKind?: CaseKind;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [phase, setPhase] = useState<Phase>("ready");
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState<Caption>("none");
  const [showVideo, setShowVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const finishing = useRef(false);
  const skipRef = useRef(false);
  const speechAbort = useRef(false);
  const cancelledRef = useRef(false);
  const playRun = useRef(0);
  const [seekReady, setSeekReady] = useState(false);
  const wantVideo = shouldPlayLessonVideo() && !videoFailed;
  const lite = getGfxSnapshot().resolved === "lite";
  const { mode: soundMode } = useLessonSound();
  const clipSound = soundMode === "clip";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    const t = window.setTimeout(() => setSeekReady(true), 450);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      skipRef.current = true;
      finishing.current = true;
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

  useEffect(() => {
    void playLesson();
    // Open + prev/next remount (key=slug) should start the clip without a second tap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    void playLesson();
    // Restart when they flip Narration / Video sound mid-clip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundMode]);

  function fadeOutMusic() {
    const m = musicRef.current;
    if (!m) return;
    const step = () => {
      if (!musicRef.current) return;
      m.volume = Math.max(0, m.volume - 0.05);
      if (m.volume > 0.02) requestAnimationFrame(step);
      else {
        m.pause();
        musicRef.current = null;
      }
    };
    requestAnimationFrame(step);
  }

  function startBedMusic() {
    if (lite || clipSound || !lesson.music || musicRef.current || lesson.nativeAudio) return;
    try {
      const m = new Audio(assetUrl(lesson.music));
      m.loop = true;
      m.volume = MUSIC_VOLUME;
      musicRef.current = m;
      void m.play().catch(() => {});
    } catch {
      /* optional */
    }
  }

  function dropBedIfClipHasSound(video: HTMLVideoElement | null) {
    if (!video || !musicRef.current) return;
    if (lesson.nativeAudio || clipHasAudio(video) === true) fadeOutMusic();
  }

  async function finishLesson() {
    if (cancelledRef.current || finishing.current) return;
    finishing.current = true;
    skipRef.current = true;
    if (lesson.loopVideo !== true) holdLastFrame(videoRef.current);
    markWordSeen(letter, word.slug);
    setPhase("done");
    setProgress(1);
    setCaption("sentence");
    fadeOutMusic();
    playSfx(lesson.sfxSuccess, 0.4);
    onUnlocked?.();
    if (cancelledRef.current) return;
    if (!clipSound) void speak("Great job!");
  }

  async function playLesson() {
    playRun.current += 1;
    const run = playRun.current;
    setPhase("playing");
    setProgress(0);
    setCaption("word");
    setShowVideo(false);
    finishing.current = false;
    skipRef.current = false;
    speechAbort.current = false;
    cancelledRef.current = false;

    playSfx(lesson.sfxPop, 0.3);

    if (clipSound) fadeOutMusic();
    if (!lesson.nativeAudio && !clipSound) startBedMusic();

    // Kick off video in the background. Never await it before the 3-word
    // intro — first-open buffering delayed speech so autoplay skipped the
    // words, while Replay (already buffered) still said them.
    if (wantVideo) {
      const video = videoRef.current;
      if (video) {
        try {
          const src = `${assetUrl(lesson.video)}?v=${APP_VERSION}`;
          if (video.getAttribute("src") !== src) {
            video.src = src;
          }
          // Start muted so autoplay is allowed, then unmute clip foley.
          video.muted = true;
          applyClipAudio(video, clipSound);
          video.loop = lesson.loopVideo === true;
          try {
            video.currentTime = 0;
          } catch {
            /* not seekable yet */
          }
          const onMeta = () => dropBedIfClipHasSound(video);
          video.addEventListener("loadedmetadata", onMeta, { once: true });
          void video
            .play()
            .then(() => {
              if (cancelledRef.current || finishing.current) return;
              applyClipAudio(video, clipSound);
              dropBedIfClipHasSound(video);
              setShowVideo(true);
            })
            .catch(() => {
              setVideoFailed(true);
              setShowVideo(false);
            });
        } catch {
          setVideoFailed(true);
          setShowVideo(false);
        }
      }
    }

    const start = Date.now();
    const clipMs = (lesson.durationSec ?? 10) * 1000;
    const estMs = clipSound ? clipMs : Math.max(clipMs, 9000);
    const tick = window.setInterval(() => {
      if (cancelledRef.current || finishing.current) return;
      const v = videoRef.current;
      if (v && v.duration && Number.isFinite(v.duration) && v.duration > 0) {
        setProgress(Math.min(0.97, v.currentTime / v.duration));
      } else {
        setProgress(Math.min(0.97, (Date.now() - start) / estMs));
      }
    }, lite ? 160 : 100);

    const stopTick = () => window.clearInterval(tick);

    const dead = () =>
      cancelledRef.current || finishing.current || playRun.current !== run;

    try {
      setCaption("word");
      if (!clipSound) playSfx(lesson.sfxSparkle, 0.28);

      if (clipSound) {
        await new Promise((r) => setTimeout(r, 900));
        if (dead() || skipRef.current) {
          stopTick();
          return;
        }
        if (!speechAbort.current) setCaption("sentence");
      } else {
        for (let i = 0; i < 3; i++) {
          if (dead() || skipRef.current) {
            stopTick();
            return;
          }
          if (speechAbort.current) break;
          await speak(lesson.sayWord ?? lesson.word);
          if (dead() || skipRef.current) {
            stopTick();
            return;
          }
          if (speechAbort.current) break;
          await new Promise((r) => setTimeout(r, 180));
        }

        if (dead() || skipRef.current) {
          stopTick();
          return;
        }
        if (!speechAbort.current) {
          setCaption("sentence");
          playSfx(lesson.sfxSparkle, 0.22);
          await speak(lesson.saySentence ?? lesson.sentence);
        }
        if (dead() || skipRef.current) {
          stopTick();
          return;
        }
      }

      // Follow the video clock so a seek doesn't leave leftover TTS waiting.
      await new Promise<void>((resolve) => {
        let lastT = videoRef.current?.currentTime ?? 0;
        const iv = window.setInterval(() => {
          if (dead() || skipRef.current) {
            window.clearInterval(iv);
            resolve();
            return;
          }
          const vid = videoRef.current;
          if (vid && vid.duration && Number.isFinite(vid.duration) && vid.duration > 0) {
            if (vid.currentTime + 0.4 < lastT) {
              window.clearInterval(iv);
              resolve();
              return;
            }
            lastT = vid.currentTime;
            if (vid.currentTime >= vid.duration - 0.12) {
              window.clearInterval(iv);
              resolve();
              return;
            }
            return;
          }
          if (Date.now() - start >= estMs) {
            window.clearInterval(iv);
            resolve();
          }
        }, 80);
      });
    } finally {
      stopTick();
    }

    if (cancelledRef.current || finishing.current) return;
    if (lesson.loopVideo !== true) holdLastFrame(videoRef.current);
    await finishLesson();
  }

  function fractionFromEvent(el: HTMLElement, clientX: number) {
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    return Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  }

  function applySeek(frac: number) {
    if (phase !== "playing" || finishing.current || cancelledRef.current) return;
    const v = videoRef.current;
    applyClipAudio(v, clipSound);
    dropBedIfClipHasSound(v);
    stopSpeech();
    speechAbort.current = true;
    if (v && v.duration && Number.isFinite(v.duration) && v.duration > 0) {
      v.currentTime = frac * v.duration;
      setProgress(frac);
      if (frac < 0.45) setCaption("word");
      else setCaption("sentence");
      if (lesson.loopVideo !== true && frac >= 0.92) {
        skipRef.current = true;
        void finishLesson();
      }
      return;
    }
    setProgress(frac);
  }

  function closeNow() {
    cancelledRef.current = true;
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
    applyClipAudio(videoRef.current, clipSound);
    dropBedIfClipHasSound(videoRef.current);
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
        <div className="flex shrink-0 items-center justify-between gap-2 p-3">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <VoiceToggle compact preview={phase !== "playing"} />
            <LessonSoundToggle compact />
          </div>
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
          className="relative mx-3 min-h-0 flex-1 overflow-hidden rounded-[var(--radius-lg)] border-2 border-white/70 shadow-[var(--shadow-poster)] sm:mx-5 sm:flex-none sm:aspect-[3/4]"
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
              preload="none"
              poster={imageSrc}
              loop={lesson.loopVideo === true}
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

          {onPrev && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                primeAudioFromGesture(prevLabel);
                onPrev();
              }}
              className="absolute left-2 top-1/2 z-[5] flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-on-light shadow-lg"
              aria-label={prevLabel ? `Previous, ${prevLabel}` : "Previous video"}
            >
              <ChevronLeft className="size-7" />
            </button>
          )}
          {onNext && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                primeAudioFromGesture(nextLabel);
                onNext();
              }}
              className="absolute right-2 top-1/2 z-[5] flex size-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-on-light shadow-lg"
              aria-label={nextLabel ? `Next, ${nextLabel}` : "Next video"}
            >
              <ChevronRight className="size-7" />
            </button>
          )}

          {phase === "playing" && seekReady && (
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

        <div className="mx-3 mt-3 min-h-16 sm:mx-5">
          {caption === "sentence" ? (
            <div className="rounded-[var(--radius-lg)] bg-white px-4 py-2.5 text-center shadow-md">
              <p className="font-display text-lg font-bold text-on-light sm:text-xl" data-case-lock>
                {lesson.sentence}
              </p>
            </div>
          ) : (
            <div
              className="rounded-[var(--radius-lg)] bg-white px-4 py-2.5 text-center shadow-md"
              style={{ border: `3px solid ${accent}` }}
            >
              <p className="font-display text-3xl font-black tracking-wide text-on-light sm:text-4xl">
                {caseKind === "upper" ? lesson.word.toUpperCase() : lesson.word.toLowerCase()}
              </p>
            </div>
          )}
        </div>

        <div className="shrink-0 space-y-3 p-4 sm:p-5">
          <p className="text-xs font-medium text-muted">
            {alreadySeen || phase === "done"
              ? lite
                ? "Replay anytime — sharp poster story."
                : clipSound
                  ? "Replay anytime. Video sound (no teacher voice)."
                  : "Replay anytime. Story sounds + teacher voice."
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
