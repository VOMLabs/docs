"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type TreeNode = {
  type?: string;
  name?: string;
  title?: string;
  url?: string;
  href?: string;
  children?: TreeNode[];
};

function getNodeLabel(node: TreeNode): string {
  return node.title ?? node.name ?? "Untitled";
}

function getNodeHref(node: TreeNode): string | undefined {
  return node.url ?? node.href;
}

function normalizePath(p: string) {
  return p.replace(/\/+$/, "") || "/";
}

function NavItem({
  node,
  depth,
  pathname,
}: {
  node: TreeNode;
  depth: number;
  pathname: string;
}) {
  const href = getNodeHref(node);
  const label = getNodeLabel(node);
  const isActive = href ? normalizePath(pathname) === normalizePath(href) : false;

  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const children = hasChildren ? node.children : undefined;

  return (
    <div className="min-w-0">
      {href ? (
        <Link
          href={href}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors min-w-0",
            isActive
              ? "bg-fd-muted text-foreground border"
              : "hover:bg-fd-muted text-fd-muted-foreground",
          )}
          style={{ marginLeft: depth * 8 }}
        >
          <span className="truncate">{label}</span>
        </Link>
      ) : (
        <div
          className="px-2 py-1.5 text-xs font-medium text-fd-muted-foreground"
          style={{ marginLeft: depth * 8 }}
        >
          {label}
        </div>
      )}

      {children && (
        <div className="mt-1 space-y-1">
          {children.map((child) => (
            <NavItem
              key={`${getNodeHref(child) ?? getNodeLabel(child)}-${depth + 1}`}
              node={child}
              depth={depth + 1}
              pathname={pathname}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function DocsSidebar({ tree }: { tree: unknown }) {
  const pathname = usePathname();
  const root = (tree ?? {}) as TreeNode;
  const nodes = Array.isArray(root.children) ? root.children : [];

  return (
    <div className="space-y-1">
      {nodes.map((node) => (
        <NavItem
          key={`${getNodeHref(node) ?? getNodeLabel(node)}-0`}
          node={node}
          depth={0}
          pathname={pathname}
        />
      ))}
    </div>
  );
}

