"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

export function ChannelPlayer({ streamUrl }: { streamUrl: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: import("hls.js").default | null = null;
    let cancelled = false;

    setLoading(true);
    setError(null);

    async function play() {
      if (!video) return;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
        try {
          await video.play();
        } catch {
          // autoplay blocked — user can press play manually
        }
        setLoading(false);
        return;
      }

      const { default: Hls } = await import("hls.js");
      if (cancelled) return;

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          video.play().catch(() => {
            // autoplay blocked — user can press play manually
          });
        });
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (data.fatal) {
            setError(`Playback error: ${data.details}`);
            setLoading(false);
          }
        });
      } else {
        setError("This browser doesn't support HLS playback.");
        setLoading(false);
      }
    }

    play();

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [streamUrl]);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-black">
      <video ref={videoRef} controls className="size-full" playsInline />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="size-8 animate-spin text-white" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/80 px-4 text-center">
          <AlertCircle className="size-8 text-red-400" />
          <span className="text-sm text-red-300">{error}</span>
        </div>
      )}
    </div>
  );
}
