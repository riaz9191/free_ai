"use client";

// In-browser text-to-music via Transformers.js (ONNX/WASM) — no server, no API key.
// Adapted from https://github.com/huggingface/transformers.js-examples/tree/main/musicgen-web
import {
  env,
  AutoTokenizer,
  MusicgenForConditionalGeneration,
  BaseStreamer,
} from "@huggingface/transformers";

if (env.backends.onnx.wasm) {
  env.backends.onnx.wasm.proxy = true;
}

const MODEL_ID = "Xenova/musicgen-small";

let modelPromise: ReturnType<typeof MusicgenForConditionalGeneration.from_pretrained> | null = null;
let tokenizerPromise: ReturnType<typeof AutoTokenizer.from_pretrained> | null = null;

export type MusicProgress = {
  phase: "loading" | "generating" | "encoding";
  percent: number;
};

class CallbackStreamer extends BaseStreamer {
  private callback: (value?: unknown) => void;
  constructor(callback: (value?: unknown) => void) {
    super();
    this.callback = callback;
  }
  put(value: unknown) {
    this.callback(value);
  }
  end() {
    this.callback();
  }
}

export async function generateMusicClientSide(
  prompt: string,
  onProgress?: (p: MusicProgress) => void,
  opts: { duration?: number; guidanceScale?: number; temperature?: number } = {}
): Promise<Blob> {
  const duration = opts.duration ?? 10;
  const guidance_scale = opts.guidanceScale ?? 3;
  const temperature = opts.temperature ?? 1;

  modelPromise ??= MusicgenForConditionalGeneration.from_pretrained(MODEL_ID, {
    progress_callback: (data: { status: string; loaded?: number; total?: number }) => {
      if (data.status !== "progress" || !data.total) return;
      onProgress?.({ phase: "loading", percent: (data.loaded ?? 0) / data.total });
    },
    dtype: {
      text_encoder: "q8",
      decoder_model_merged: "q8",
      encodec_decode: "fp32",
    },
    device: "wasm",
  } as never);
  tokenizerPromise ??= AutoTokenizer.from_pretrained(MODEL_ID);

  const [tokenizer, model] = await Promise.all([tokenizerPromise, modelPromise]);

  const max_length = Math.min(
    Math.max(Math.floor(duration * 50), 1) + 4,
    model.generation_config?.max_length ?? 1500
  );

  let numTokens = 0;
  const streamer = new CallbackStreamer((value) => {
    const percent = value === undefined ? 1 : ++numTokens / max_length;
    onProgress?.({ phase: "generating", percent });
  });

  const inputs = tokenizer(prompt);

  const audio_values = await model.generate({
    ...inputs,
    max_length,
    guidance_scale,
    temperature,
    streamer,
  } as never);

  onProgress?.({ phase: "encoding", percent: 1 });

  const sampling_rate = (model.config as { audio_encoder?: { sampling_rate?: number } }).audio_encoder
    ?.sampling_rate ?? 32000;
  const wav = encodeWAV((audio_values as unknown as { data: Float32Array }).data, sampling_rate);
  return new Blob([wav], { type: "audio/wav" });
}

// Adapted from https://www.npmjs.com/package/audiobuffer-to-wav
function encodeWAV(samples: Float32Array, sampleRate = 32000): ArrayBuffer {
  let offset = 44;
  const buffer = new ArrayBuffer(offset + samples.length * 4);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + samples.length * 4, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 3, true); // IEEE float
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 4, true);
  view.setUint16(32, 4, true);
  view.setUint16(34, 32, true);
  writeString(view, 36, "data");
  view.setUint32(40, samples.length * 4, true);

  for (let i = 0; i < samples.length; ++i, offset += 4) {
    view.setFloat32(offset, samples[i], true);
  }

  return buffer;
}

function writeString(view: DataView, offset: number, value: string) {
  for (let i = 0; i < value.length; ++i) {
    view.setUint8(offset + i, value.charCodeAt(i));
  }
}
