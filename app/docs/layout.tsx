import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { enableAI } from '@/lib/shared';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { UnifiedLayout } from '@/components/unified-layout';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const tree = source.getPageTree();
  return (
    <DocsLayout
      tree={tree}
      {...baseOptions()}
      nav={{ enabled: false }}
      sidebar={{ enabled: false }}
      tabs={false}
    >
      <UnifiedLayout
        mode="docs"
        tree={tree}
        headerSlot={
          enableAI ? (
            <AISearch>
              <AISearchPanel />
              <AISearchTrigger
                className={cn(
                  buttonVariants({
                    variant: 'secondary',
                    className: 'text-fd-muted-foreground rounded-2xl h-9 px-3 gap-2',
                  }),
                )}
              >
                <MessageCircleIcon className="size-4.5" />
                Ask AI
              </AISearchTrigger>
            </AISearch>
          ) : null
        }
      >
        {children}
      </UnifiedLayout>
    </DocsLayout>
  );
}
