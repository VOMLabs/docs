"use client";

import {
  type ComponentProps,
  createContext,
  type ReactNode,
  type SyntheticEvent,
  use,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Loader2,
  MessageCircleIcon,
  RefreshCw,
  SearchIcon,
  Send,
  X,
  Settings2,
  ChevronDownIcon,
  CheckIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { cn } from "../../lib/cn";
import { buttonVariants } from "../ui/button";
import { useChat, type UseChatHelpers } from "@ai-sdk/react";
import { DefaultChatTransport, type Tool, type UIToolInvocation } from "ai";
import { Markdown } from "../markdown";
import { Presence } from "@radix-ui/react-presence";
import type {
  ChatUIMessage,
  SearchTool,
  AIProvider,
} from "../../app/api/chat/route";
import { availableProviders, enableAI } from "../../lib/shared";

const Context = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
  chat: UseChatHelpers<ChatUIMessage>;
  provider: string;
  setProvider: (provider: string) => void;
  available: string[];
} | null>(null);

export function AISearchPanelHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  const { setOpen, provider, setProvider, available } = useAISearchContext();

  if (available.length === 0) {
    return (
      <div
        className={cn(
          "sticky top-0 flex items-start gap-2 border rounded-xl bg-fd-secondary text-fd-secondary-foreground shadow-sm",
          className,
        )}
        {...props}
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium">AI Chat</p>
          <p className="text-xs text-fd-muted-foreground mt-1">
            No API keys configured. Contact VOMLabs to enable AI.
          </p>
        </div>
        <button
          aria-label="Close"
          tabIndex={-1}
          className={cn(
            buttonVariants({
              size: "icon-sm",
              variant: "ghost",
              className: "text-fd-muted-foreground rounded-full",
            }),
          )}
          onClick={() => setOpen(false)}
        >
          <X />
        </button>
      </div>
    );
  }

  if (!available.includes(provider)) {
    setProvider(available[0]);
  }

  const providerNames: Record<string, string> = {
    openrouter: "OpenRouter",
    google: "Gemini",
    openai: "OpenAI",
    anthropic: "Claude",
    deepseek: "DeepSeek",
    ollama: "Ollama",
    lmstudio: "LM Studio",
  };

  const providers = [
    { id: "google", name: "Gemini" },
    { id: "openrouter", name: "OpenRouter" },
    { id: "openai", name: "OpenAI" },
  ].filter((p) => available.includes(p.id));

  const currentName = providerNames[provider] || "Select Provider";

  return (
    <div
      className={cn(
        "sticky top-0 flex items-start gap-2 border rounded-xl bg-fd-secondary text-fd-secondary-foreground shadow-sm",
        className,
      )}
      {...props}
    >
      <div className="px-3 py-2 flex-1">
        <p className="text-sm font-medium mb-2">AI Chat</p>
        {providers.length > 1 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 text-xs border bg-transparent px-2 py-1 rounded text-fd-muted-foreground hover:bg-fd-accent">
                {currentName}
                <ChevronDownIcon className="size-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {providers.map((p) => (
                <DropdownMenuRadioItem
                  key={p.id}
                  value={p.id}
                  onSelect={() => {
                    setProvider(p.id);
                  }}
                >
                  {p.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <p className="text-xs text-fd-muted-foreground">{currentName}</p>
        )}
        <p className="text-xs text-fd-muted-foreground mt-1">
          AI can be very inaccurate, please verify the answers.
        </p>
      </div>

      <button
        aria-label="Close"
        tabIndex={-1}
        className={cn(
          buttonVariants({
            size: "icon-sm",
            variant: "ghost",
            className: "text-fd-muted-foreground rounded-full",
          }),
        )}
        onClick={() => setOpen(false)}
      >
        <X />
      </button>
    </div>
  );
}

export function AISearchInputActions() {
  const { messages, status, setMessages, regenerate } = useChatContext();
  const isLoading = status === "streaming";

  if (messages.length === 0) return null;

  return (
    <>
      {!isLoading && messages.at(-1)?.role === "assistant" && (
      <button
          type="button"
          className={cn(
            buttonVariants({
              variant: "secondary",
              size: "sm",
              className: "rounded-full gap-1.5",
            }),
          )}
          onClick={() => regenerate()}
        >
          <RefreshCw className="size-4" />
          Retry
        </button>
      )}
      <button
        type="button"
        className={cn(
          buttonVariants({
            variant: 'secondary',
            size: 'sm',
            className: 'rounded-full',
          }),
        )}
        onClick={() => setMessages([])}
      >
        Clear Chat
      </button>
    </>
  );
}

const StorageKeyInput = "__ai_search_input";
export function AISearchInput(props: ComponentProps<"form">) {
  const { status, sendMessage, stop } = useChatContext();
    const [input, setInput] = useState(
    () => localStorage.getItem(StorageKeyInput) ?? "",
  );
  const isLoading = status === "streaming" || status === "submitted";
  const onStart = (e?: SyntheticEvent) => {
    e?.preventDefault();
    const message = input.trim();
    if (message.length === 0) return;

    void sendMessage({
      role: 'user',
      parts: [
        {
          type: 'data-client',
          data: {
            location: location.href,
          },
        },
        {
          type: 'text',
          text: message,
        },
      ],
    });
    setInput('');
    localStorage.removeItem(StorageKeyInput);
  };

  useEffect(() => {
    if (isLoading) document.getElementById('nd-ai-input')?.focus();
  }, [isLoading]);

  return (
    <form
      {...props}
      className={cn("flex items-start pe-2", props.className)}
      onSubmit={onStart}
    >
      <Input
        value={input}
        placeholder={isLoading ? 'AI is answering...' : 'Ask a question'}
        autoFocus
        className="p-3"
        disabled={status === 'streaming' || status === 'submitted'}
        onChange={(e) => {
          setInput(e.target.value);
          localStorage.setItem(StorageKeyInput, e.target.value);
        }}
        onKeyDown={(event) => {
          if (!event.shiftKey && event.key === 'Enter') {
            onStart(event);
          }
        }}
      />
      {isLoading ? (
        <button
          key="bn"
          type="button"
          className={cn(
            buttonVariants({
              variant: 'secondary',
              className: 'transition-all rounded-full mt-2 gap-2',
            }),
          )}
          onClick={stop}
        >
          <Loader2 className="size-4 animate-spin text-fd-muted-foreground" />
          Abort Answer
        </button>
      ) : (
        <button
          key="bn"
          type="submit"
          className={cn(
            buttonVariants({
              variant: 'primary',
              className: 'transition-all rounded-full mt-2',
            }),
          )}
          disabled={input.length === 0}
        >
          <Send className="size-4" />
        </button>
      )}
    </form>
  );
}

function List(props: Omit<ComponentProps<'div'>, 'dir'>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    function callback() {
      const container = containerRef.current;
      if (!container) return;

      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'instant',
      });
    }

    const observer = new ResizeObserver(callback);
    callback();

    const element = containerRef.current?.firstElementChild;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        "fd-scroll-container overflow-y-auto min-w-0 flex flex-col",
        props.className,
      )}
      >
      {props.children}
    </div>
  );
}

function Input(props: ComponentProps<'textarea'>) {
  const ref = useRef<HTMLDivElement>(null);
  const shared = cn('col-start-1 row-start-1', props.className);

  return (
    <div className="grid flex-1">
      <textarea
        id="nd-ai-input"
        {...props}
        className={cn(
          'resize-none bg-transparent placeholder:text-fd-muted-foreground focus-visible:outline-none',
          shared,
        )}
      />
      <div ref={ref} className={cn(shared, 'break-all invisible')}>
        {`${props.value?.toString() ?? ''}\n`}
      </div>
    </div>
  );
}

const roleName: Record<string, string> = {
  user: 'you',
  assistant: 'vomdocs',
};

function Message({ message, ...props }: { message: ChatUIMessage } & ComponentProps<'div'>) {
  let markdown = '';
  const searchCalls: UIToolInvocation<SearchTool>[] = [];

  for (const part of message.parts ?? []) {
    if (part.type === 'text') {
      markdown += part.text;
      continue;
    }

    if (part.type.startsWith('tool-')) {
      const toolName = part.type.slice('tool-'.length);
      const p = part as UIToolInvocation<Tool>;

      if (toolName !== 'search' || !p.toolCallId) continue;
      searchCalls.push(p);
    }
  }

  return (
    <div onClick={(e) => e.stopPropagation()} {...props}>
      <p
        className={cn(
          'mb-1 text-sm font-medium text-fd-muted-foreground',
          message.role === 'assistant' && 'text-fd-primary',
        )}
      >
        {roleName[message.role] ?? 'unknown'}
      </p>
      <div className="prose text-sm">
        <Markdown text={markdown} />
      </div>

      {searchCalls.map((call) => {
        return (
          <div
            key={call.toolCallId}
            className="flex flex-row gap-2 items-center mt-3 rounded-lg border bg-fd-secondary text-fd-muted-foreground text-xs p-2"
          >
            <SearchIcon className="size-4" />
            {call.state === 'output-error' || call.state === 'output-denied' ? (
              <p className="text-fd-error">{call.errorText ?? 'Failed to search'}</p>
            ) : (
              <p>{!call.output ? 'Searching…' : `${call.output.length} search results`}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function AISearch({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<string>("google");
  const [available, setAvailable] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/chat", { method: "GET" })
      .then((res) => res.json())
      .then((data: { providers: string[] }) => {
        setAvailable(data.providers);
        if (data.providers.length > 0 && !data.providers.includes(provider)) {
          setProvider(data.providers[0]);
        }
      })
      .catch(() => setAvailable([]));
  }, []);

  const chat = useChat<ChatUIMessage>({
    id: 'search',
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { provider },
    }),
  });

  return (
    <Context
      value={useMemo(
        () => ({ chat, open, setOpen, provider, setProvider, available }),
        [chat, open, provider, available],
      )}
    >
      {children}
    </Context>
  );
}

export function AISearchTrigger({
  position = 'default',
  className,
  ...props
}: ComponentProps<'button'> & { position?: 'default' | 'float' }) {
  const { open, setOpen } = useAISearchContext();

  return (
    <button
      data-state={open ? 'open' : 'closed'}
      className={cn(
        position === 'float' && [
          'fixed bottom-4 gap-3 w-24 inset-e-[calc(--spacing(4)+var(--removed-body-scroll-bar-size,0px))] shadow-lg z-20 transition-[translate,opacity]',
          open && 'translate-y-10 opacity-0',
        ],
        className,
      )}
      onClick={() => setOpen(!open)}
      {...props}
    >
      {props.children}
    </button>
  );
}

export function AISearchPanel() {
  const { open, setOpen } = useAISearchContext();
  useHotKey();

  return (
    <>
      <style>
        {`
        @keyframes ask-ai-open {
          from {
            translate: 100% 0;
          }
          to {
            translate: 0 0;
          }
        }
        @keyframes ask-ai-close {
          from {
            width: var(--ai-chat-width);
          }
          to {
            width: 0px;
          }
        }`}
      </style>
      <Presence present={open}>
        <div
          data-state={open ? 'open' : 'closed'}
          className="fixed inset-0 z-30 backdrop-blur-xs bg-fd-overlay data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out lg:hidden"
          onClick={() => setOpen(false)}
        />
      </Presence>
      <Presence present={open}>
        <div
          className={cn(
            'overflow-hidden z-30 bg-fd-card text-fd-card-foreground [--ai-chat-width:400px] 2xl:[--ai-chat-width:460px]',
            'max-lg:fixed max-lg:inset-x-2 max-lg:inset-y-4 max-lg:border max-lg:rounded-2xl max-lg:shadow-xl',
            'lg:sticky lg:top-0 lg:h-dvh lg:border-s lg:ms-auto lg:in-[#nd-docs-layout]:[grid-area:toc] lg:in-[#nd-notebook-layout]:row-span-full lg:in-[#nd-notebook-layout]:col-start-5',
            open
              ? 'animate-fd-dialog-in lg:animate-[ask-ai-open_200ms]'
              : 'animate-fd-dialog-out lg:animate-[ask-ai-close_200ms]',
          )}
        >
          <div className="flex flex-col size-full p-2 lg:p-3 lg:w-(--ai-chat-width)">
            <AISearchPanelHeader />
            <AISearchPanelList className="flex-1" />
            <div className="rounded-xl border bg-fd-secondary text-fd-secondary-foreground shadow-sm has-focus-visible:shadow-md">
              <AISearchInput />
              <div className="flex items-center gap-1.5 p-1 empty:hidden">
                <AISearchInputActions />
              </div>
            </div>
          </div>
        </div>
      </Presence>
    </>
  );
}

export function AISearchPanelList({ className, style, ...props }: ComponentProps<'div'>) {
  const chat = useChatContext();
  const messages = chat.messages.filter((msg) => msg.role !== 'system');

  return (
    <List
      className={cn('py-4 overscroll-contain', className)}
      style={{
        maskImage:
          'linear-gradient(to bottom, transparent, white 1rem, white calc(100% - 1rem), transparent 100%)',
        ...style,
      }}
      {...props}
    >
      {messages.length === 0 ? (
        <div className="text-sm text-fd-muted-foreground/80 size-full flex flex-col items-center justify-center text-center gap-2">
          <MessageCircleIcon fill="currentColor" stroke="none" />
          <p onClick={(e) => e.stopPropagation()}>Start a new chat below.</p>
        </div>
      ) : (
        <div className="flex flex-col px-3 gap-4">
          {chat.error && (
            <div className="p-2 bg-fd-secondary text-fd-secondary-foreground border rounded-lg">
              <p className="text-xs text-fd-muted-foreground mb-1">
                Request Failed: {chat.error.name}
              </p>
              <p className="text-xs text-fd-muted-foreground mt-2">
                Contact{" "}
                <a
                  href="https://dc.vomlabs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Discord
                </a>{" "}
                or{" "}
                <a href="mailto:support@vomlabs.com" className="underline">
                  support@vomlabs.com
                </a>{" "}
                for help.
              </p>
              <p className="text-sm">{chat.error.message}</p>
            </div>
          )}
          {messages.map((item) => (
            <Message key={item.id} message={item} />
          ))}
        </div>
      )}
    </List>
  );
}

export function useHotKey() {
  const { open, setOpen } = useAISearchContext();

  const onKeyPress = useEffectEvent((e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      setOpen(false);
      e.preventDefault();
    }

    if (e.key === '/' && (e.metaKey || e.ctrlKey) && !open) {
      setOpen(true);
      e.preventDefault();
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress);
    return () => window.removeEventListener('keydown', onKeyPress);
  }, []);
}

export function useAISearchContext() {
  return use(Context)!;
}

function useChatContext() {
  return use(Context)!.chat;
}
