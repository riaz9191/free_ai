import { readFile } from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "iptv.json");
const BASE_URL = process.env.LIVE_URL || "https://riaz-ai.vercel.app";
const PASSWORD = process.env.IPTV_ADMIN_PASSWORD || "riaz1234";

async function main() {
  const raw = await readFile(DATA_FILE, "utf-8");
  const channels = JSON.parse(raw);
  console.log(`Read ${channels.length} channels from ${DATA_FILE}`);

  const loginRes = await fetch(`${BASE_URL}/api/iptv-admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: PASSWORD }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status}`);
  const cookie = loginRes.headers.get("set-cookie")?.split(";")[0];
  if (!cookie) throw new Error("No session cookie returned");

  // group by (category, published) so each bulk call keeps the exact original state
  const groups = new Map();
  for (const c of channels) {
    const key = JSON.stringify([c.category, c.published]);
    if (!groups.has(key)) {
      groups.set(key, { category: c.category, published: c.published, items: [] });
    }
    groups.get(key).items.push(c);
  }

  let total = 0;
  for (const { category, published, items } of groups.values()) {
    const res = await fetch(`${BASE_URL}/api/iptv-admin/channels/bulk`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        category,
        published,
        channels: items.map((c) => ({ name: c.name, url: c.url, logo: c.logo })),
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error(`Failed for category "${category}" (published=${published}):`, err);
      continue;
    }
    const data = await res.json();
    total += data.channels.length;
    console.log(`Uploaded ${data.channels.length} to "${category}" (published=${published})`);
  }

  console.log(`Done. Uploaded ${total}/${channels.length} channels to ${BASE_URL}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
