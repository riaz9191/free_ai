import { promises as fs } from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { getLesson } from "@/data/lessons";
import { EMPTY_LESSON_NOTE, getLessonContent, hasAltContent } from "@/lib/lessons-content";
import {
  VOICES,
  buildSpeechChunks,
  escapeXml,
  toSsml,
  type VoiceKey,
} from "@/lib/lesson-speech";

export const runtime = "nodejs";

// Same storage rule as src/lib/iptv-store.ts: Vercel Blob when a store is
// connected (production disk is ephemeral), otherwise a local folder.
const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
const CACHE_DIR = path.join(process.cwd(), "data", "tts-cache");

async function readCache(key: string): Promise<ArrayBuffer | null> {
  try {
    if (useBlob) {
      const { get } = await import("@vercel/blob");
      const result = await get(`tts/${key}`, { access: "private", useCache: false });
      if (!result) return null;
      return await new Response(result.stream).arrayBuffer();
    }
    const buf = await fs.readFile(path.join(CACHE_DIR, key));
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
  } catch {
    return null;
  }
}

async function writeCache(key: string, audio: ArrayBuffer): Promise<void> {
  try {
    if (useBlob) {
      const { put } = await import("@vercel/blob");
      await put(`tts/${key}`, Buffer.from(audio), {
        access: "private",
        contentType: "audio/mpeg",
        allowOverwrite: true,
      });
      return;
    }
    await fs.mkdir(CACHE_DIR, { recursive: true });
    await fs.writeFile(path.join(CACHE_DIR, key), Buffer.from(audio));
  } catch (e) {
    // A failed cache write shouldn't fail playback — it just costs a re-generate.
    console.error("tts cache write failed", e);
  }
}

function audioResponse(audio: ArrayBuffer) {
  return new Response(audio, {
    headers: {
      "Content-Type": "audio/mpeg",
      // URLs carry the content hash (?h=), so a given URL never changes.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const slug = params.get("slug") ?? "";
  const index = Number(params.get("i"));
  const voice = (params.get("voice") ?? "female") as VoiceKey;
  const variant = params.get("v") === "alt" ? "alt" : undefined;

  const lesson = getLesson(slug);
  if (!lesson || !Number.isInteger(index) || index < 0 || !(voice in VOICES)) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }
  if (variant && !(await hasAltContent(slug))) {
    return Response.json({ error: "No alt version" }, { status: 404 });
  }

  const content = await getLessonContent(slug, variant);
  if (content === EMPTY_LESSON_NOTE) {
    return Response.json({ error: "Lesson has no notes yet" }, { status: 404 });
  }
  const chunk = buildSpeechChunks(content, lesson.title)[index];
  if (!chunk) return Response.json({ error: "Chunk out of range" }, { status: 404 });

  const cacheKey = `${voice}-${chunk.hash}.mp3`;
  const cached = await readCache(cacheKey);
  if (cached) return audioResponse(cached);

  const azureKey = process.env.AZURE_SPEECH_KEY;
  const azureRegion = process.env.AZURE_SPEECH_REGION;
  if (!azureKey || !azureRegion) return edgeStreamResponse(chunk.text, voice, cacheKey);

  let audio: ArrayBuffer;
  try {
    audio = await azureTts(chunk.text, voice, azureKey, azureRegion);
  } catch (e) {
    const err = e as Error & { status?: number };
    return Response.json(
      { error: err.message || "TTS failed" },
      { status: err.status ?? 502 },
    );
  }
  await writeCache(cacheKey, audio);
  return audioResponse(audio);
}

function httpError(message: string, status: number) {
  return Object.assign(new Error(message), { status });
}

// Azure Speech is used when AZURE_SPEECH_KEY/REGION are set (official, needs
// an Azure subscription). Otherwise the free voice service behind Edge's
// "Read aloud" is used — same bn-BD neural voices, but unofficial: Microsoft
// can block it at any time, and adding the Azure key switches over.

async function azureTts(
  text: string,
  voice: VoiceKey,
  key: string,
  region: string,
): Promise<ArrayBuffer> {
  const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/ssml+xml",
      "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
      "User-Agent": "free-ai-lessons",
    },
    body: toSsml(text, voice),
  });
  if (!res.ok) {
    if (res.status === 401)
      throw httpError("Invalid AZURE_SPEECH_KEY or wrong AZURE_SPEECH_REGION.", 401);
    if (res.status === 429) throw httpError("Azure rate limit — একটু পরে আবার চেষ্টা করো।", 429);
    throw httpError(`Azure TTS error (${res.status})`, res.status);
  }
  return res.arrayBuffer();
}

const EDGE_DOWN =
  "Free voice service এই মুহূর্তে কাজ করছে না। একটু পরে চেষ্টা করো, বা .env-এ Azure key দাও।";

/**
 * Edge synthesises at roughly real-time speed, so waiting for a whole chunk
 * means a 20s+ silence. Instead the audio is streamed to the browser as it
 * arrives (playback starts within a second or two) and saved to the cache
 * once complete. Generation keeps going if the listener disconnects, so the
 * prefetch of the next chunk still fills the cache.
 */
async function edgeStreamResponse(text: string, voice: VoiceKey, cacheKey: string) {
  const { MsEdgeTTS, OUTPUT_FORMAT } = await import("msedge-tts");
  const tts = new MsEdgeTTS();
  let audioStream: import("stream").Readable;
  let first: Buffer;
  try {
    await tts.setMetadata(VOICES[voice], OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    // Edge rejects most SSML tags (e.g. <break>), so send escaped plain text;
    // sentence punctuation (।) already gives natural pauses.
    audioStream = tts.toStream(escapeXml(text.replace(/\n/g, " "))).audioStream;
    // Wait for the first bytes so a dead service still returns a JSON error
    // the player can show, rather than an empty 200.
    first = await new Promise<Buffer>((resolve, reject) => {
      audioStream.once("data", (d: Buffer) => {
        audioStream.pause();
        resolve(d);
      });
      audioStream.once("error", reject);
      audioStream.once("end", () => reject(new Error("no audio")));
    });
  } catch (e) {
    console.error("edge tts failed", e);
    tts.close();
    return Response.json({ error: EDGE_DOWN }, { status: 502 });
  }

  const parts: Buffer[] = [first];
  let open = true;
  const body = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (d: Buffer) => {
        if (!open) return;
        try {
          controller.enqueue(new Uint8Array(d));
        } catch {
          open = false;
        }
      };
      const finish = () => {
        if (open) {
          open = false;
          try {
            controller.close();
          } catch {
            // already closed by the client
          }
        }
        tts.close();
      };
      send(first);
      audioStream.on("data", (d: Buffer) => {
        parts.push(d);
        send(d);
      });
      audioStream.once("end", () => {
        const buf = Buffer.concat(parts);
        void writeCache(
          cacheKey,
          buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer,
        );
        finish();
      });
      // A mid-stream failure ends playback early; nothing is cached, so the
      // next attempt regenerates it.
      audioStream.once("error", (e) => {
        console.error("edge tts stream failed", e);
        finish();
      });
      audioStream.resume();
    },
    cancel() {
      open = false;
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "audio/mpeg",
      // Not immutable: a stream cut short must not stick in the browser cache.
      // The finished file is served from our cache with the long max-age.
      "Cache-Control": "no-store",
    },
  });
}
