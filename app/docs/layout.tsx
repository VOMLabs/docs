import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { enableAI } from '@/lib/shared';
import { MessageCircleIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { AISearchClient } from './aisearch-client';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  const tree = source.getPageTree();
  return (
    <DocsLayout
      tree={tree}
      {...baseOptions()}
      nav={{ 
        enabled: false,
        component: enableAI ? (
          <AISearchClient />
        ) : undefined,
      }}
      sidebar={{ enabled: false }}
      tabs={false}
    >
      {children}
    </DocsLayout>
  );
}
