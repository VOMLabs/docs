"use client";

import { MessageCircleIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonVariants } from "fumadocs-ui/components/ui/button";
import { AISearch, AISearchPanel, AISearchTrigger } from "@/components/ai/search";

export function AISearchClient() {
  return (
    <AISearch>
      <AISearchPanel />
      <AISearchTrigger
        className={cn(
          buttonVariants({
            variant: "secondary",
            className: "text-fd-muted-foreground rounded-2xl h-9 px-3 gap-2",
          }),
        )}
      >
        <MessageCircleIcon className="size-4.5" />
        Ask AI
      </AISearchTrigger>
    </AISearch>
  );
}