import { type InferPageType, loader } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";
import { server } from "fumadocs-mdx/runtime/server";
import type { InternalTypeConfig } from "fumadocs-mdx/runtime/types";
import { docsContentRoute, docsImageRoute, docsRoute } from "./shared";
import type * as Config from "../source.config";

const create = server<
  typeof Config,
  InternalTypeConfig & {
    DocData: {
      docs: Record<string, never>;
    };
  }
>();

const docs = await create.docs(
  "docs",
  "content/docs",
  {},
  {
    "index.mdx": () => import("../content/docs/index.mdx?collection=docs"),
    "install-minecraft-plugin.mdx": () =>
      import("../content/docs/install-minecraft-plugin.mdx?collection=docs"),
  },
);

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: docsRoute,
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin()],
});

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'image.png'];

  return {
    segments,
    url: `${docsImageRoute}/${segments.join('/')}`,
  };
}

export function getPageMarkdownUrl(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, 'content.md'];

  return {
    segments,
    url: `${docsContentRoute}/${segments.join('/')}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const data = page.data as unknown as {
    title: string;
    getText?: (type: "raw" | "processed") => Promise<string>;
  };

  if (typeof data.getText !== "function") return `# ${data.title} (${page.url})`;

  const processed = await data.getText("processed");

  return `# ${data.title} (${page.url})

${processed}`;
}
