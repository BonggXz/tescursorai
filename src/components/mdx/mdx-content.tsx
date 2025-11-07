import { compile, run } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import type { ComponentProps, ComponentType } from "react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import * as runtime from "react/jsx-runtime";

import { cn } from "@/lib/utils";

type MdxContentProps = {
  source: string;
  className?: string;
};

const mdxComponents = {
  h2: (props: ComponentProps<"h2">) => (
    <h2
      className="mt-10 scroll-m-20 text-3xl font-semibold tracking-tight text-slate-900 first:mt-0"
      {...props}
    />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3
      className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight text-slate-900"
      {...props}
    />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="leading-7 text-slate-600 [&:not(:first-child)]:mt-6" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="my-6 ml-6 list-disc space-y-2 text-slate-600" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="my-6 ml-6 list-decimal space-y-2 text-slate-600" {...props} />
  ),
  a: (props: ComponentProps<"a">) => (
    <a
      className="font-medium text-primary underline decoration-primary/40 underline-offset-4 transition hover:text-primary/80"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  pre: ({ className, ...props }: ComponentProps<"pre">) => (
    <pre
      className={cn(
        "relative overflow-x-auto rounded-lg border border-slate-200 bg-slate-950 p-4 text-sm leading-6 text-slate-50 shadow-sm",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentProps<"code">) => (
    <code
      className={cn(
        "relative rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-900",
        className,
      )}
      {...props}
    />
  ),
};

export async function MdxContent({ source, className }: MdxContentProps) {
  const compiled = await compile(source, {
    outputFormat: "function-body",
    development: process.env.NODE_ENV === "development",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            className: ["group"],
          },
        },
      ],
    ],
  });

  const mdxModule = await run(compiled, {
    ...runtime,
  });
  const Content = mdxModule.default as ComponentType<{ components: typeof mdxComponents }>;

  return (
    <MDXProvider components={mdxComponents}>
      <div className={cn("prose prose-slate dark:prose-invert max-w-none", className)}>
        <Content components={mdxComponents} />
      </div>
    </MDXProvider>
  );
}
