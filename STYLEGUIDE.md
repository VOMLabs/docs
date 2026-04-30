# Style Guide

This project follows [Google's Style Guides](https://google.github.io/styleguide/) adapted for TypeScript, React, and Next.js development.

## Tools

This project uses [Biome](https://biomejs.dev/) for formatting and linting. Configuration is in `biome.json`.

Run styling checks:
```bash
bun run style        # Check and fix all files
bun run style:check  # Check only, no fixes
```

## General Rules

### File Structure
- Use kebab-case for file names: `theme-keyboard-shortcut.tsx`
- Use PascalCase for React components: `ThemeKeyboardShortcut`
- Use camelCase for variables, functions, and instances

### Line Length
- Maximum line length: 80 characters (Google standard)
- Exception: URLs, import paths, and generated code

### Indentation
- Use 2 spaces for indentation (Google JavaScript style)
- No tabs

### Semicolons
- Use semicolons at the end of statements (Google style)

### Quotes
- Use double quotes for strings (Google JavaScript style)
- Exception: JSX attributes use double quotes per React conventions

## TypeScript

### Types
- Prefer `interface` over `type` for object shapes (Google style)
- Use `type` for unions, intersections, and mapped types
- Explicitly type function parameters and return types

```typescript
interface User {
  name: string;
  email: string;
}

type Status = "active" | "inactive";

function getUser(id: string): Promise<User> {
  return fetchUser(id);
}
```

### Imports
- Group imports in order:
  1. React and Next.js
  2. External libraries
  3. Internal components (`@/`)
  4. Styles and types
- Use absolute imports with `@/` prefix for internal modules

```typescript
import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import "./styles.css";
```

## React / JSX

### Component Definition
- Use function declarations for components (not arrow functions)
- Name components using PascalCase

```typescript
export function MyComponent() {
  return <div>Hello</div>;
}
```

### JSX Formatting
- Self-closing tags: `<Component />`
- Multi-line JSX: open and close tags on separate lines
- Props: one per line when exceeding line length

```typescript
<Component
  propOne="value"
  propTwo="value"
>
  Content
</Component>
```

### Hooks
- Always call hooks at the top level
- Prefix custom hooks with `use`

## CSS / Tailwind

### Class Names
- Use `cn()` utility for conditional classes
- Break long class strings across multiple lines

```typescript
<div
  className={cn(
    "flex items-center justify-between",
    isActive && "bg-fd-muted",
    className,
  )}
>
```

## Comments

### When to Comment
- Document non-obvious code behavior
- Explain complex business logic
- TODO comments: `// TODO(username): description`

### Format
- Use single-line comments: `// comment`
- JSDoc for exported functions and interfaces

```typescript
/**
 * Fetches user data from the API.
 * @param id - The user ID
 * @returns Promise resolving to user data
 */
export function getUser(id: string): Promise<User> {
  // Implementation
}
```

## Naming Conventions

| Entity | Convention | Example |
|--------|------------|---------|
| Variables | camelCase | `userName` |
| Functions | camelCase | `getUserInfo` |
| Components | PascalCase | `UserProfile` |
| Interfaces | PascalCase | `UserConfig` |
| Types | PascalCase | `UserStatus` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Files (components) | kebab-case | `user-profile.tsx` |
| Files (utils) | kebab-case | `format-date.ts` |

## Error Handling

- Use try-catch for async operations
- Return error states, don't throw in components
- Log errors appropriately

```typescript
try {
  const data = await fetchData();
  return data;
} catch (error) {
  console.error("Failed to fetch data:", error);
  return null;
}
```

## Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

Examples:
feat(docs): add dark mode toggle
fix(layout): correct navbar alignment
style: format code with biome
refactor(theme): simplify keyboard shortcut logic
```
