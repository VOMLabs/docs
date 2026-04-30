import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { enableAI } from '@/lib/shared';
import { AISearchClient } from './aisearch-client';
import Link from "next/link";
import { ThemeSwitchAnimated } from "@/components/theme-switch-animated-fumadocs";

export default function Layout({ children }: LayoutProps<'/docs'>) {
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
        sidebar: {
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
            <div className="p-4 border-t">
              <ThemeSwitchAnimated />
            </div>
          ),
        },
      }}
      tabs={false}
    >
      {children}
    </DocsLayout>
  );
}
