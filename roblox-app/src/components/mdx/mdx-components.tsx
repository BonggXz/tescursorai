import type { ComponentPropsWithoutRef } from "react";

import { CodeBlock } from "@/components/mdx/code-block";
import { cn } from "@/lib/utils";

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type OrderedListProps = ComponentPropsWithoutRef<"ol">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type CodeProps = ComponentPropsWithoutRef<"code">;
type PreProps = ComponentPropsWithoutRef<"pre">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;

export const mdxComponents = {
  h2: ({ className, ...props }: HeadingProps) => (
    <h2
      className={cn(
        "mt-10 scroll-m-20 text-3xl font-heading font-semibold tracking-tight text-slate-900",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: HeadingProps) => (
    <h3
      className={cn(
        "mt-8 scroll-m-20 text-2xl font-heading font-semibold tracking-tight text-slate-900",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: ParagraphProps) => (
    <p
      className={cn(
        "leading-7 text-slate-600 [&:not(:first-child)]:mt-4",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ListProps) => (
    <ul
      className={cn(
        "my-6 ml-6 list-disc space-y-2 text-slate-600 marker:text-primary",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: OrderedListProps) => (
    <ol
      className={cn(
        "my-6 ml-6 list-decimal space-y-2 text-slate-600 marker:text-primary",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: AnchorProps) => (
    <a
      className={cn(
        "font-medium text-primary underline underline-offset-4 transition hover:text-primary/80",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: CodeProps) => (
    <code
      className={cn(
        "relative rounded-md bg-slate-900/90 px-1.5 py-0.5 text-xs text-slate-100",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, children }: PreProps) => (
    <CodeBlock className={className}>{children}</CodeBlock>
  ),
  blockquote: ({ className, ...props }: BlockquoteProps) => (
    <blockquote
      className={cn(
        "mt-6 border-l-4 border-primary/60 bg-primary/5 px-4 py-2 text-sm italic text-slate-700",
        className,
      )}
      {...props}
    />
  ),
} as const;
