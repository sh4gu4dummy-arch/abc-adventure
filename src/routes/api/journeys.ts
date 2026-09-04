import { createFileRoute } from "@tanstack/react-router";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/**
 * Durable journeys backup for the live preview.
 * Browser storage (iframe / new tab) gets wiped; this file lives in the
 * workspace so progress survives updates and preview restarts.
 */
const FILE = join(process.cwd(), "data", "journeys.json");

async function readFileBackup(): Promise<string | null> {
  try {
    return await readFile(FILE, "utf8");
  } catch {
    return null;
  }
}

async function writeFileBackup(raw: string): Promise<void> {
  await mkdir(dirname(FILE), { recursive: true });
  await writeFile(FILE, raw, "utf8");
}

function looksLikeStore(v: unknown): boolean {
  if (!v || typeof v !== "object") return false;
  const o = v as { profiles?: unknown; store?: unknown };
  return Array.isArray(o.profiles) || (o.store != null && typeof o.store === "object");
}

export const Route = createFileRoute("/api/journeys")({
  server: {
    handlers: {
      GET: async () => {
        const raw = await readFileBackup();
        if (!raw) {
          return new Response(JSON.stringify({ store: null }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }
        try {
          const parsed = JSON.parse(raw) as unknown;
          const store =
            parsed && typeof parsed === "object" && "store" in parsed
              ? (parsed as { store: unknown }).store
              : parsed;
          return new Response(JSON.stringify({ store }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        } catch {
          return new Response(JSON.stringify({ store: null }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        }
      },
      PUT: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "invalid json" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (!looksLikeStore(body)) {
          return new Response(JSON.stringify({ error: "missing store" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const store =
          body && typeof body === "object" && "store" in body
            ? (body as { store: unknown }).store
            : body;
        const payload = JSON.stringify(
          { kind: "abc-adventure-journeys", version: 1, savedAt: new Date().toISOString(), store },
          null,
          2,
        );
        try {
          await writeFileBackup(payload);
        } catch (err) {
          console.error("[journeys] file backup failed", err);
          return new Response(JSON.stringify({ ok: false }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
