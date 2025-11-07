'use client';

import { useState, type ReactElement, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  className?: string;
  children: React.ReactNode;
};

export function CodeBlock({ className, children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const child = Array.isArray(children) ? children[0] : children;
  let codeText = "";
  if (typeof child === "object" && child && "props" in child) {
    const element = child as ReactElement<{ children?: ReactNode }>;
    codeText = String(element.props.children ?? "");
  } else if (typeof child === "string") {
    codeText = child;
  }

  const languageMatch =
    typeof className === "string" && className.match(/language-(\w+)/);
  const language = languageMatch ? languageMatch[1] : undefined;

  return (
    <div className="group/code relative overflow-hidden rounded-2xl border border-border/70 bg-slate-950">
      <div className="flex items-center justify-between border-b border-border/60 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-widest text-slate-300">
        <span>{language ?? "code"}</span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 rounded-full px-2 text-xs text-slate-200 hover:bg-slate-800"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(codeText.trim());
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch {
              setCopied(false);
            }
          }}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden />
          )}
          <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
      <pre
        className={cn(
          "overflow-x-auto bg-transparent px-4 py-4 text-sm leading-relaxed text-slate-100",
          className,
        )}
      >
        {children}
      </pre>
    </div>
  );
}
