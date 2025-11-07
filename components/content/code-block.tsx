"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

interface CodeBlockProps {
  code: string;
  className?: string;
}

export function CodeBlock({ code, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code", error);
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl border bg-slate-950", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="absolute right-3 top-3 h-8 w-8 rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span className="sr-only">Copy code</span>
      </Button>
      <pre className="overflow-auto p-4 text-sm text-slate-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}
