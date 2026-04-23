import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createDeepSeek } from "@ai-sdk/deepseek";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { source } from "@/lib/source";
import { Document, type DocumentData } from "flexsearch";

interface CustomDocument extends DocumentData {
  url: string;
  title: string;
  description: string;
  content: string;
}

export type ChatUIMessage = UIMessage<
  never,
  {
    client: {
      location: string;
    };
    provider?: string;
  }
>;

export type AIProvider = "openrouter" | "google" | "openai" | "anthropic" | "deepseek" | "ollama" | "lmstudio";

const providerConfigs: Record<AIProvider, { model: string; apiKey: string }> = {
  openrouter: {
    model: process.env.OPENROUTER_MODEL ?? "anthropic/claude-3.5-sonnet",
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
  },
  google: {
    model: process.env.GOOGLE_MODEL ?? "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_API_KEY ?? "",
  },
  openai: {
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    apiKey: process.env.OPENAI_API_KEY ?? "",
  },
  anthropic: {
    model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
    apiKey: process.env.ANTHROPIC_API_KEY ?? "",
  },
  deepseek: {
    model: process.env.DEEPSEEK_MODEL ?? "deepseek-chat",
    apiKey: process.env.DEEPSEEK_API_KEY ?? "",
  },
  ollama: {
    model: process.env.OLLAMA_MODEL ?? "llama3",
    apiKey: "",
  },
  lmstudio: {
    model: process.env.LMSTUDIO_MODEL ?? "lmstudio-ai/llama-3.1-8b",
    apiKey: "",
  },
};

const searchServer = createSearchServer();

async function createSearchServer() {
  const search = new Document<CustomDocument>({
    document: {
      id: "url",
      index: ["title", "description", "content"],
      store: true,
    },
  });

  const docs = await chunkedAll(
    source.getPages().map(async (page) => {
      if (!("getText" in page.data)) return null;

      const data = page.data as unknown as {
        getText?: (type: "raw" | "processed") => Promise<string>;
        title: string;
        description: string;
      };
      if (typeof data.getText !== "function") return null;

      return {
        title: data.title,
        description: data.description,
        url: page.url,
        content: await data.getText("processed"),
      } as CustomDocument;
    }),
  );

  for (const doc of docs) {
    if (doc) search.add(doc);
  }

  return search;
}

async function chunkedAll<O>(promises: Promise<O>[]): Promise<O[]> {
  const SIZE = 50;
  const out: O[] = [];
  for (let i = 0; i < promises.length; i += SIZE) {
    out.push(...(await Promise.all(promises.slice(i, i + SIZE))));
  }
  return out;
}

const openrouterApiKeys = (process.env.OPENROUTER_API_KEY ?? "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);
const googleApiKeys = (process.env.GOOGLE_API_KEY ?? "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);
const openaiApiKeys = (process.env.OPENAI_API_KEY ?? "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);
const anthropicApiKeys = (process.env.ANTHROPIC_API_KEY ?? "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);
const deepseekApiKeys = (process.env.DEEPSEEK_API_KEY ?? "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean);
const ollamaBaseUrl = process.env.OLLAMA_BASE_URL ?? "http://localhost:11434";
const lmstudioBaseUrl = process.env.LMSTUDIO_BASE_URL ?? "http://localhost:1234/v1";

async function createOpenRouterWithFallback(index = 0) {
  return createOpenRouter({
    apiKey: openrouterApiKeys[index],
  });
}

async function createGoogleWithFallback(index = 0) {
  return createGoogleGenerativeAI({
    apiKey: googleApiKeys[index],
  });
}

async function createOpenAIWithFallback(index = 0) {
  return createOpenAI({
    apiKey: openaiApiKeys[index],
  });
}
async function createAnthropicWithFallback(index = 0) {
  return createAnthropic({
    apiKey: anthropicApiKeys[index],
  });
}

async function createDeepSeekWithFallback(index = 0) {
  return createDeepSeek({
    apiKey: deepseekApiKeys[index],
  });
}

function createOllama() {
  return createOpenAI({
    baseURL: `${ollamaBaseUrl}/api`,
    apiKey: "ollama",
  });
}

function createLMStudio() {
  return createOpenAI({
    baseURL: `${lmstudioBaseUrl}`,
    apiKey: "lm-studio",
  });
}

/** System prompt, you can update it to provide more specific information */
const systemPrompt = [
  "You are an AI assistant for a documentation site of vomlabs.com!",
  "Use the `search` tool to retrieve relevant docs context before answering when needed.",
  "The `search` tool returns raw JSON results from documentation. Use those results to ground your answer and cite sources as markdown links using the document `url` field when available.",
  "If you cannot find the answer in search results, say you do not know an answer to that question and suggest a better search query.",
].join("\n");

export async function GET() {
  const providers = [];
  if (openrouterApiKeys.length > 0) providers.push("openrouter");
  if (googleApiKeys.length > 0) providers.push("google");
  if (openaiApiKeys.length > 0) providers.push("openai");
  if (anthropicApiKeys.length > 0) providers.push("anthropic");
  if (deepseekApiKeys.length > 0) providers.push("deepseek");
  if (process.env.OLLAMA_MODEL) providers.push("ollama");
  if (process.env.LMSTUDIO_MODEL) providers.push("lmstudio");
  return Response.json({ providers });
}

async function getModelWithFallback(providerType: AIProvider, apiKeys: string[]) {
  const config = providerConfigs[providerType];
  const modelId = config.model;

  const localProviders = ["ollama", "lmstudio"];
  if (localProviders.includes(providerType)) {
    try {
      const model =
        providerType === "ollama"
          ? createOllama().chat(modelId)
          : createLMStudio().chat(modelId);
      return model;
    } catch (err) {
      console.log(`Local provider ${providerType} failed:`, err);
      throw new Error(`${providerType} not available. Make sure it's running.`);
    }
  }

  if (apiKeys.length === 0) {
    throw new Error(`No API keys configured for ${providerType}`);
  }
  
  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    if (!apiKey) continue;
    
    try {
      const model =
        providerType === "openrouter"
          ? (await createOpenRouterWithFallback(i)).chat(modelId)
          : providerType === "google"
            ? (await createGoogleWithFallback(i)).chat(modelId)
            : providerType === "openai"
              ? (await createOpenAIWithFallback(i)).chat(modelId)
              : providerType === "anthropic"
                ? (await createAnthropicWithFallback(i)).chat(modelId)
                : (await createDeepSeekWithFallback(i)).chat(modelId);
      return model;
    } catch (err) {
      console.log(`API key ${i + 1} failed for ${providerType}, trying next...`);
      if (i === apiKeys.length - 1) {
        throw err;
      }
    }
  }
  throw new Error(`No valid API keys for ${providerType}`);
}

export async function POST(req: Request, _ctx: RouteContext<"/api/chat">) {
  const reqJson = await req.json();
  const providerType = (reqJson.provider as AIProvider) ?? "google";

  let apiKeys: string[] = [];
  switch (providerType) {
    case "openrouter":
      apiKeys = openrouterApiKeys;
      break;
    case "google":
      apiKeys = googleApiKeys;
      break;
    case "openai":
      apiKeys = openaiApiKeys;
      break;
    case "anthropic":
      apiKeys = anthropicApiKeys;
      break;
    case "deepseek":
      apiKeys = deepseekApiKeys;
      break;
  }
  console.log("Provider:", providerType, "Available keys:", apiKeys.length);

    try {
    const model = await getModelWithFallback(providerType, apiKeys);
    const result = streamText({
      model,
      stopWhen: stepCountIs(5),
      tools: {
        search: searchTool,
      },
      messages: [
        { role: "system", content: systemPrompt },
        ...(await convertToModelMessages<ChatUIMessage>(reqJson.messages ?? [], {
          convertDataPart(part) {
            if (part.type === "data-client")
              return {
                type: "text",
                text: `[Client Context: ${JSON.stringify(part.data)}]`,
              };
          },
        })),
      ],
      toolChoice: "auto",
    });
    return result.toUIMessageStreamResponse();
  } catch (e: unknown) {
    console.error("Chat error:", e);
    const err = e as { message?: string; name?: string };
    return Response.json(
      { error: { name: err.name ?? "Error", message: err.message ?? String(e) } },
      { status: 500 }
    );
  }
}

export type SearchTool = typeof searchTool;

const searchTool = tool({
  description: "Search the docs content and return raw JSON results.",
  inputSchema: z.object({
    query: z.string(),
    limit: z.number().int().min(1).max(100).default(10),
  }),
  async execute({ query, limit }) {
    const search = await searchServer;
    return await search.searchAsync(query, {
      limit,
      merge: true,
      enrich: true,
    });
  },
});
