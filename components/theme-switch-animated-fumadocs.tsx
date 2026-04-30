"use client";

import { useCallback, useEffect, useState } from "react";
import { Sun, Moon, Airplay } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

const itemVariants = cn(
  "size-6.5 p-1.5 text-fd-muted-foreground",
  "data-[active=true]:bg-fd-accent data-[active=true]:text-fd-accent-foreground"
);

const full = [
  ["light", Sun],
  ["dark", Moon],
  ["system", Airplay],
] as const;

export function ThemeSwitchAnimated() {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const value = mounted ? resolvedTheme : null;

  const handleClick = useCallback(
    (key: string) => {
      if (key === "system") {
        setTheme("system");
        return;
      }

      const newTheme = key;

      if (typeof document.startViewTransition !== "function") {
        setTheme(newTheme);
        return;
      }

      const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const x = viewportWidth / 2;
      const y = viewportHeight / 2;
      const maxRadius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y)
      );

      const root = document.documentElement;
      root.dataset.magicuiThemeVt = "active";
      root.style.setProperty(
        "--magicui-theme-toggle-vt-duration",
        "400ms"
      );

      const transition = document.startViewTransition(() => {
        flushSync(() => setTheme(newTheme));
      });

      const cleanup = () => {
        delete root.dataset.magicuiThemeVt;
        root.style.removeProperty("--magicui-theme-toggle-vt-duration");
      };

      if (transition?.finished?.finally) {
        transition.finished.finally(cleanup);
      } else {
        cleanup();
      }

      transition?.ready?.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 400,
            easing: "ease-in-out",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          }
        );
      });
    },
    [setTheme]
  );

  if (!mounted) return null;

  return (
    <div className="inline-flex items-center rounded-full border p-1 overflow-hidden *:rounded-full">
      {full.map(([key, Icon]) => {
        if (key === "system") return null;
        return (
          <button
            key={key}
            aria-label={`Switch to ${key} mode`}
            className={cn(itemVariants, {
              "data-[active=true]": value === key,
            })}
            data-active={value === key}
            onClick={() => handleClick(key)}
          >
            <Icon className="size-full" fill="currentColor" />
          </button>
        );
      })}
    </div>
  );
}
