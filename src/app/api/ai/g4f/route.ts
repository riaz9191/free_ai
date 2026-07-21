const REPO = "Free-AI-Things/g4f-working";
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/refs/heads/main/working`;

type Entry = { provider: string; model: string; type: string };

export async function GET() {
  try {
    const [resultsRes, summaryRes, commitRes] = await Promise.all([
      fetch(`${RAW_BASE}/working_results.txt`, { next: { revalidate: 3600 } }),
      fetch(`${RAW_BASE}/test_results.json`, { next: { revalidate: 3600 } }),
      fetch(
        `https://api.github.com/repos/${REPO}/commits?path=working/test_results.json&per_page=1`,
        { next: { revalidate: 3600 } }
      ),
    ]);

    if (!resultsRes.ok) {
      throw new Error(`GitHub fetch failed (${resultsRes.status})`);
    }

    const text = await resultsRes.text();
    const entries: Entry[] = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [provider, model, type] = line.split("|");
        return { provider, model, type: type || "text" };
      })
      .filter((e) => e.provider && e.model);

    const summaryJson = summaryRes.ok ? await summaryRes.json() : null;
    const summary = summaryJson?.summary || summaryJson || null;

    let updatedAt: string | null = null;
    if (commitRes.ok) {
      const commits = await commitRes.json().catch(() => null);
      updatedAt = commits?.[0]?.commit?.author?.date || null;
    }

    return Response.json({ entries, summary, updatedAt, repo: REPO });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Failed to fetch catalog" },
      { status: 502 }
    );
  }
}
