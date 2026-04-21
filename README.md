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

The system automatically:
- Detects which providers have API keys configured
- Shows only configured providers in the dropdown
- Falls back to the next key if quota is exceeded
- Shows a single provider name (not dropdown) when only one is available

### AI Feature

The AI chat feature is automatically enabled when at least one provider has an API key configured.

To disable AI completely, ensure all API key variables are empty.

## Project Structure

```
docs/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── chat/          # AI chat endpoint
│   ├── docs/             # Documentation pages
│   └── layout.tsx        # Root layout
├── components/
│   ├── ai/              # AI search component
│   ├── ui/              # UI components (dropdown, button)
│   └── markdown.tsx     # Markdown renderer
├── content/
│   └── docs/            # MDX documentation files
├── lib/
│   ├── shared.ts        # Shared config (providers, etc.)
│   └── source.ts        # Content source
├── source.config.ts     # FumaDocs config
└── package.json       # Dependencies
```

## Tech Stack

- **Framework**: Next.js 16
- **Docs**: FumaDocs 16
- **AI**: Vercel AI SDK 6
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

## License

Proprietary - All rights reserved by VOMLabs
