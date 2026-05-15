"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ExternalLink } from "lucide-react";
import type {
  Item as PageTreeItem,
  Folder as PageTreeFolder,
  Separator as PageTreeSeparator,
} from "fumadocs-core/page-tree";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitchAnimated } from "@/components/theme-switch-animated-fumadocs";

function useActivePage() {
  const pathname = usePathname();
  return pathname.replace(/\/+$/, "") || "/";
}

export function CustomSidebarItem({ item }: { item: PageTreeItem }) {
  const active = useActivePage();
  const ref = useRef<HTMLAnchorElement>(null);
  const isActive = item.url ? active === item.url.replace(/\/+$/, "") : false;

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ block: "nearest" });
    }
  }, [isActive]);

  const content = (
    <>
      {item.icon && (
        <span className="size-4 shrink-0 text-fd-muted-foreground">
          {item.icon}
        </span>
      )}
      <span className="truncate">{item.name}</span>
      {item.external && (
        <ExternalLink className="size-3 shrink-0 text-fd-muted-foreground/50" />
      )}
    </>
  );

  const classes = cn(
    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150",
    isActive
      ? "bg-fd-primary/10 text-fd-primary font-medium shadow-sm"
      : "text-fd-muted-foreground hover:bg-fd-muted hover:text-foreground",
  );

  if (item.external) {
    return (
      <Link
        href={item.url}
        target="_blank"
        rel="noreferrer"
        className={classes}
      >
        {content}
      </Link>
    );
  }

  return (
    <Link ref={ref} href={item.url} className={classes}>
      {content}
    </Link>
  );
}

export function CustomSidebarFolder({
  item,
  children,
}: {
  item: PageTreeFolder;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(item.defaultOpen ?? false);
  const active = useActivePage();

  const isActive = item.index?.url ? active === item.index.url.replace(/\/+$/, "") : false;

  if (!item.collapsible && item.collapsible !== undefined) {
    return <div className="mt-2 space-y-0.5">{children}</div>;
  }

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150",
          isActive
            ? "bg-fd-primary/10 text-fd-primary font-medium"
            : "text-fd-muted-foreground hover:bg-fd-muted hover:text-foreground",
        )}
      >
        {item.icon && (
          <span className="size-4 shrink-0 text-fd-muted-foreground">
            {item.icon}
          </span>
        )}
        <span className="truncate font-medium">{item.name}</span>
        <ChevronDown
          className={cn(
            "ml-auto size-4 shrink-0 transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "ml-3 mt-0.5 space-y-0.5 overflow-hidden transition-all duration-200",
          open ? "opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function CustomSidebarSeparator({ item }: { item: PageTreeSeparator }) {
  return (
    <div className="my-3 flex items-center gap-2 px-3">
      <span className="text-xs font-semibold tracking-wider text-fd-muted-foreground uppercase">
        {item.name ?? "\u2500\u2500\u2500\u2500\u2500"}
      </span>
      <div className="flex-1 border-t" />
    </div>
  );
}

export function CustomSidebarFooter() {
  return (
    <div className="p-4 border-t">
      <ThemeSwitchAnimated />
    </div>
  );
}
