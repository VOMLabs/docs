"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type GitHubTotalStarsProps = {
  /** GitHub username or organization name */
  userOrOrg: string;
  /** Entity type: user or organization */
  type?: "user" | "org";
  /** Optional locales for number formatting */
  locales?: Intl.LocalesArgument;
  className?: string;
};

export function GitHubTotalStars({
  userOrOrg,
  type = "org",
  locales = "en-US",
  className,
}: GitHubTotalStarsProps) {
  const [totalStars, setTotalStars] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchTotalStars() {
      setLoading(true);
      setError(false);
      let allRepos: any[] = [];
      let page = 1;
      const perPage = 100;

      try {
        while (true) {
          const endpoint =
            type === "org"
              ? `https://api.github.com/orgs/${userOrOrg}/repos?page=${page}&per_page=${perPage}`
              : `https://api.github.com/users/${userOrOrg}/repos?page=${page}&per_page=${perPage}`;

          const response = await fetch(endpoint);
          if (!response.ok) {
            if (response.status === 403) {
              throw new Error("GitHub API rate limit exceeded");
            }
            throw new Error(`Failed to fetch repos: ${response.statusText}`);
          }

          const repos = await response.json();
          if (!Array.isArray(repos) || repos.length === 0) break;

          allRepos = [...allRepos, ...repos];
          page++;
        }

        const total = allRepos.reduce(
          (sum, repo) => sum + (repo.stargazers_count || 0),
          0
        );
        setTotalStars(total);
      } catch (err) {
        console.error("Error fetching GitHub stars:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    if (userOrOrg) {
      fetchTotalStars();
    }
  }, [userOrOrg, type]);

  const formattedStars = totalStars
    ? new Intl.NumberFormat(locales, {
        notation: "compact",
        compactDisplay: "short",
      })
        .format(totalStars)
        .toLowerCase()
    : loading
    ? "..."
    : "n/a";

  const tooltipText = error
    ? "Failed to load star count"
    : totalStars
    ? `${new Intl.NumberFormat(locales).format(totalStars)} stars on ${userOrOrg}`
    : "Loading...";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={cn("gap-1.5 pr-1.5 pl-2", className)}
            variant="ghost"
            asChild
          >
            <a
              href={`https://github.com/${userOrOrg}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                className="-translate-y-px"
                viewBox="0 0 24 24"
                width="16"
                height="16"
              >
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                  fill="currentColor"
                />
              </svg>
              <span className="text-[0.8125rem] text-muted-foreground tabular-nums">
                {formattedStars}
              </span>
            </a>
          </Button>
        </TooltipTrigger>

        <TooltipContent className="font-sans">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
