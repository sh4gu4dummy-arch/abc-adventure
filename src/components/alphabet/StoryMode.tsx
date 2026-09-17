import { useCallback, useImperativeHandle, useMemo, useRef, useState, forwardRef } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Play, Volume2 } from "lucide-react";
import type { LetterEntry } from "@/data/alphabet";
import { getStoryBeats } from "@/data/stories";
import { storyBeatVideo } from "@/data/story-videos";
import { assetUrl } from "@/lib/assets";
import { LetterWord } from "./LetterWord";
import { StoryStage } from "./StoryStage";
import { markSection } from "@/lib/progress";
import { speak } from "@/lib/speak";
import { APP_VERSION } from "@/lib/version";
import { cn } from "@/lib/utils";

type StoryClipHandle = { play: () => void };

const StoryClip = forwardRef<
  StoryClipHandle,
  { video: string; poster: string; accent: string }
>(function StoryClip({ video, poster, accent }, handle) {
  const ref = useRef<HTMLVideoElement>(null);
  const [live, setLive] = useState(false);
  const posterSrc = `${assetUrl(poster)}?v=${APP_VERSION}`;
  const videoSrc = `${assetUrl(video)}?v=${APP_VERSION}`;

  const play = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    v.loop = true;
    if (v.getAttribute("src") !== videoSrc) v.src = videoSrc;
    try {
      v.currentTime = 0;
    } catch {
      /* ignore */
    }
    void v
      .play()
      .then(() => setLive(true))
      .catch(() => setLive(false));
  }, [videoSrc]);

  useImperativeHandle(handle, () => ({ play }), [play]);

  return (
    <div className="story-stage relative overflow-hidden rounded-[var(--radius-lg)] border-2 border-border bg-ink shadow-[var(--shadow-card)]">
      <img
        src={posterSrc}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity",
          live && "opacity-0",
        )}
        draggable={false}
      />
      <video
        ref={ref}
        src={videoSrc}
        poster={posterSrc}
        className="absolute inset-0 z-[1] h-full w-full object-cover"
        muted
        playsInline
        loop
        preload="auto"
        onPlaying={() => setLive(true)}
        onError={() => setLive(false)}
      />
      {!live && (
        <button
          type="button"
          onClick={play}
          className="absolute inset-0 z-20 flex items-center justify-center bg-ink/20"
          aria-label="Play scene"
        >
          <span
            className="flex size-16 items-center justify-center rounded-full text-white shadow-lg"
            style={{ background: accent }}
          >
            <Play className="size-8 fill-white" />
          </span>
        </button>
      )}
      <span
        className="pointer-events-none absolute left-3 top-3 z-10 rounded-[var(--radius-pill)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-sm"
        style={{ background: accent }}
      >
        Scene
      </span>
    </div>
  );
});

export function StoryMode({ entry }: { entry: LetterEntry }) {
  const beats = useMemo(() => getStoryBeats(entry), [entry]);
  const [beatIdx, setBeatIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [playToken, setPlayToken] = useState(0);
  const clipRef = useRef<StoryClipHandle>(null);

  const beat = beats[beatIdx] ?? beats[0]!;
  const clip = storyBeatVideo(entry.letter, beatIdx);
  const stageKey = `${entry.letter}-${beatIdx}-${playToken}`;

  function kickClip() {
    clipRef.current?.play();
  }

  async function playAll() {
    if (playing) return;
    kickClip();
    setPlaying(true);
    setFinished(false);
    markSection(entry.letter, "story");
    for (let i = 0; i < beats.length; i++) {
      setBeatIdx(i);
      setPlayToken((t) => t + 1);
      await speak(beats[i]!.text);
      await wait(320);
    }
    setFinished(true);
    setPlaying(false);
    void speak("The end! Great listening!");
  }

  async function playBeat(i: number) {
    if (playing) return;
    setBeatIdx(i);
    setPlayToken((t) => t + 1);
    kickClip();
    setPlaying(true);
    await speak(beats[i]!.text);
    setPlaying(false);
    if (i === beats.length - 1) {
      markSection(entry.letter, "story");
      setFinished(true);
    }
  }

  function go(delta: number) {
    if (playing) return;
    setBeatIdx((i) => {
      const next = Math.max(0, Math.min(beats.length - 1, i + delta));
      setPlayToken((t) => t + 1);
      return next;
    });
    setFinished(false);
    kickClip();
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="inline-flex items-center gap-1.5 font-display text-xl font-bold text-ink sm:text-2xl">
          <BookOpen className="size-5" /> {entry.letter} story theater
        </p>
        <p className="mt-1 text-sm font-medium text-muted">
          Watch the words act out each moment — tap a scene or press play
        </p>
      </div>

      {/* Live stage — real clip when we have one, else bouncing thumbs */}
      {clip ? (
        <StoryClip
          ref={clipRef}
          video={clip.video}
          poster={clip.poster}
          accent={entry.accent}
        />
      ) : (
        <StoryStage
          letter={entry.letter}
          accent={entry.accent}
          action={beat.action}
          scene={beat.scene}
          words={beat.words}
          stageKey={stageKey}
        />
      )}

      {/* Scene script */}
      <div
        className="rounded-[var(--radius-lg)] border-2 border-border bg-surface p-4 shadow-sm"
        style={{ borderColor: `${entry.accent}55` }}
      >
        <p className="font-display text-lg font-bold leading-snug text-ink sm:text-xl">
          {highlightWords(beat.text, beat.words, entry.accent)}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {beat.words.map((w) => (
            <span
              key={w.slug}
              className="inline-flex items-center rounded-[var(--radius-pill)] border border-border bg-surface-soft px-2.5 py-1"
            >
              <LetterWord word={w.word} letter={entry.letter} accent={entry.accent} size="sm" />
            </span>
          ))}
        </div>
      </div>

      {/* Beat picker */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={playing || beatIdx === 0}
          className="pressable inline-flex size-11 items-center justify-center rounded-full border-2 border-border bg-surface disabled:opacity-40"
          aria-label="Previous scene"
        >
          <ChevronLeft className="size-5" />
        </button>

        <div className="flex gap-1.5">
          {beats.map((b, i) => (
            <button
              key={i}
              type="button"
              onClick={() => void playBeat(i)}
              disabled={playing}
              className={cn(
                "pressable h-3 rounded-full transition-all",
                i === beatIdx ? "w-8" : "w-3 bg-border",
              )}
              style={i === beatIdx ? { background: entry.accent } : undefined}
              aria-label={`Scene ${i + 1}: ${b.text.slice(0, 40)}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          disabled={playing || beatIdx >= beats.length - 1}
          className="pressable inline-flex size-11 items-center justify-center rounded-full border-2 border-border bg-surface disabled:opacity-40"
          aria-label="Next scene"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Scene list (compact) */}
      <div className="space-y-1.5">
        {beats.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => void playBeat(i)}
            disabled={playing}
            className="pressable w-full rounded-xl border-2 px-3 py-2.5 text-left transition-colors disabled:opacity-60"
            style={{
              borderColor: i === beatIdx ? entry.accent : "var(--color-border)",
              background: i === beatIdx ? `${entry.hue}33` : "var(--color-surface)",
            }}
          >
            <span className="mr-2 inline-flex size-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: entry.accent }}
            >
              {i + 1}
            </span>
            <span className="font-display text-sm font-bold text-ink sm:text-base">
              {b.text}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => void playAll()}
          disabled={playing}
          className="pressable inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-pill)] px-5 py-3 font-bold text-white disabled:opacity-70"
          style={{ background: entry.accent }}
        >
          <Volume2 className="size-5" />
          {playing ? "Playing…" : "Play full story"}
        </button>
      </div>

      {finished && (
        <p className="text-center font-display text-lg font-bold text-success">
          Story complete — the words put on a show!
        </p>
      )}
    </div>
  );
}

function highlightWords(
  text: string,
  words: { word: string }[],
  accent: string,
) {
  // Build a case-insensitive highlighter for cast words
  const sorted = [...words].sort((a, b) => b.word.length - a.word.length);
  if (!sorted.length) return text;

  const pattern = new RegExp(
    `(${sorted.map((w) => escapeReg(w.word)).join("|")})`,
    "gi",
  );
  const parts = text.split(pattern);
  return parts.map((part, i) => {
    const hit = sorted.some((w) => w.word.toLowerCase() === part.toLowerCase());
    if (hit) {
      return (
        <span
          key={i}
          className="rounded-md px-0.5 font-extrabold underline decoration-[0.12em] underline-offset-2"
          style={{ color: accent }}
        >
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
