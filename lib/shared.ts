export const appName = "VOMLabs";
export const docsRoute = "/docs";
export const docsImageRoute = "/og/docs";
export const docsContentRoute = "/llms.mdx/docs";

const hasOpenRouter = !!process.env.OPENROUTER_API_KEY;
const hasGoogle = !!process.env.GOOGLE_API_KEY;
const hasOpenAI = !!process.env.OPENAI_API_KEY;

export const availableProviders: string[] = [];

if (hasOpenRouter) availableProviders.push("openrouter");
if (hasGoogle) availableProviders.push("google");
if (hasOpenAI) availableProviders.push("openai");

export const enableAI = availableProviders.length > 0;
export const gitConfig = {
  user: "VOMLabs",
  repo: "docs",
  branch: "main",
};
