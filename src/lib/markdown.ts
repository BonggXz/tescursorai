export function getExcerpt(content: string, maxLength = 160): string {
  const withoutLinks = content.replace(/\[(.*?)\]\(.*?\)/g, "$1");
  const withoutMd = withoutLinks
    .replace(/[#>*_`~\-]/g, "")
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (withoutMd.length <= maxLength) {
    return withoutMd;
  }

  return `${withoutMd.slice(0, maxLength).trim()}…`;
}
