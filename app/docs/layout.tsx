import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";
import { enableAI } from "@/lib/shared";
import { source } from "@/lib/source";
import { AISearchClient } from "./aisearch-client";
import {
  CustomSidebarItem,
  CustomSidebarFolder,
  CustomSidebarSeparator,
  CustomSidebarFooter,
} from "@/components/docs-sidebar";

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
        components: {
          Item: CustomSidebarItem,
          Folder: CustomSidebarFolder,
          Separator: CustomSidebarSeparator,
        },
        footer: <CustomSidebarFooter />,
      }}
      tabs={false}
    >
      {children}
    </DocsLayout>
  );
}
