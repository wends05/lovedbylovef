# AI Agent Guidelines

This file provides instructions for AI agents working in this repository.

## Project Overview

TanStack Start application with React 19, TypeScript, Tailwind CSS v4, Prisma ORM, and Supabase Auth. Built with Bun as the package manager and runtime.

## Build/Lint/Test Commands

```bash
# Development
bun --bun run dev          # Start dev server on port 3000

# Building
bun --bun run build        # Production build
bun --bun run preview      # Preview production build

# Testing (Vitest)
bun --bun run test         # Run all tests
bun --bun run test -- path/to/file.test.ts    # Run single test file
bun --bun run test -- --reporter=verbose      # Verbose output

# Linting & Formatting (Biome)
bun --bun run lint         # Run Biome linter
bun --bun run format       # Format with Biome
bun --bun run check        # Run Biome check (lint + format)

# Database (Prisma)
bun --bun run db:generate  # Generate Prisma client
bun --bun run db:push      # Push schema changes
bun --bun run db:migrate   # Run migrations
bun --bun run db:studio    # Open Prisma Studio
bun --bun run db:seed      # Seed database
```

## Code Style Guidelines

### Imports
- **Use path aliases**: `@/components`, `@/lib/utils`, `@/hooks`, `@/features`
- Organize imports: React → External libs → Internal (`@/`) → Relative
- Biome auto-organizes imports on save (see `.vscode/settings.json`)

### Formatting
- **Tabs** for indentation (not spaces)
- **Double quotes** for strings
- Semicolons required
- 80-100 character line length (soft limit)

### Types
- Use explicit TypeScript types for function props and returns
- Use `type` for object definitions, `interface` for class-like contracts
- Zod schemas for form validation and API contracts (see `src/features/*/schemas/`)
- Strict TypeScript enabled with `noUnusedLocals` and `noUnusedParameters`

### Naming Conventions
- Components: **PascalCase** (e.g., `SignOutButton.tsx`)
- Utilities/hooks: **camelCase** (e.g., `use-mobile.ts`)
- Constants: **UPPER_SNAKE_CASE** for true constants
- Files match export name (default export = filename)

### React Patterns
- Default exports for page components and route files
- Named exports for utility functions and hooks
- Use React 19 features (current version in `package.json`)
- TanStack Router for routing with file-based routing in `src/routes/`
- TanStack Query for server state management
- React Compiler enabled via Babel plugin

### TanStack Start Patterns

#### Routes
```typescript
import { createFileRoute } from "@tanstack/react-router";
import { authMiddleware } from "@/features/auth/middleware";

export const Route = createFileRoute("/path")({
  server: { middleware: [authMiddleware] },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(queryOptions);
  },
  component: PageComponent,
});
```

#### Server Functions
```typescript
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const myServerFn = createServerFn()
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    // Server-side logic
  });
```

#### Query Options
```typescript
export const myQueryOptions = {
  getData: (id: string) =>
    queryOptions({
      queryKey: ["key", id],
      queryFn: () => getData({ data: { id } }),
    }),
};
```

### Styling
- Tailwind CSS v4 with `@import` syntax (see `src/styles.css`)
- Use `cn()` utility from `@/lib/utils` for conditional classes
- CSS variables for theme colors (pink/romantic theme)
- Base UI components from `@base-ui/react`
- Shadcn UI pattern with `class-variance-authority` for variants

### Error Handling
- Use Error boundaries via TanStack Router (`errorComponent`)
- Async functions should handle errors explicitly or use error boundaries
- Prefer early returns with descriptive error messages
- Server functions: validate with Zod before processing

### Database & Auth
- Prisma ORM with PostgreSQL
- Supabase Auth for authentication
- Server functions for data fetching (TanStack Start pattern)
- Middleware for route protection (`authMiddleware`, `adminMiddleware`)

### File Structure
```
src/
  components/       # UI components
  components/ui/    # shadcn/ui base components
  features/         # Feature-based modules
    feature-name/
      components/   # Feature-specific components
      schemas/      # Zod validation schemas
      server.ts     # Server functions
      options.ts    # TanStack Query options
  hooks/            # Custom React hooks
  integrations/     # Third-party integrations (Supabase, etc.)
  lib/              # Utilities and config
    utils.ts        # cn() helper
    prisma-client.ts # Prisma singleton
  routes/           # TanStack Router routes
  generated/        # Auto-generated files (Prisma)
```

### VS Code Settings
- Biome is the default formatter for all file types
- Import organization on save enabled
- `routeTree.gen.ts` is read-only and excluded from search

### Environment
- Use `.env.local` for local secrets (not committed)
- Required env vars: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

## Testing (Vitest)

No existing test files found. When adding tests:
- Place test files next to source files or in `__tests__/` directories
- Use `bun --bun run test -- path/to/file` for single test runs
- React Testing Library and jsdom are configured
- Example test structure:
```typescript
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

## Additional Notes

- Prisma client is generated to `src/generated/prisma/`
- Route files are auto-generated in `src/routeTree.gen.ts` (do not edit manually)
- Use `bun --bun` prefix for all commands to ensure Bun runtime
- The project uses Bun as both package manager and runtime
