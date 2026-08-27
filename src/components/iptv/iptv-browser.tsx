"use client";

import Link from "next/link";
import { useState } from "react";
import { Tv } from "lucide-react";
import type { Channel } from "@/lib/iptv-store";

function CategoryThumb({ logo }: { logo?: string }) {
  const [imgFailed, setImgFailed] = useState(false);
  if (!logo || imgFailed) {
    return <Tv className="size-8 text-purple-400/70" />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logo}
      alt=""
      onError={() => setImgFailed(true)}
      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
  );
}

export function IptvBrowser({ channels }: { channels: Channel[] }) {
  const categories = Array.from(new Set(channels.map((c) => c.category))).sort();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((category) => {
        const first = channels.find((c) => c.category === category);
        const count = channels.filter((c) => c.category === category).length;

        return (
          <Link
            key={category}
            href={`/iptv/category/${encodeURIComponent(category)}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-muted/5 text-left transition-colors hover:bg-muted/10"
          >
            <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-black/40">
              <CategoryThumb logo={first?.logo} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
            <div className="flex flex-col gap-0.5 px-3 py-2.5">
              <span className="truncate text-sm font-medium">{category}</span>
              <span className="text-xs text-muted-foreground">
                {count} channel{count === 1 ? "" : "s"}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
