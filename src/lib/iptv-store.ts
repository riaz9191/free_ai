import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type Channel = {
  id: string;
  name: string;
  url: string;
  category: string;
  logo?: string;
  published: boolean;
  createdAt: number;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "iptv.json");

async function readAll(): Promise<Channel[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as Channel[];
  } catch {
    return [];
  }
}

async function writeAll(channels: Channel[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(channels, null, 2), "utf-8");
}

export async function getAllChannels(): Promise<Channel[]> {
  const channels = await readAll();
  return channels.sort((a, b) => b.createdAt - a.createdAt);
}

export async function getPublishedChannels(): Promise<Channel[]> {
  const channels = await getAllChannels();
  return channels.filter((c) => c.published);
}

export async function getChannel(id: string): Promise<Channel | undefined> {
  const channels = await readAll();
  return channels.find((c) => c.id === id);
}

export async function createChannel(input: {
  name: string;
  url: string;
  category: string;
  logo?: string;
  published: boolean;
}): Promise<Channel> {
  const channels = await readAll();
  const channel: Channel = {
    id: crypto.randomUUID(),
    name: input.name,
    url: input.url,
    category: input.category,
    logo: input.logo,
    published: input.published,
    createdAt: Date.now(),
  };
  channels.push(channel);
  await writeAll(channels);
  return channel;
}

export async function createChannels(
  inputs: { name: string; url: string; category: string; logo?: string; published: boolean }[]
): Promise<Channel[]> {
  const channels = await readAll();
  const created: Channel[] = inputs.map((input) => ({
    id: crypto.randomUUID(),
    name: input.name,
    url: input.url,
    category: input.category,
    logo: input.logo,
    published: input.published,
    createdAt: Date.now(),
  }));
  channels.push(...created);
  await writeAll(channels);
  return created;
}

export async function updateChannel(
  id: string,
  patch: Partial<Pick<Channel, "name" | "url" | "category" | "logo" | "published">>
): Promise<Channel | undefined> {
  const channels = await readAll();
  const idx = channels.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  channels[idx] = { ...channels[idx], ...patch };
  await writeAll(channels);
  return channels[idx];
}

export async function setPublished(
  ids: string[] | "all",
  published: boolean
): Promise<Channel[]> {
  const channels = await readAll();
  const idSet = ids === "all" ? null : new Set(ids);
  for (const c of channels) {
    if (!idSet || idSet.has(c.id)) c.published = published;
  }
  await writeAll(channels);
  return channels;
}

export async function deleteChannel(id: string): Promise<boolean> {
  const channels = await readAll();
  const next = channels.filter((c) => c.id !== id);
  if (next.length === channels.length) return false;
  await writeAll(next);
  return true;
}
