import { NextResponse } from "next/server";
import { getPublishedChannels } from "@/lib/iptv-store";

export async function GET() {
  const channels = await getPublishedChannels();
  return NextResponse.json({ channels });
}
