import Link from "next/link";
import type { ReactNode } from "react";
import { appName, gitConfig } from "@/lib/shared";
import { cn } from "@/lib/utils";
import { DocsSidebar } from "./unified-layout-docs-sidebar";

type Mode = "home" | "docs";

export function UnifiedLayout(props: {
  mode: Mode;
  children: ReactNode;
  tree?: unknown;
  headerSlot?: ReactNode;
}) {
  const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="h-14 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-medium tracking-tight hover:opacity-80 transition-opacity min-w-0"
              >
                <span className="inline-flex size-6 items-center justify-center rounded-md border bg-fd-muted text-xs font-semibold">
                  V
                </span>
                <span className="truncate">{appName}</span>
              </Link>
              <span className="hidden sm:inline-block h-5 w-px bg-border" />
              <nav className="hidden sm:flex items-center gap-1 text-sm text-fd-muted-foreground">
                <Link
                  href="/docs"
                  className="rounded-md px-2 py-1 hover:text-foreground hover:bg-fd-muted transition-colors"
                >
                  Docs
                </Link>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-2 py-1 hover:text-foreground hover:bg-fd-muted transition-colors"
                >
                  GitHub
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              {props.headerSlot}
              <Link
                href="/docs"
                className={cn(
                  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-3",
                  props.mode === "home"
                    ? "bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90"
                    : "border bg-background hover:bg-fd-muted",
                )}
              >
                {props.mode === "home" ? "Get Started" : "Browse Docs"}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {props.mode === "home" ? (
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="py-14 md:py-20">
              <div className="mx-auto max-w-2xl text-center">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-fd-muted-foreground">
                  <span className="inline-flex size-1.5 rounded-full bg-fd-primary" />
                  Minimal docs. Maximum clarity.
                </div>
                <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight">
                  Ship plugins faster with clean, practical documentation.
                </h1>
                <p className="mt-5 text-base md:text-lg text-fd-muted-foreground">
                  Install guides, configuration references, and real
                  server-ready examples—organized with a minimalist,
                  border-forward UI.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/docs"
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-md text-sm font-medium transition-colors bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90 h-10 px-6"
                  >
                    Explore documentation
                  </Link>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-full sm:w-auto items-center justify-center rounded-md text-sm font-medium transition-colors border bg-background hover:bg-fd-muted h-10 px-6"
                  >
                    View repository
                  </a>
                </div>
              </div>

              <div className="mt-12 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border bg-background p-5">
                  <div className="text-sm font-medium">Fast onboarding</div>
                  <div className="mt-2 text-sm text-fd-muted-foreground">
                    Get to a working server setup quickly with step-by-step
                    guides and copy-ready snippets.
                  </div>
                </div>
                <div className="rounded-xl border bg-background p-5">
                  <div className="text-sm font-medium">Nested navigation</div>
                  <div className="mt-2 text-sm text-fd-muted-foreground">
                    Multi-level docs navigation with a sticky sidebar for
                    scanning and jumping between topics.
                  </div>
                </div>
                <div className="rounded-xl border bg-background p-5">
                  <div className="text-sm font-medium">
                    Minimal, border-heavy UI
                  </div>
                  <div className="mt-2 text-sm text-fd-muted-foreground">
                    A clean Fumadocs-inspired aesthetic that prioritizes content
                    density and legibility.
                  </div>
                </div>
              </div>

              <div className="mt-10 rounded-2xl border bg-background overflow-hidden">
                <div className="grid md:grid-cols-12">
                  <div className="md:col-span-5 border-b md:border-b-0 md:border-r p-6">
                    <div className="text-sm font-medium">Recommended path</div>
                    <div className="mt-2 text-sm text-fd-muted-foreground">
                      Start with installation, then move into configuration and
                      advanced usage.
                    </div>
                    <div className="mt-4 flex flex-col gap-2 text-sm">
                      <Link
                        href="/docs"
                        className="rounded-md border px-3 py-2 hover:bg-fd-muted transition-colors"
                      >
                        1. Install the plugin
                      </Link>
                      <Link
                        href="/docs"
                        className="rounded-md border px-3 py-2 hover:bg-fd-muted transition-colors"
                      >
                        2. Configure your server
                      </Link>
                      <Link
                        href="/docs"
                        className="rounded-md border px-3 py-2 hover:bg-fd-muted transition-colors"
                      >
                        3. Deploy with confidence
                      </Link>
                    </div>
                  </div>
                  <div className="md:col-span-7 p-6">
                    <div className="text-sm font-medium">What you’ll find</div>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2 text-sm">
                      <div className="rounded-lg border p-4">
                        <div className="font-medium">Install</div>
                        <div className="mt-1 text-fd-muted-foreground">
                          Verified steps and troubleshooting.
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="font-medium">Configure</div>
                        <div className="mt-1 text-fd-muted-foreground">
                          Clear defaults, explained options.
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="font-medium">Operate</div>
                        <div className="mt-1 text-fd-muted-foreground">
                          Maintenance, updates, best practices.
                        </div>
                      </div>
                      <div className="rounded-lg border p-4">
                        <div className="font-medium">Reference</div>
                        <div className="mt-1 text-fd-muted-foreground">
                          Concise API/config lookups.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {props.children}
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 py-6">
              <aside className="hidden lg:block">
                <div className="sticky top-20">
                  <div className="rounded-xl border bg-background">
                    <div className="border-b px-4 py-3 text-xs font-medium text-fd-muted-foreground">
                      Navigation
                    </div>
                    <div className="p-2">
                      <DocsSidebar tree={props.tree} />
                    </div>
                  </div>
                </div>
              </aside>

              <div className="min-w-0">
                <div className="rounded-2xl border bg-background">
                  <div className="border-b px-5 py-4 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        Documentation
                      </div>
                      <div className="text-xs text-fd-muted-foreground truncate">
                        Border-heavy, minimalist layout with nested navigation.
                      </div>
                    </div>
                    <Link
                      href="/"
                      className="hidden sm:inline-flex rounded-md border bg-background px-3 py-2 text-xs hover:bg-fd-muted transition-colors"
                    >
                      Back to landing
                    </Link>
                  </div>
                  <div className="px-5 py-6">{props.children}</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      <footer className="border-t">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="py-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="text-sm">
              <div className="font-medium">{appName}</div>
              <div className="text-fd-muted-foreground">
                Clean docs UI built with Fumadocs + Next.js.
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-fd-muted-foreground">
              <Link
                href="/docs"
                className="rounded-md px-2 py-1 hover:text-foreground hover:bg-fd-muted transition-colors"
              >
                Docs
              </Link>
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-md px-2 py-1 hover:text-foreground hover:bg-fd-muted transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
