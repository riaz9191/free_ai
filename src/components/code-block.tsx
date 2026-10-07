"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

/** Fenced code block with a language label and a copy button. */
export function CodeBlock({ language, children }: { language?: string; children: React.ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const text = preRef.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard blocked — the code is still selectable by hand
    }
  }

  return (
    <div className="not-prose group my-6 overflow-hidden rounded-xl border border-border bg-black/[.03] dark:bg-white/[.04]">
      <div className="flex items-center justify-between border-b border-border px-4 py-1.5">
        <span className="text-xs text-muted-foreground">{language ?? "text"}</span>
        <button
          type="button"
          onClick={copy}
          aria-label="Code copy করো"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2"
        >
          {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        ref={preRef}
        className="overflow-x-auto p-4 font-mono text-[13.5px] leading-relaxed text-foreground"
      >
        {children}
      </pre>
    </div>
  );
}
