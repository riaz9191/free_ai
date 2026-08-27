import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tv } from "lucide-react";
import { getPublishedChannels } from "@/lib/iptv-store";
import { ChannelCard } from "@/components/iptv/channel-card";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: encoded } = await params;
  const category = decodeURIComponent(encoded);

  const channels = (await getPublishedChannels()).filter((c) => c.category === category);

  if (channels.length === 0) {
    notFound();
  }

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/3 size-[28rem] rounded-full bg-purple-600/10 blur-[130px]" />
        <div className="absolute bottom-0 -right-24 size-[24rem] rounded-full bg-pink-500/10 blur-[130px]" />
      </div>

      <header className="shrink-0 border-b border-border bg-background/70 px-6 py-3.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link
            href="/iptv"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Channels
          </Link>
          <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
            <span className="flex size-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-pink-500">
              <Tv className="size-3.5 text-white" />
            </span>
            IPTV
          </div>
          <div className="w-[72px]" />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">{category}</h1>
          <p className="text-sm text-muted-foreground">
            {channels.length} channel{channels.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {channels.map((c) => (
            <ChannelCard key={c.id} channel={c} />
          ))}
        </div>
      </main>
    </div>
  );
}
