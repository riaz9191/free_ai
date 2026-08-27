"use client";

import Link from "next/link";
import { useState } from "react";
import type { Channel } from "@/lib/iptv-store";

export function ChannelCard({ channel, className }: { channel: Channel; className?: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = channel.logo && !imgFailed;

  return (
    <Link
      href={`/iptv/${channel.id}`}
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-muted/5 transition-colors hover:bg-muted/10 ${className ?? ""}`}
    >
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-black/40 p-2">
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={channel.logo}
            alt=""
            onError={() => setImgFailed(true)}
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <span className="line-clamp-3 text-center text-xs font-semibold text-purple-300/90">
            {channel.name}
          </span>
        )}
        {channel.category && (
          <span className="absolute left-1.5 top-1.5 max-w-[calc(100%-0.75rem)] truncate rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
            {channel.category}
          </span>
        )}
      </div>
      <span className="truncate px-2.5 py-2 text-xs font-medium">{channel.name}</span>
    </Link>
  );
}
