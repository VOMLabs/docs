# VOMLabs Documentation

Official documentation site for [VOMLabs](https://vomlabs.com). Built with [FumaDocs](https://fumadocs.dev) and [Next.js](https://nextjs.org).

## Features

- **Documentation Site** - Full-featured docs with search, versioning, and MDX support
- **AI Chat Assistant** - Built-in AI chatbot that can answer questions about the documentation using:
  - Google Gemini
  - OpenRouter
  - OpenAI
- **Multi-Provider Support** - Fallback API keys when quota is exceeded
- **Dark Mode** - Optimized dark theme (#010101 background)
- **Responsive Design** - Works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- Bun (recommended) or npm/pnpm

### Installation

```bash
bun install
```

### Development

```bash
bun run dev
```

Open http://localhost:3000 to view the documentation.

### Build for Production

```bash
bun run build
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# OpenRouter - comma-separated for fallback keys
OPENROUTER_API_KEY=key1,key2,key3
OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Google Gemini - comma-separated for fallback keys
GOOGLE_API_KEY=key1,key2,key3
GOOGLE_MODEL=gemini-2.5-flash

# OpenAI - comma-separated for fallback keys
OPENAI_API_KEY=key1,key2,key3
OPENAI_MODEL=gpt-4o-mini
```
Read the [Introduction](https://fumadocs.dev/docs/mdx) for further details.

## Learn More

To learn more about Next.js and Fumadocs, take a look at the following
resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Fumadocs](https://fumadocs.dev) - learn about Fumadocs
