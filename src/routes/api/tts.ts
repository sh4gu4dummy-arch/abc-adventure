import { createFileRoute } from "@tanstack/react-router";

/**
 * Runtime text-to-speech via xAI Voice API.
 * Returns audio/mpeg. Caches in-memory per process to avoid repeat spend.
 * Degrades with 503 when XAI_API_KEY is absent so the client can fall back.
 */

const VOICE_ID = "luna"; // gentle, nurturing — education assistant
const MAX_CHARS = 400;
const cache = new Map<string, ArrayBuffer>();

function cacheKey(text: string, voice: string) {
  // Simple djb2-style hash — avoids node:crypto for edge/browser bundlers
  let h = 5381;
  const s = `${voice}\0${text}`;
  for (let i = 0; i < s.length; i++) h = (h * 33) ^ s.charCodeAt(i);
  return (h >>> 0).toString(16);
}

async function synthesize(text: string, voiceId: string): Promise<ArrayBuffer | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;

  const key = cacheKey(text, voiceId);
  const hit = cache.get(key);
  if (hit) return hit;

  const res = await fetch("https://api.x.ai/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      voice_id: voiceId,
      language: "en",
      output_format: {
        codec: "mp3",
        sample_rate: 24000,
        bit_rate: 128000,
      },
    }),
  });

  if (!res.ok) {
    console.error("[tts] xAI error", res.status, await res.text().catch(() => ""));
    return null;
  }

  const buf = await res.arrayBuffer();
  if (buf.byteLength < 100) return null;

  if (cache.size > 200) {
    const first = cache.keys().next().value;
    if (first) cache.delete(first);
  }
  cache.set(key, buf);
  return buf;
}

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: { text?: string; voice?: string };
        try {
          body = (await request.json()) as { text?: string; voice?: string };
        } catch {
          return new Response(JSON.stringify({ error: "invalid json" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const text = String(body.text ?? "")
          .trim()
          .replace(/\s+/g, " ")
          .slice(0, MAX_CHARS);
        if (!text) {
          return new Response(JSON.stringify({ error: "text required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const pref = typeof body.voice === "string" ? body.voice : "female";
        // Map app voice pref → xAI voice ids (runtime fallback when online)
        const voice =
          pref === "male" || pref === "buddy"
            ? "ara" // warm male-leaning fallback if available; client mostly uses offline
            : pref === "female" || pref === "teacher"
              ? VOICE_ID
              : pref || VOICE_ID;
        const audio = await synthesize(text, voice);
        if (!audio) {
          return new Response(JSON.stringify({ error: "tts unavailable" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(audio, {
          status: 200,
          headers: {
            "Content-Type": "audio/mpeg",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
