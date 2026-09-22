import { promises as fs } from "fs";
import path from "path";

export type RoutineDoc = {
  /** task id -> ISO completion timestamp */
  progress: Record<string, string>;
  /** completed focus sessions, newest first */
  log: { at: string; minutes: number }[];
  /** epoch ms of the last client write; used for last-write-wins */
  updatedAt: number;
};

export const EMPTY_DOC: RoutineDoc = { progress: {}, log: [], updatedAt: 0 };

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "ai-ml-routine.json");
const BLOB_PATHNAME = "ai-ml/routine.json";

// Same trade-off as the IPTV store: Vercel's filesystem is ephemeral, so use Blob
// when a store is connected (BLOB_STORE_ID is set for OIDC-authenticated stores,
// BLOB_READ_WRITE_TOKEN for token-based ones) and fall back to a local JSON file
// for dev or a self-hosted server with a real disk.
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);

function sanitize(input: unknown): RoutineDoc {
  const doc = input as Partial<RoutineDoc> | null;
  if (!doc || typeof doc !== "object") return EMPTY_DOC;

  const progress: Record<string, string> = {};
  if (doc.progress && typeof doc.progress === "object") {
    for (const [id, at] of Object.entries(doc.progress)) {
      if (typeof id === "string" && typeof at === "string") progress[id] = at;
    }
  }

  const log = Array.isArray(doc.log)
    ? doc.log
        .filter(
          (e): e is { at: string; minutes: number } =>
            Boolean(e) && typeof e.at === "string" && typeof e.minutes === "number",
        )
        .slice(0, 500)
    : [];

  return {
    progress,
    log,
    updatedAt: typeof doc.updatedAt === "number" ? doc.updatedAt : 0,
  };
}

export async function readRoutine(): Promise<RoutineDoc> {
  if (useBlob) {
    try {
      const { get } = await import("@vercel/blob");
      const result = await get(BLOB_PATHNAME, { access: "private", useCache: false });
      if (!result) return EMPTY_DOC;
      const text = await new Response(result.stream).text();
      return sanitize(JSON.parse(text));
    } catch {
      return EMPTY_DOC;
    }
  }

  try {
    return sanitize(JSON.parse(await fs.readFile(DATA_FILE, "utf-8")));
  } catch {
    return EMPTY_DOC;
  }
}

async function writeRoutine(doc: RoutineDoc): Promise<void> {
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_PATHNAME, JSON.stringify(doc), {
      access: "private",
      contentType: "application/json",
      allowOverwrite: true,
    });
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(doc, null, 2), "utf-8");
}

/**
 * Last-write-wins on `updatedAt`. A stale push (an offline tab coming back with an
 * older snapshot) is ignored and the stored document is returned instead, so the
 * client can reconcile.
 */
export async function saveRoutine(incoming: unknown): Promise<RoutineDoc> {
  const next = sanitize(incoming);
  const current = await readRoutine();
  if (next.updatedAt <= current.updatedAt) return current;
  await writeRoutine(next);
  return next;
}
