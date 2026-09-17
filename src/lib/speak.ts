/**
 * Kid-friendly speech: natural neural AI audio (embedded map + local mp3s).
 * Fully offline / portable — no network required.
 *
 * Voice toggle:
 *  - Teacher: warm female Ava → public/audio/*.mp3
 *  - Buddy: warm friendly male Andrew → public/audio/buddy/*.mp3
 *
 * Critical: only ONE voice at a time. A generation token cancels in-flight
 * speak() calls so a stopped clip cannot fall through into female+browser
 * and double-talk over the new voice.
 */

import { assetUrl } from "@/lib/assets";
import { SPEECH_MAP } from "@/data/speech-map";
import { getVoicePref, type VoicePref } from "@/lib/voice-pref";

const audioUrlCache = new Map<string, string>();
const inflight = new Map<string, Promise<string | null>>();
let runtimeTtsDisabled = false;

/** One element for all lesson speech — WebViews only allow later play() on the same node that a tap unlocked. */
let sharedAudio: HTMLAudioElement | null = null;
let currentAudio: HTMLAudioElement | null = null;

/**
 * Bumped on every speak() / stopSpeech(). Async chains from older generations
 * must exit without starting another voice.
 */
let speakGeneration = 0;

function normalize(text: string) {
  return text.trim().replace(/\s+/g, " ");
}

function isActive(gen: number) {
  return gen === speakGeneration;
}

function getSharedAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = "auto";
  }
  return sharedAudio;
}

function pauseShared() {
  const a = sharedAudio;
  if (!a) return;
  try {
    a.onended = null;
    a.onerror = null;
    a.oncanplay = null;
    a.pause();
  } catch {
    /* ignore */
  }
}

export function stopSpeech() {
  // Invalidate every in-flight speak() so they cannot fall through to a second voice
  speakGeneration += 1;
  pauseShared();
  currentAudio = sharedAudio;
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

function stopHardKeepGen() {
  pauseShared();
  currentAudio = sharedAudio;
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Play a local/remote mp3. Resolves:
 *  - "played" when the clip finished while this gen was still active
 *  - "failed" when load/play failed (and gen still active)
 *  - "cancelled" when a newer speak() took over
 */
function playClip(url: string, gen: number): Promise<"played" | "failed" | "cancelled"> {
  if (!isActive(gen)) return Promise.resolve("cancelled");

  stopHardKeepGen();
  const audio = getSharedAudio();
  if (!audio) return Promise.resolve("failed");
  currentAudio = audio;

  return new Promise((resolve) => {
    if (!isActive(gen)) {
      resolve("cancelled");
      return;
    }

    let settled = false;

    const finish = (result: "played" | "failed" | "cancelled") => {
      if (settled) return;
      settled = true;
      if (!isActive(gen)) {
        resolve("cancelled");
        return;
      }
      resolve(result);
    };

    audio.onended = () => finish(isActive(gen) ? "played" : "cancelled");
    audio.onerror = () => finish(isActive(gen) ? "failed" : "cancelled");

    const watch = window.setInterval(() => {
      if (!isActive(gen)) {
        window.clearInterval(watch);
        try {
          audio.pause();
        } catch {
          /* ignore */
        }
        finish("cancelled");
      }
    }, 50);

    const clearWatch = () => window.clearInterval(watch);

    audio.addEventListener("ended", () => clearWatch(), { once: true });
    audio.addEventListener("error", () => clearWatch(), { once: true });

    audio.volume = 1;
    audio.src = url;
    void audio
      .play()
      .then(() => {
        if (!isActive(gen)) {
          clearWatch();
          try {
            audio.pause();
          } catch {
            /* ignore */
          }
          finish("cancelled");
        }
      })
      .catch(() => {
        clearWatch();
        finish(isActive(gen) ? "failed" : "cancelled");
      });
  });
}

function speakBrowser(
  text: string,
  gen: number,
  opts?: { rate?: number; pitch?: number; voice?: VoicePref },
) {
  if (!isActive(gen)) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = opts?.rate ?? 0.9;
  u.pitch = opts?.pitch ?? 1.05;
  u.lang = "en-US";
  const pref = opts?.voice ?? getVoicePref();
  const voices = window.speechSynthesis.getVoices();
  let preferred;
  if (pref === "male") {
    preferred =
      voices.find((v) => /andrew|daniel|david|alex|tom|fred/i.test(v.name)) ??
      voices.find((v) => v.lang.startsWith("en") && /male/i.test(v.name)) ??
      voices.find((v) => /guy|james|mark/i.test(v.name));
  } else {
    preferred =
      voices.find((v) =>
        /samantha|karen|moira|ava|jenny|aria|natural|google us english|female/i.test(
          v.name,
        ),
      ) ?? voices.find((v) => v.lang.startsWith("en"));
  }
  if (!preferred) preferred = voices.find((v) => v.lang.startsWith("en"));
  if (preferred) u.voice = preferred;
  if (pref === "male") {
    u.pitch = opts?.pitch ?? 1.12;
    u.rate = opts?.rate ?? 0.92;
  }

  if (!isActive(gen)) return;
  window.speechSynthesis.speak(u);
}

/** Offline clip path for the requested voice. */
function localClipUrl(text: string, voice: VoicePref): string | null {
  const file = SPEECH_MAP[normalize(text)];
  if (!file) return null;
  if (voice === "male") return assetUrl(`audio/buddy/${file}`);
  return assetUrl(`audio/${file}`);
}

async function fetchRuntimeTts(text: string, voice: VoicePref, gen: number): Promise<string | null> {
  if (!isActive(gen)) return null;
  if (typeof window !== "undefined" && window.__ABC_ASSET_BASE__) return null;
  if (runtimeTtsDisabled) return null;
  if (typeof navigator !== "undefined" && navigator.onLine === false) return null;

  const key = `${voice}:${normalize(text)}`;
  if (audioUrlCache.has(key)) return audioUrlCache.get(key)!;
  if (inflight.has(key)) return inflight.get(key)!;

  const p = (async () => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: normalize(text), voice }),
      });
      if (!isActive(gen)) return null;
      if (res.status === 503 || res.status === 401) {
        runtimeTtsDisabled = true;
        return null;
      }
      if (!res.ok) return null;
      const blob = await res.blob();
      if (!blob.size) return null;
      const url = URL.createObjectURL(blob);
      audioUrlCache.set(key, url);
      return url;
    } catch {
      return null;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, p);
  return p;
}

/**
 * Speak text with the app-wide Teacher/Buddy voice.
 * Never stacks two voices — cancelled generations exit immediately.
 */
export async function speak(
  text: string,
  opts?: { rate?: number; pitch?: number; voice?: VoicePref },
) {
  if (typeof window === "undefined") return;
  const key = normalize(text);
  if (!key) return;

  // New generation — cancels any previous speak chain
  speakGeneration += 1;
  const gen = speakGeneration;
  stopHardKeepGen();

  const pref = opts?.voice ?? getVoicePref();

  // 1) Preferred offline neural clip
  const primary = localClipUrl(key, pref);
  if (primary) {
    const result = await playClip(primary, gen);
    if (result === "played" || result === "cancelled") return;
    // failed → try fallbacks below (only if still active)
  }

  if (!isActive(gen)) return;

  // 2) If Buddy clip missing, do NOT play Teacher (that causes female+buddy double feel).
  //    Only fall back to same-preference runtime TTS, then browser.
  //    (If Teacher missing, still allow browser — one voice only.)

  // 3) Online runtime TTS (same gender)
  const runtimeUrl = await fetchRuntimeTts(key, pref, gen);
  if (!isActive(gen)) return;
  if (runtimeUrl) {
    const result = await playClip(runtimeUrl, gen);
    if (result === "played" || result === "cancelled") return;
  }

  if (!isActive(gen)) return;

  // 4) Last resort: single browser voice (robotic) — never layered on top of an mp3
  speakBrowser(key, gen, { ...opts, voice: pref });

  // Approximate wait so awaiters still sequence roughly
  const waitMs = Math.min(12000, 800 + key.length * 55);
  const start = Date.now();
  while (Date.now() - start < waitMs) {
    if (!isActive(gen)) return;
    await new Promise((r) => setTimeout(r, 80));
  }
}

export function speakLetter(letter: string) {
  void speak(`The letter ${letter}`);
}

export function speakWord(word: string) {
  void speak(word);
}

/** Call from a tap that opens a lesson so later autoplay speech is allowed. */
export function primeAudioFromGesture(_text?: string) {
  if (typeof window === "undefined") return;
  // Unlock only. Never play the next word here — that leaked as the first
  // of the 3× repeats when hopping videos fast.
  stopSpeech();
  const a = getSharedAudio();
  if (!a) return;
  try {
    a.volume = 0.01;
    a.src =
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
    void a.play().catch(() => {});
  } catch {
    /* ignore */
  }
}
