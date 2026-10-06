import { promises as fs } from "fs";
import path from "path";

// Server-only: reads .ipynb files from public/notebooks so they can be rendered
// as a page (/ai/ml/notebooks/<name>) instead of downloaded as raw JSON.
const NOTEBOOK_DIR = path.join(process.cwd(), "public", "notebooks");

type Source = string | string[];

export type NotebookOutput =
  | { kind: "text"; text: string; isError?: boolean }
  | { kind: "image"; src: string }
  | { kind: "html"; html: string };

export type NotebookCell =
  | { type: "markdown"; source: string }
  | { type: "code"; source: string; count: number | null; outputs: NotebookOutput[] };

const join = (s: Source | undefined) => (Array.isArray(s) ? s.join("") : (s ?? ""));

// Tracebacks carry ANSI colour codes; strip them for plain display.
const stripAnsi = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, "");

type RawOutput = {
  output_type: string;
  text?: Source;
  data?: Record<string, Source>;
  ename?: string;
  evalue?: string;
  traceback?: string[];
};

function parseOutput(o: RawOutput): NotebookOutput | null {
  if (o.output_type === "stream") return { kind: "text", text: join(o.text) };
  if (o.output_type === "error") {
    return { kind: "text", text: stripAnsi((o.traceback ?? []).join("\n")), isError: true };
  }
  const data = o.data ?? {};
  if (data["image/png"]) return { kind: "image", src: `data:image/png;base64,${join(data["image/png"]).trim()}` };
  const html = join(data["text/html"]);
  // Pandas tables render nicely as HTML; skip anything scripted (e.g. plotly widgets).
  if (html && !/<script/i.test(html)) return { kind: "html", html };
  if (data["text/plain"]) return { kind: "text", text: join(data["text/plain"]) };
  return null;
}

export async function listNotebooks(): Promise<string[]> {
  const files = await fs.readdir(NOTEBOOK_DIR);
  return files.filter((f) => f.endsWith(".ipynb")).map((f) => f.replace(/\.ipynb$/, "")).sort();
}

export async function getNotebook(name: string): Promise<NotebookCell[] | null> {
  if (!/^[a-z0-9-]+$/.test(name)) return null;
  let raw: string;
  try {
    raw = await fs.readFile(path.join(NOTEBOOK_DIR, `${name}.ipynb`), "utf-8");
  } catch {
    return null;
  }
  const nb = JSON.parse(raw) as {
    cells: { cell_type: string; source: Source; execution_count?: number | null; outputs?: RawOutput[] }[];
  };
  return nb.cells
    .filter((c) => join(c.source).trim() || (c.outputs?.length ?? 0) > 0)
    .map((c): NotebookCell =>
      c.cell_type === "code"
        ? {
            type: "code",
            source: join(c.source),
            count: c.execution_count ?? null,
            outputs: (c.outputs ?? []).map(parseOutput).filter((o): o is NotebookOutput => o !== null),
          }
        : { type: "markdown", source: join(c.source) },
    );
}
