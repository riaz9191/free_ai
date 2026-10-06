import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Download, NotebookPen } from "lucide-react";
import { getNotebook, listNotebooks } from "@/lib/notebooks";
import { cn } from "@/lib/utils";

export async function generateStaticParams() {
  return (await listNotebooks()).map((name) => ({ name }));
}

const PROSE =
  "prose dark:prose-invert max-w-none prose-headings:font-semibold prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none";

export default async function NotebookPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const cells = await getNotebook(name);
  if (!cells) notFound();

  return (
    <div className="min-w-0">
      <Link
        href="/ai/ml/lessons/python-notebooks"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Notebooks & Datasets
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <NotebookPen className="size-4" />
            Jupyter Notebook
          </p>
          <h1 className="mt-1 break-all text-3xl font-semibold tracking-tight">{name}.ipynb</h1>
        </div>
        <a
          href={`/notebooks/${name}.ipynb`}
          download
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-accent"
        >
          <Download className="size-4" />
          Download .ipynb
        </a>
      </div>

      <div className="mt-6 space-y-4">
        {cells.map((cell, i) =>
          cell.type === "markdown" ? (
            <div key={i} className={PROSE}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{cell.source}</ReactMarkdown>
            </div>
          ) : (
            <div key={i} className="overflow-hidden rounded-lg border border-border">
              <div className="flex">
                <span className="w-14 shrink-0 select-none pt-3 pr-2 text-right font-mono text-xs text-muted-foreground">
                  [{cell.count ?? " "}]
                </span>
                <pre className="min-w-0 flex-1 overflow-x-auto bg-muted p-3 text-sm">
                  <code>{cell.source}</code>
                </pre>
              </div>
              {cell.outputs.length > 0 && (
                <div className="space-y-2 border-t border-border p-3 pl-14">
                  {cell.outputs.map((out, j) =>
                    out.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={j} src={out.src} alt="Notebook output" className="max-w-full rounded bg-white" />
                    ) : out.kind === "html" ? (
                      <div
                        key={j}
                        className="overflow-x-auto text-sm [&_table]:border-collapse [&_td]:border [&_td]:border-border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:border-border [&_th]:px-2 [&_th]:py-1 [&_style]:hidden"
                        dangerouslySetInnerHTML={{ __html: out.html }}
                      />
                    ) : (
                      <pre
                        key={j}
                        className={cn(
                          "overflow-x-auto whitespace-pre-wrap text-sm",
                          out.isError && "text-red-600 dark:text-red-400",
                        )}
                      >
                        {out.text}
                      </pre>
                    ),
                  )}
                </div>
              )}
            </div>
          ),
        )}
      </div>
    </div>
  );
}
