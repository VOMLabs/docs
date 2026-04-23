import type { Metadata } from "next";
import { UnifiedLayout } from "@/components/unified-layout";

export const metadata: Metadata = {
  title: "VOMLabs Documentation",
  description: "Documentation for VOMLabs projects - plugins, tools, and more.",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return <UnifiedLayout mode="home">{children}</UnifiedLayout>;
}
