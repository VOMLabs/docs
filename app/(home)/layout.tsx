import type { Metadata } from "next";
import { UnifiedLayout } from "@/components/unified-layout";

export const metadata: Metadata = {
  title: "VOMLabs Documentation",
  description: "The documentation of VOMLabs",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return <UnifiedLayout mode="home">{children}</UnifiedLayout>;
}
