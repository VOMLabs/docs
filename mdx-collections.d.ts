declare module "*.mdx?collection=docs" {
  const MDXComponent: (props: unknown) => JSX.Element;
  export default MDXComponent;

  export const toc: unknown;
  export const structuredData: unknown;
  export const frontmatter: Record<string, unknown>;

  export const _markdown: string | undefined;
  export const _mdast: string | undefined;
}

