import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
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

export type AIProvider = "openrouter" | "google" | "openai";

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

      return {
        title: page.data.title,
        description: page.data.description,
        url: page.url,
        content: await page.data.getText("processed"),
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
  return Response.json({ providers });
}

const MAX_FALLBACK_RETRIES = 3;

async function getModelWithFallback(providerType: AIProvider, apiKeys: string[]) {
  const config = providerConfigs[providerType];
  const modelId = config.model;

  for (let i = 0; i < apiKeys.length; i++) {
    const apiKey = apiKeys[i];
    if (!apiKey) continue;
    
    try {
      let model;
      switch (providerType) {
        case "openrouter":
          model = (await createOpenRouterWithFallback(i)).chat(modelId);
          break;
        case "google":
          model = (await createGoogleWithFallback(i)).chat(modelId);
          break;
        case "openai":
          model = (await createOpenAIWithFallback(i)).chat(modelId);
          break;
      }
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

export async function POST(req: Request, ctx: RouteContext<"/api/chat">) {
  const reqJson = await req.json();
  const providerType = (reqJson.provider as AIProvider) ?? "google";

  const apiKeys =
    providerType === "openrouter"
      ? openrouterApiKeys
      : providerType === "google"
        ? googleApiKeys
        : openaiApiKeys;

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
