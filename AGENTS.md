# AI Agent Guidelines

This file provides instructions for AI agents working in this repository.

## Project Overview

LovedbyLovef is a custom crochet request and order platform (user and admin
roles). It is a TanStack Start application with React 19, TypeScript, Tailwind
CSS v4, Prisma 7 (PostgreSQL), and Supabase (Auth, Storage, Realtime). Bun is
the package manager an◊d runtime. It deploys through Nitro (Vercel preset, Bun
runtime).

## Build/Lint/Test Commands

```bash
# Development
bun --bun run dev          # Start dev server (Vite default, http://localhost:5173)

# Building
bun --bun run build        # Production build (outputs to .output/)
bun --bun run serve        # Preview production build
bun run start              # Run the built server (.output/server/index.mjs)

# Testing (Vitest)
bun --bun run test         # Run all tests (vitest run)
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
bun --bun run db:seed      # Seed database (see note below)
```

`prisma.config.ts` points the seed command at `prisma/seed.ts`, which does not
exist yet. `db:seed` fails until that file is added.

## Code Style Guidelines

### Imports

- **Use path aliases**: `@/components`, `@/lib/utils`, `@/hooks`, `@/features`,
  `@/integrations`
- Organize imports: React → External libs → Internal (`@/`) → Relative
- Biome auto-organizes imports on save (see `.vscode/settings.json`)

### Formatting

- **Tabs** for indentation (not spaces)
- **Double quotes** for strings
- Semicolons required
- 80-100 character line length (soft limit)
- Biome only covers `src/`, `.vscode/`, `index.html`, and `vite.config.ts`. It
  skips `src/routeTree.gen.ts`, `src/styles.css`, and `src/generated/`.

### Types

- Use explicit TypeScript types for function props and returns
- Use `type` for object definitions, `interface` for class-like contracts
- Zod schemas for form validation and API contracts (see `src/features/*/schemas/`;
  the chat feature uses `schema/`)
- Strict TypeScript enabled with `noUnusedLocals` and `noUnusedParameters`
- TypeScript 7 is in use; check the installed version before using newer syntax
  or compiler options

### Naming Conventions

- Components: **PascalCase** (e.g., `SignOutButton.tsx`)
- Utilities/hooks: **camelCase** (e.g., `useRealtimeChat.ts`). `src/hooks/` also
  contains kebab-case files such as `use-mobile.ts`; match the surrounding
  directory.
- Constants: **UPPER_SNAKE_CASE** for true constants
- Files match export name (default export = filename)

### React Patterns

- Default exports for page components and route files
- Named exports for utility functions and hooks
- Use React 19 features (current version in `package.json`)
- Do not add `"use client"` directives. TanStack Start does not use them.
- TanStack Router for routing with file-based routing in `src/routes/`
- TanStack Query for server state management
- React Compiler is enabled in `vite.config.ts` through
  `@rolldown/plugin-babel` with `reactCompilerPreset()`. Do not add manual
  `useMemo`/`useCallback` for performance.

### TanStack Start Patterns

#### Routes

```typescript
import { createFileRoute } from "@tanstack/react-router";
import { nonAdminMiddleware } from "@/features/auth/middleware";

export const Route = createFileRoute("/path")({
  server: { middleware: [nonAdminMiddleware] },
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(queryOptions);
  },
  component: PageComponent,
});
```

Middleware is applied on layout routes, so child routes inherit it:
`_protected` uses `nonAdminMiddleware` and `admin` uses `adminMiddleware`.

#### Server Functions

```typescript
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const myServerFn = createServerFn()
  .middleware([authMiddleware])
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }) => {
    // Server-side logic
  });
```

Use `.validator(...)`. `.inputValidator(...)` was removed in the current
TanStack Start releases.

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
- CSS variables for theme colors (pink/romantic theme, defined in `src/styles.css`)
- Base UI components from `@base-ui/react`
- Shadcn UI pattern with `class-variance-authority` for variants
- `Button` defaults `nativeButton` to `false` when `render` is set. Pass
  `nativeButton` explicitly when you render a real `<button>`.
- lucide-react 1.x has no brand icons. Use `@icons-pack/react-simple-icons` or
  a component in `src/components/icons/`.

### Error Handling

- Use Error boundaries via TanStack Router (`errorComponent`)
- Async functions should handle errors explicitly or use error boundaries
- Prefer early returns with descriptive error messages
- Server functions: validate with Zod before processing
- `tryCatch` in `src/lib/try-catch.ts` wraps async calls and returns
  `{ data, error, success }` instead of throwing

### Database & Auth

- Prisma ORM with PostgreSQL, using the `@prisma/adapter-pg` driver adapter
  (`src/lib/prisma-client.ts`)
- The datasource has no `url` in `prisma/schema.prisma`. The Prisma CLI reads it
  from `prisma.config.ts` (`DIRECT_URL`); the app reads `DATABASE_URL` at
  runtime.
- Supabase Auth for authentication, Supabase Storage for images, Supabase
  Realtime for order chat
- Server functions for data fetching (TanStack Start pattern)
- Middleware for route protection in `src/features/auth/middleware.ts`:
  `authMiddleware` (signed in), `adminMiddleware` (ADMIN only), and
  `nonAdminMiddleware` (signed in, redirects ADMIN to `/admin/dashboard`)
- Roles are `USER` and `ADMIN` (`Role` enum). Request and order statuses are
  Prisma enums (`RequestStatus`, `OrderStatus`).

### File Structure

```
src/
  components/       # Shared UI components
  components/ui/    # shadcn/ui base components
  components/icons/ # Custom icon components
  features/         # Feature-based modules
    admin/          # Admin dashboard, gallery, request management
    auth/           # Sign in/up, middleware
    chat/           # Order-linked chat (Supabase Realtime)
    dashboard/      # User dashboard and requests
    orders/         # Order lifecycle (admin/ and user/ subfolders)
    public/         # Landing, gallery, contact pages
    requests/       # Request detail, edit, status
    storage/        # Image upload/replace helpers
    feature-name/
      components/   # Feature-specific components
      schemas/      # Zod validation schemas
      server.ts     # Server functions
      options.ts    # TanStack Query options
  hooks/            # Custom React hooks
  integrations/     # Third-party integrations
    supabase/       # Browser/server clients, storage helpers
    tanstack-form/  # Shared form hooks and field components
    tanstack-query/ # Query client provider and devtools
  lib/              # Utilities and config
    utils.ts        # cn() helper
    prisma-client.ts # Prisma singleton
  routes/           # TanStack Router routes
  generated/        # Auto-generated files (Prisma)
```

### Routes

- Public: `/`, `/gallery`, `/contact`
- Auth: `/signin`, `/signup`
- Signed-in users: `/dashboard`, `/requests`, `/orders`, `/create-request`
- Shared detail pages: `/request/$id`, `/order/$id`, `/chat/$orderId`
- Admin: `/admin/dashboard`, `/admin/requests`, `/admin/orders`,
  `/admin/gallery` (plus `/create` and `/$id/edit`)

### VS Code Settings

- Biome is the default formatter for all file types
- Import organization on save enabled
- `routeTree.gen.ts` is read-only and excluded from search

### Environment

- Copy `.env.example` to `.env`. `dotenv/config` and Vite read `.env`, and `.env`
  is gitignored.
- Required env vars:
  - `DATABASE_URL`: Supabase pooler connection string, used by the app at runtime
  - `DIRECT_URL`: direct (non-pooled) connection string, used by the Prisma CLI
    for `db:push`, `db:migrate`, and `db:studio`
  - `VITE_SUPABASE_URL`: Supabase project URL
  - `VITE_SUPABASE_KEY`: Supabase anon (public) key
- `VITE_*` values are bundled into the browser. Never put the service-role key
  in them.

## Testing (Vitest)

No test files exist yet. Vitest has no separate config, so it reads
`vite.config.ts`. When adding tests:

- Place test files next to source files or in `__tests__/` directories
- Use `bun --bun run test -- path/to/file` for single test runs
- `jsdom` and React Testing Library are installed but not wired up. Add
  `// @vitest-environment jsdom` to a component test file, or set
  `test.environment` in the Vite config.
- `@testing-library/jest-dom` is not installed, so `toBeInTheDocument` is
  unavailable. Use `getBy*` queries, which throw when nothing matches.
- Example test structure:

```typescript
// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeTruthy();
  });
});
```

## Additional Notes

- Prisma client is generated to `src/generated/prisma/` (import from
  `generated/prisma/client.js`). Regenerate with `db:generate` after schema
  changes.
- Route files are auto-generated in `src/routeTree.gen.ts` (do not edit manually)
- Use `bun --bun` prefix for all commands to ensure Bun runtime
- The project uses Bun as both package manager and runtime
- `.cta.json` is the original TanStack scaffold record. Its add-on list
  (`better-auth`, `mcp`, `events`) does not describe the current stack; auth is
  Supabase.
