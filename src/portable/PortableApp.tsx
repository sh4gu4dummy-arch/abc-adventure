import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  Gamepad2,
  Info,
  Pencil,
  Sparkles,
  Volume2,
} from "lucide-react";
import {
  getLetter,
  LETTERS,
  letterHeroPath,
  posterPath,
  wordsForCase,
  displayGlyph,
  type LetterEntry,
  type WordEntry,
} from "@/data/alphabet";
import { PosterCard } from "@/components/alphabet/PosterCard";
import { PosterLightbox } from "@/components/alphabet/PosterLightbox";
import { WordLessonModal } from "@/components/alphabet/WordLessonModal";
import { VoiceToggle } from "@/components/alphabet/VoiceToggle";
import { ThemeToggle } from "@/components/alphabet/ThemeToggle";
import { getWordLesson, wordRequiresVideo } from "@/data/word-lessons";
import { TracePad } from "@/components/alphabet/TracePad";
import { MatchGame } from "@/components/alphabet/MatchGame";
import { MemoryMatch } from "@/components/alphabet/MemoryMatch";
import { ISpy } from "@/components/alphabet/ISpy";
import { StoryMode } from "@/components/alphabet/StoryMode";
import { CaseHunt } from "@/components/alphabet/CaseHunt";
import { LayoutToggle } from "@/components/alphabet/LayoutToggle";
import { CaseToggle } from "@/components/alphabet/CaseToggle";
import { useCaseMode } from "@/lib/case-mode";
import { GfxToggle } from "@/components/alphabet/GfxToggle";
import { VersionBadge, VersionCorner } from "@/components/alphabet/VersionBadge";
import { StarBar } from "@/components/alphabet/StarBar";
import { markSection, markVisited, markWordSeen, useProgress } from "@/lib/progress";
import { speak, speakLetter, primeAudioFromGesture } from "@/lib/speak";
import { cn } from "@/lib/utils";

type Tab =
  | "words"
  | "sound"
  | "trace"
  | "match"
  | "memory"
  | "ispy"
  | "story"
  | "cases"
  | "facts";

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: "words", label: "Words", icon: BookOpen },
  { id: "sound", label: "Sound", icon: Volume2 },
  { id: "trace", label: "Trace", icon: Pencil },
  { id: "match", label: "Match", icon: Gamepad2 },
  { id: "memory", label: "Pairs", icon: Gamepad2 },
  { id: "ispy", label: "I Spy", icon: Eye },
  { id: "story", label: "Story", icon: BookOpen },
  { id: "cases", label: "Aa hunt", icon: Sparkles },
  { id: "facts", label: "Fun", icon: Info },
];

function parseHash(): { page: "home" | "letter"; letter?: string } {
  const h = (window.location.hash || "#/").replace(/^#/, "");
  const parts = h.split("/").filter(Boolean);
  if (parts[0] === "letter" && parts[1]) {
    return { page: "letter", letter: parts[1].toLowerCase() };
  }
  return { page: "home" };
}

function navigate(to: string) {
  window.location.hash = to.startsWith("#") ? to : `#${to}`;
}

export function PortableApp() {
  const [route, setRoute] = useState(parseHash);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  if (route.page === "letter" && route.letter) {
    const entry = getLetter(route.letter);
    if (entry) {
      return (
        <>
          <LetterView entry={entry} />
          <VersionCorner />
        </>
      );
    }
  }
  return (
    <>
      <HomeView />
      <VersionCorner />
    </>
  );
}

function HomeView() {
  const { visited, wordsSeen, stars } = useProgress();
  const [imgFail, setImgFail] = useState<Record<string, boolean>>({});
  const progressPct = Math.round((visited.length / 26) * 100);
  const { mode: caseKind } = useCaseMode();

  return (
    <main className="mx-auto min-h-dvh w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pt-6">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent">
            <Sparkles className="size-3.5" /> Letter World · Offline
          </p>
          <h1 className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl">
            ABC Adventure
            <VersionBadge />
          </h1>
          <p className="max-w-xl text-base font-medium text-ink-soft sm:text-lg">
            Fully portable alphabet fun — posters, sounds, tracing, and games. No internet needed.
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            <VoiceToggle compact />
            <ThemeToggle compact />
            <GfxToggle compact />
          </div>
          <StarBar />
          <div className="w-full min-w-[180px] rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-2 sm:w-auto">
            <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-wide text-muted">
              <span>Journey</span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-soft">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] font-semibold text-ink-soft">
              {stars} stars · {wordsSeen.length} posters seen
            </p>
          </div>
        </div>
      </header>

      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
          {caseKind === "upper" ? "Pick a Big letter" : "Pick a little letter"}
        </h2>
        <button
          type="button"
          onClick={() => speak("Let's learn the alphabet! Tap any letter to begin.")}
          className="pressable inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-1.5 text-xs font-bold text-ink-soft sm:text-sm"
        >
          <Volume2 className="size-3.5" /> Hear intro
        </button>
      </div>
      <CaseToggle className="mb-3" />

      <div className="stagger grid grid-cols-3 gap-2.5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 sm:gap-3">
        {LETTERS.map((L) => {
          const seen = visited.includes(L.letter);
          const failed = imgFail[L.letter];
          return (
            <button
              key={L.letter}
              type="button"
              onClick={() => navigate(`/letter/${L.letter.toLowerCase()}`)}
              className="pressable group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border-2 border-white/60 text-white shadow-[var(--shadow-letter)]"
              style={{
                background: `linear-gradient(145deg, ${L.hue} 0%, ${L.accent} 100%)`,
              }}
              aria-label={`Letter ${L.letter}${seen ? ", visited" : ""}`}
            >
              {!failed && (
                <img
                  src={letterHeroPath(L.letter, caseKind)}
                  alt=""
                  className={
                    caseKind === "lower"
                      ? "absolute inset-0 h-full w-full object-cover"
                      : "absolute inset-0 h-full w-full object-cover opacity-35 mix-blend-overlay"
                  }
                  onError={() => setImgFail((s) => ({ ...s, [L.letter]: true }))}
                />
              )}
              {caseKind === "upper" && (
                <>
                  <span className="relative font-display text-4xl font-bold drop-shadow-md sm:text-5xl">
                    {displayGlyph(L.letter, caseKind)}
                  </span>
                  <span className="relative mt-0.5 text-[10px] font-bold uppercase tracking-wide opacity-90 sm:text-xs">
                    {L.words[0].word}
                  </span>
                </>
              )}
              {seen && (
                <span className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-star ring-2 ring-white/80" />
              )}
            </button>
          );
        })}
      </div>

      <section className="card-surface mt-8 rounded-[var(--radius-lg)] p-3 sm:p-4">
        <p className="mb-2 text-xs font-bold tracking-wide text-muted">
          Portrait / Landscape
        </p>
        <LayoutToggle />
      </section>

      <footer className="mt-6 space-y-2 text-center text-sm text-muted">
        <p className="font-medium">
          Offline portable · Progress on this device · 156 posters + videos · AI voice · no internet
        </p>
        <p className="text-xs">
          Tip: keep this whole folder together. Open <strong>index.html</strong> anytime — no install.
        </p>
      </footer>
    </main>
  );
}

function LetterView({ entry }: { entry: LetterEntry }) {
  const [tab, setTab] = useState<Tab>("words");
  const [openWord, setOpenWord] = useState<WordEntry | null>(null);
  const { mode: caseKind } = useCaseMode();
  const progress = useProgress();

  useEffect(() => {
    markVisited(entry.letter);
  }, [entry.letter]);

  useEffect(() => {
    setTab("words");
    setOpenWord(null);
  }, [entry.letter]);

  const idx = LETTERS.findIndex((l) => l.letter === entry.letter);
  const prev = LETTERS[(idx - 1 + LETTERS.length) % LETTERS.length]!;
  const next = LETTERS[(idx + 1) % LETTERS.length]!;
  const displayLetter = displayGlyph(entry.letter, caseKind);
  const modeWords = wordsForCase(entry, caseKind);

  function openPoster(w: WordEntry) {
    const lesson = getWordLesson(entry.letter, w.slug);
    if (lesson) primeAudioFromGesture(lesson.word);
    setOpenWord(w);
    if (!lesson) {
      markWordSeen(entry.letter, w.slug);
    }
  }
  const openLesson = openWord != null ? getWordLesson(entry.letter, openWord.slug) : null;
  const lessonWords = modeWords.filter((w) => getWordLesson(entry.letter, w.slug));
  const lessonIdx = openWord ? lessonWords.findIndex((w) => w.slug === openWord.slug) : -1;
  const prevLessonWord =
    lessonIdx >= 0 && lessonWords.length > 1
      ? lessonWords[(lessonIdx - 1 + lessonWords.length) % lessonWords.length]
      : undefined;
  const nextLessonWord =
    lessonIdx >= 0 && lessonWords.length > 1
      ? lessonWords[(lessonIdx + 1) % lessonWords.length]
      : undefined;

  const wordsSeen = useMemo(() => new Set(progress.wordsSeen), [progress.wordsSeen]);

  return (
    <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 pb-20 pt-3 sm:px-6 sm:pt-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="pressable inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-2 text-sm font-bold text-ink"
        >
          <ArrowLeft className="size-4" /> Home
        </button>
        <div className="flex items-center gap-2">
          <VersionBadge />
          <VoiceToggle compact />
          <ThemeToggle compact />
          <GfxToggle compact />
          <StarBar />
        </div>
      </div>

      <section
        className="relative mb-5 overflow-hidden rounded-[var(--radius-xl)] border-2 border-white/50 p-5 shadow-[var(--shadow-float)] sm:p-7"
        style={{
          background: `linear-gradient(135deg, ${entry.hue} 0%, ${entry.accent} 100%)`,
        }}
      >
        <img
          src={letterHeroPath(entry.letter, caseKind)}
          alt=""
          className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rounded-3xl object-cover opacity-40 sm:h-52 sm:w-52"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex size-20 items-center justify-center rounded-[1.5rem] bg-white/95 font-display text-5xl font-bold shadow-lg sm:size-24 sm:text-6xl"
              style={{ color: entry.accent }}
            >
              {displayLetter}
            </div>
            <div className="text-white">
              <p className="text-sm font-bold uppercase tracking-wider text-white/80">
                {caseKind === "upper" ? "Big letter" : "little letter"}
              </p>
              <h1 className="font-display text-3xl font-bold sm:text-4xl">{displayLetter}</h1>
              <p className="mt-1 text-sm font-semibold text-white/90 sm:text-base">
                Sound: {entry.sound} · {entry.soundCue}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => speakLetter(entry.letter)}
              className="pressable inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-white px-4 py-2.5 text-sm font-bold shadow-md"
              style={{ color: entry.accent }}
            >
              <Volume2 className="size-4" /> Say letter
            </button>
          </div>
        </div>
      </section>
      <CaseToggle letter={entry.letter} accent={entry.accent} className="mb-4" />

      <div className="mb-4 flex gap-1 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                if (t.id !== "words") markSection(entry.letter, t.id);
              }}
              className={cn(
                "pressable inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-pill)] border-2 px-3 py-2 text-sm font-bold",
                active
                  ? "border-transparent text-white"
                  : "border-border bg-surface text-ink-soft",
              )}
              style={active ? { background: entry.accent } : undefined}
            >
              <Icon className="size-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "words" && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {modeWords.map((w) => (
            <PosterCard
              key={w.slug}
              letter={entry.letter}
              accent={entry.accent}
              hue={entry.hue}
              word={w}
              imageSrc={posterPath(entry.letter, w.slug)}
              requiresVideo={wordRequiresVideo(entry.letter, w.slug)}
              onOpen={() => openPoster(w)}
              seen={wordsSeen.has(`${entry.letter.toLowerCase()}-${w.slug}`)}
              caseKind={caseKind}
            />
          ))}
        </div>
      )}

      {tab === "sound" && (
        <div className="card-surface space-y-4 rounded-[var(--radius-xl)] p-5">
          <button
            type="button"
            onClick={() => speak(entry.soundCue)}
            className="pressable flex w-full items-center justify-between gap-3 rounded-[var(--radius-lg)] border-2 border-border bg-surface-soft px-4 py-4 text-left"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Sound</p>
              <p className="font-display text-xl font-bold text-ink">{entry.soundCue}</p>
            </div>
            <Volume2 className="size-6 text-accent" />
          </button>
          <button
            type="button"
            onClick={() => speak(entry.rhyme)}
            className="pressable flex w-full items-center justify-between gap-3 rounded-[var(--radius-lg)] border-2 border-border bg-surface-soft px-4 py-4 text-left"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-muted">Rhyme</p>
              <p className="font-display text-lg font-bold text-ink">{entry.rhyme}</p>
            </div>
            <Volume2 className="size-6 text-accent" />
          </button>
        </div>
      )}

      {tab === "trace" && (
        <TracePad letter={entry.letter} accent={entry.accent} caseKind={caseKind} />
      )}
      {tab === "match" && <MatchGame entry={entry} />}
      {tab === "memory" && <MemoryMatch entry={entry} />}
      {tab === "ispy" && <ISpy entry={entry} />}
      {tab === "story" && <StoryMode entry={entry} />}
      {tab === "cases" && <CaseHunt entry={entry} />}

      {tab === "facts" && (
        <button
          type="button"
          onClick={() => speak(entry.funFact)}
          className="card-surface pressable w-full rounded-[var(--radius-xl)] p-5 text-left"
        >
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Fun fact</p>
          <p className="mt-2 font-display text-xl font-bold text-ink">{entry.funFact}</p>
          <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-accent">
            <Volume2 className="size-4" /> Tap to hear
          </p>
        </button>
      )}

      <div className="mt-8 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => navigate(`/letter/${prev.letter.toLowerCase()}`)}
          className="pressable inline-flex items-center gap-1 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-2 text-sm font-bold"
        >
          <ChevronLeft className="size-4" /> {prev.letter}
        </button>
        <button
          type="button"
          onClick={() => navigate(`/letter/${next.letter.toLowerCase()}`)}
          className="pressable inline-flex items-center gap-1 rounded-[var(--radius-pill)] border-2 border-border bg-surface px-3 py-2 text-sm font-bold"
        >
          {next.letter} <ChevronRight className="size-4" />
        </button>
      </div>

      {openWord && openLesson && (
        <WordLessonModal
          key={`${entry.letter}-${openWord.slug}`}
          letter={entry.letter}
          accent={entry.accent}
          hue={entry.hue}
          word={openWord}
          imageSrc={posterPath(entry.letter, openWord.slug)}
          lesson={openLesson}
          alreadySeen={wordsSeen.has(`${entry.letter.toLowerCase()}-${openWord.slug}`)}
          onClose={() => setOpenWord(null)}
          onPrev={prevLessonWord ? () => { primeAudioFromGesture(prevLessonWord.word); setOpenWord(prevLessonWord); } : undefined}
          onNext={nextLessonWord ? () => { primeAudioFromGesture(nextLessonWord.word); setOpenWord(nextLessonWord); } : undefined}
          prevLabel={prevLessonWord?.word}
          nextLabel={nextLessonWord?.word}
          caseKind={caseKind}
        />
      )}
      {openWord && !openLesson && (
        <PosterLightbox
          letter={entry.letter}
          accent={entry.accent}
          hue={entry.hue}
          word={openWord}
          imageSrc={posterPath(entry.letter, openWord.slug)}
          onClose={() => setOpenWord(null)}
        />
      )}
    </main>
  );
}
