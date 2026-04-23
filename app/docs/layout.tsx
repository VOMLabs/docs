import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { enableAI } from '@/lib/shared';
import { AISearchClient } from './aisearch-client';

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
      sidebar={{ enabled: true }}
      tabs={false}
    >
      {children}
    </DocsLayout>
  );
}
