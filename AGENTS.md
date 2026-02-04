# AI Agent Guidelines

This file provides instructions for AI agents working in this repository.

## Project Overview

TanStack Start application with React, TypeScript, Tailwind CSS v4, Prisma ORM, and Better Auth. Built with Bun as the package manager and runtime.

## Build/Lint/Test Commands

```bash
# Development
bun --bun run dev          # Start dev server on port 3000

# Building
bun --bun run build        # Production build
bun --bun run preview      # Preview production build

# Testing
bun --bun run test         # Run all tests with Vitest
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
- **Use path aliases**: `@/components`, `@/lib/utils`, `@/hooks`
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
- Zod schemas for form validation and API contracts (see `src/features/auth/schemas/`)
- Strict TypeScript enabled with `noUnusedLocals` and `noUnusedParameters`

### Naming Conventions
- Components: **PascalCase** (e.g., `SignOutButton.tsx`)
- Utilities/hooks: **camelCase** (e.g., `useIsMobile.ts`)
- Constants: **UPPER_SNAKE_CASE** for true constants
- Files match export name (default export = filename)

### React Patterns
- Default exports for page components and route files
- Named exports for utility functions and hooks
- Use React 19 features (current version in `package.json`)
- TanStack Router for routing with file-based routing in `src/routes/`
- TanStack Query for server state management

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
- Better Auth for authentication with custom middleware in `src/features/auth/`
- Server functions for data fetching (TanStack Start pattern)

### File Structure
```
src/
  components/       # UI components
  components/ui/    # shadcn/ui base components
  features/         # Feature-based modules
  hooks/            # Custom React hooks
  integrations/     # Third-party integrations
  lib/              # Utilities and config
  routes/           # TanStack Router routes
  generated/        # Auto-generated files (Prisma)
```

### VS Code Settings
- Biome is the default formatter for all file types
- Import organization on save enabled
- `routeTree.gen.ts` is read-only and excluded from search

### Environment
- Use `.env.local` for local secrets (not committed)
- Required env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `UPLOADTHING_TOKEN`

## Testing (Vitest)

No existing test files found. When adding tests:
- Place test files next to source files or in `__tests__/` directories
- Use `bun --bun run test -- path/to/file` for single test runs
- React Testing Library and jsdom are configured
