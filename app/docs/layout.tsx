import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { enableAI } from '@/lib/shared';
import { AISearch, AISearchPanel, AISearchTrigger } from '@/components/ai/search';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import type { ReactNode } from 'react';

interface DocsNavProps {
  children: ReactNode;
}

function DocsNav({ children }: DocsNavProps) {
  return (
    <div className="flex items-center gap-2">
      {children}
    </div>
  );
}

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const tree = source.getPageTree();
  return (
    <DocsLayout
      tree={tree}
      {...baseOptions()}
      nav={{ 
        enabled: false,
        component: enableAI ? (
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
        ) : undefined,
      }}
      sidebar={{ enabled: false }}
      tabs={false}
    >
      {children}
    </DocsLayout>
  );
}
