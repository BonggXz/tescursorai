import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import rehypeSanitize from "rehype-sanitize";
import { compileMDX } from "next-mdx-remote/rsc";
import { defaultSchema } from "hast-util-sanitize";

import { mdxComponents } from "@/components/mdx/mdx-components";
import { cn } from "@/lib/utils";

const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ["className"],
    ],
    pre: [
      ...(defaultSchema.attributes?.pre ?? []),
      ["className"],
    ],
    span: [
      ...(defaultSchema.attributes?.span ?? []),
      ["className"],
      ["data-line"],
    ],
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      ["className"],
      ["rel"],
      ["target"],
    ],
  },
};

type MdxContentProps = {
  code: string;
  className?: string;
};

export async function MdxContent({ code, className }: MdxContentProps) {
  const { content } = await compileMDX({
    source: code,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          [rehypeSanitize, sanitizeSchema],
          rehypePrism,
        ],
      },
    },
    components: mdxComponents,
  });

  return (
    <div
      className={cn(
        "prose prose-slate max-w-none prose-headings:font-heading prose-code:font-mono prose-ol:marker:text-primary prose-ul:marker:text-primary",
        className,
      )}
    >
      {content}
    </div>
  );
}
