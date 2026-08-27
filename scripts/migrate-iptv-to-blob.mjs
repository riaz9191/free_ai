import { readFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

const DATA_FILE = path.join(process.cwd(), "data", "iptv.json");
const BLOB_PATHNAME = "iptv/channels.json";

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error(
      "Missing BLOB_READ_WRITE_TOKEN.\n" +
        "Get it from the Vercel dashboard → Storage → your Blob store → \".env.local\" tab,\n" +
        "then run: BLOB_READ_WRITE_TOKEN=... node scripts/migrate-iptv-to-blob.mjs"
    );
    process.exit(1);
  }

  const raw = await readFile(DATA_FILE, "utf-8");
  const channels = JSON.parse(raw);
  console.log(`Read ${channels.length} channels from ${DATA_FILE}`);

  const blob = await put(BLOB_PATHNAME, JSON.stringify(channels), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });

  console.log(`Uploaded to Blob store: ${blob.url}`);
  console.log("Done. The live /iptv page should now show these channels.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
