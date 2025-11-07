import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import type { PropsWithChildren } from "react";
import { CodeBlock } from "@/components/content/code-block";
import { cn } from "@/lib/utils";

const components: MDXRemoteProps["components"] = {
  h2: (props: PropsWithChildren) => (
    <h2
      className="mt-8 text-2xl font-semibold text-slate-900 first:mt-0"
      {...props}
    />
  ),
  h3: (props: PropsWithChildren) => (
    <h3
      className="mt-6 text-xl font-semibold text-slate-900 first:mt-0"
      {...props}
    />
  ),
  p: (props: PropsWithChildren) => (
    <p className="mt-4 text-sm leading-6 text-muted-foreground" {...props} />
  ),
  ul: (props: PropsWithChildren) => (
    <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-muted-foreground" {...props} />
  ),
  ol: (props: PropsWithChildren) => (
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm text-muted-foreground" {...props} />
  ),
  li: (props: PropsWithChildren) => (
    <li className="leading-6 text-muted-foreground" {...props} />
  ),
  a: (props: PropsWithChildren<{ href?: string }>) => (
    <a
      className="font-medium text-primary underline-offset-4 hover:underline"
      target="_blank"
      rel="noreferrer"
      {...props}
    />
  ),
  pre: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  code: ({ className, children }: { className?: string; children: React.ReactNode }) => {
    const code = String(children).trim();
    return <CodeBlock code={code} className={cn(className)} />;
  },
};

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose prose-slate max-w-none prose-h2:text-slate-900 prose-strong:text-slate-900 prose-a:text-primary">
      <MDXRemote source={source} components={components} />
    </div>
  );
}
