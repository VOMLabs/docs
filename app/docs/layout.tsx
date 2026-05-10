import { DocsLayout } from "fumadocs-ui/layouts/docs";
import Link from "next/link";
import { ThemeSwitchAnimated } from "@/components/theme-switch-animated-fumadocs";
import { baseOptions } from "@/lib/layout.shared";
import { enableAI, vomlabsUrl } from "@/lib/shared";
import { source } from "@/lib/source";
import { AISearchClient } from "./aisearch-client";

export default function Layout({ children }: LayoutProps<"/docs">) {
  const tree = source.getPageTree();
  return (
    <DocsLayout
      tree={tree}
      {...baseOptions()}
      nav={{
        enabled: true,
        component: enableAI ? <AISearchClient /> : undefined,
      }}
      sidebar={{
        enabled: true,
        banner: (
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <span className="inline-flex size-6 items-center justify-center rounded-md border bg-fd-muted text-xs font-bold">
              V
            </span>
            <span>VOMLabs</span>
          </Link>
        ),
        footer: (
          <div className="p-4 border-t flex flex-col gap-3">
            <a
              href={vomlabsUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-fd-muted-foreground hover:text-foreground transition-colors"
            >
              VOMLabs.com
            </a>
            <ThemeSwitchAnimated />
          </div>
        ),
      }}
      tabs={false}
    >
      {children}
    </DocsLayout>
  );
}
