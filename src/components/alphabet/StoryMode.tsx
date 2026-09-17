import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Play, RotateCcw, Volume2 } from "lucide-react";
import type { LetterEntry } from "@/data/alphabet";
import { getStoryBeats } from "@/data/stories";
import { storyBeatVideo, type StoryClipSrc } from "@/data/story-videos";
import { assetUrl } from "@/lib/assets";
import { LetterWord } from "./LetterWord";
import { StoryStage } from "./StoryStage";
import { markSection } from "@/lib/progress";
import { getLessonSound, useLessonSound } from "@/lib/lesson-sound";
import { speak, primeAudioFromGesture, stopSpeech } from "@/lib/speak";
import { APP_VERSION } from "@/lib/version";
import { walkStoryHighlights } from "@/lib/story-highlight";
import { cn } from "@/lib/utils";
import { LessonSoundToggle } from "./LessonSoundToggle";

type StoryReelHandle = { start: (from?: number) => void };

/** One video element. Files stay split on disk; playback chains 1→2→3. */
const StoryReel = forwardRef<
  StoryReelHandle,
  {
    clips: StoryClipSrc[];
    lines: string[];
    accent: string;
    beatIdx: number;
    clipSound: boolean;
    onBeat: (i: number) => void;
    onRunning: (on: boolean) => void;
    onFinished: () => void;
  }
>(function StoryReel(
  { clips, lines, accent, beatIdx, clipSound, onBeat, onRunning, onFinished },
  handle,
) {
  const ref = useRef<HTMLVideoElement>(null);
  const idxRef = useRef(beatIdx);
  const runRef = useRef(false);
  const [live, setLive] = useState(false);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    idxRef.current = beatIdx;
  }, [beatIdx]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = !clipSound;
    v.volume = clipSound ? 0.7 : 0;
  }, [clipSound]);

  const srcAt = useCallback(
    (i: number) => `${assetUrl(clips[i]!.video)}?v=${APP_VERSION}`,
    [clips],
  );
  const posterAt = useCallback(
    (i: number) => `${assetUrl(clips[i]!.poster)}?v=${APP_VERSION}`,
    [clips],
  );

  const applySound = useCallback(() => {
    const v = ref.current;
    if (!v) return;
    const clip = getLessonSound() === "clip";
    v.muted = !clip;
    v.volume = clip ? 0.7 : 0;
  }, []);

  const speakLine = useCallback((i: number) => {
    if (getLessonSound() === "clip") {
      stopSpeech();
      return;
    }
    const line = lines[i];
    if (!line) return;
    stopSpeech();
    void speak(line);
  }, [lines]);

  const playIndex = useCallback(
    (i: number) => {
      const v = ref.current;
      const clip = clips[i];
      if (!v || !clip) return;
      applySound();
      v.playsInline = true;
      v.loop = false;
      v.src = srcAt(i);
      try {
        v.currentTime = 0;
      } catch {
        /* ignore */
      }
      setEnded(false);
      void v
        .play()
        .then(() => setLive(true))
        .catch(() => setLive(false));
      speakLine(i);
    },
    [applySound, clips, speakLine, srcAt],
  );

  const start = useCallback(
    (from = 0) => {
      const i = Math.max(0, Math.min(clips.length - 1, from));
      const clip = getLessonSound() === "clip";
      if (clip) stopSpeech();
      else primeAudioFromGesture(lines[i]);
      runRef.current = true;
      idxRef.current = i;
      onBeat(i);
      onRunning(true);
      setEnded(false);
      playIndex(i);
    },
    [clips.length, lines, onBeat, onRunning, playIndex],
  );

  useImperativeHandle(handle, () => ({ start }), [start]);

  function onClipEnded() {
    if (!runRef.current) {
      setEnded(true);
      setLive(false);
      return;
    }
    const next = idxRef.current + 1;
    if (next < clips.length) {
      idxRef.current = next;
      onBeat(next);
      playIndex(next);
      return;
    }
    runRef.current = false;
    setEnded(true);
    setLive(false);
    onRunning(false);
    onFinished();
  }

  const idle = !live || ended;
  const posterSrc = posterAt(beatIdx);
  const nextClip = clips[beatIdx + 1];

  return (
    <div className="story-stage relative overflow-hidden rounded-[var(--radius-lg)] border-2 border-border bg-ink shadow-[var(--shadow-card)]">
      <img
        src={posterSrc}
        alt=""
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition-opacity",
          live && !ended && "opacity-0",
        )}
        draggable={false}
      />
      <video
        ref={ref}
        src={srcAt(beatIdx)}
        poster={posterSrc}
        className="absolute inset-0 z-[1] h-full w-full object-cover"
        playsInline
        loop={false}
        preload="auto"
        onPlaying={() => {
          setLive(true);
          setEnded(false);
        }}
        onEnded={onClipEnded}
        onError={() => setLive(false)}
      />
      {nextClip && (
        <video
          className="pointer-events-none invisible absolute h-0 w-0"
          src={srcAt(beatIdx + 1)}
          preload="auto"
          muted
          playsInline
          aria-hidden
        />
      )}
      {idle && (
        <button
          type="button"
          onClick={() => start(ended && beatIdx >= clips.length - 1 ? 0 : beatIdx)}
          className="absolute inset-0 z-20 flex items-center justify-center bg-ink/20"
          aria-label={ended ? "Play story again" : "Play story"}
        >
          <span
            className="flex size-16 items-center justify-center rounded-full text-white shadow-lg"
            style={{ background: accent }}
          >
            {ended ? <RotateCcw className="size-8" /> : <Play className="size-8 fill-white" />}
          </span>
        </button>
      )}
      <span
        className="pointer-events-none absolute left-3 top-3 z-10 rounded-[var(--radius-pill)] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-sm"
        style={{ background: accent }}
      >
        {beatIdx + 1}/{clips.length}
      </span>
    </div>
  );
});

export function StoryMode({ entry }: { entry: LetterEntry }) {
  const beats = useMemo(() => getStoryBeats(entry), [entry]);
  const clips = useMemo(() => {
    const out: StoryClipSrc[] = [];
    for (let i = 0; i < beats.length; i++) {
      const c = storyBeatVideo(entry.letter, i);
      if (c) out.push(c);
    }
    return out;
  }, [beats.length, entry.letter]);
  const lines = useMemo(() => beats.map((b) => b.text), [beats]);

  const [beatIdx, setBeatIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [playToken, setPlayToken] = useState(0);
  const reelRef = useRef<StoryReelHandle>(null);

  useEffect(() => {
    setBeatIdx(0);
    setPlaying(false);
    setFinished(false);
    setPlayToken((t) => t + 1);
    stopSpeech();
  }, [entry.letter]);

  const { mode: soundMode } = useLessonSound();
  const clipSound = soundMode === "clip";
  const beat = beats[beatIdx] ?? beats[0]!;
  const stageKey = `${entry.letter}-${beatIdx}-${playToken}`;
  const hasClips = clips.length > 0;

  function startStory(from = 0) {
    markSection(entry.letter, "story");
    setFinished(false);
    if (hasClips) {
      reelRef.current?.start(from);
      return;
    }
    void playBeatsFallback(from);
  }

  async function playBeatsFallback(from: number) {
    if (playing) return;
    primeAudioFromGesture(beats[from]?.text);
    setPlaying(true);
    setFinished(false);
    markSection(entry.letter, "story");
    for (let i = from; i < beats.length; i++) {
      setBeatIdx(i);
      setPlayToken((t) => t + 1);
      await speak(beats[i]!.text);
      await new Promise((r) => setTimeout(r, 280));
    }
    setFinished(true);
    setPlaying(false);
  }

  function go(delta: number) {
    if (playing) return;
    setBeatIdx((i) => Math.max(0, Math.min(beats.length - 1, i + delta)));
    setFinished(false);
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="inline-flex items-center gap-1.5 font-display text-xl font-bold text-ink sm:text-2xl">
          <BookOpen className="size-5" /> {entry.letter} story theater
        </p>
        <p className="mt-1 text-sm font-medium text-muted">
          Press play — the three scenes play as one story
        </p>
        {hasClips && (
          <div className="mt-3 flex justify-center">
            <LessonSoundToggle
              compact
              onMode={(mode) => {
                if (mode !== "narration") return;
                primeAudioFromGesture(beat.text);
                void speak(beat.text);
              }}
            />
          </div>
        )}
      </div>

      {hasClips ? (
        <StoryReel
          key={entry.letter}
          ref={reelRef}
          clips={clips}
          lines={lines}
          accent={entry.accent}
          beatIdx={beatIdx}
          clipSound={clipSound}
          onBeat={setBeatIdx}
          onRunning={setPlaying}
          onFinished={() => {
            setPlaying(false);
            setFinished(true);
            markSection(entry.letter, "story");
          }}
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

      <div
        className="rounded-[var(--radius-lg)] border-2 border-border bg-surface p-4 shadow-sm"
        style={{ borderColor: `${entry.accent}55` }}
      >
        <p className="font-display text-lg font-bold leading-snug text-ink sm:text-xl">
          {highlightWords(
            beat.text,
            beat.words,
            entry.accent,
            entry.animal,
            entry.letter,
          )}
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
              onClick={() => {
                if (playing) return;
                setBeatIdx(i);
                setFinished(false);
              }}
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

      <div className="space-y-1.5">
        {beats.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              if (playing) return;
              startStory(i);
            }}
            disabled={playing}
            className="pressable w-full rounded-xl border-2 px-3 py-2.5 text-left transition-colors disabled:opacity-60"
            style={{
              borderColor: i === beatIdx ? entry.accent : "var(--color-border)",
              background: i === beatIdx ? `${entry.hue}33` : "var(--color-surface)",
            }}
          >
            <span
              className="mr-2 inline-flex size-6 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: entry.accent }}
            >
              {i + 1}
            </span>
            <span className="font-display text-sm font-bold text-ink sm:text-base" data-case-lock>
              {highlightWords(
                b.text,
                b.words,
                entry.accent,
                entry.animal,
                entry.letter,
              )}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => startStory(0)}
          disabled={playing}
          className="pressable inline-flex min-h-12 items-center gap-2 rounded-[var(--radius-pill)] px-5 py-3 font-bold text-white disabled:opacity-70"
          style={{ background: entry.accent }}
        >
          <Volume2 className="size-5" />
          {playing ? "Playing…" : "Play story"}
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
  extra?: string,
  letter?: string,
) {
  const listed = [...words.map((w) => w.word), extra].filter(
    (w): w is string => Boolean(w && w.trim()),
  );
  return walkStoryHighlights(text, letter ?? "", listed).map((part, i) => {
    if (!part.hit) return <span key={i}>{part.text}</span>;
    return (
      <span
        key={i}
        className="rounded-md px-0.5 font-extrabold underline decoration-[0.12em] underline-offset-2"
        style={{ color: accent }}
      >
        {part.text}
      </span>
    );
  });
}
