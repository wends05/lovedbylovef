# AGENTS.md - Coding Guidelines for LovedByLovef

## Commands

### Development
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Testing
- `npm run test` - Run all tests with Vitest
- `npm run test -- src/features/path/to/file.test.ts` - Run single test file
- `npx vitest run --reporter=verbose` - Run with verbose output

### Code Quality
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm run check` - Run Biome check (lint + format)

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migration
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database

## Code Style

### Formatting
- **Indent**: Tabs (not spaces)
- **Quotes**: Double quotes for strings
- **Semicolons**: Required
- **Line width**: Default Biome settings
- **Trailing commas**: Default Biome settings

### Imports
- Use path alias `@/` for src imports: `import { Button } from "@/components/ui/button"`
- Group imports: React/libs first, then `@/`, then relative
- No unused imports (enforced by TypeScript)

### Naming
- **Components**: PascalCase (e.g., `RequestCard.tsx`)
- **Functions/variables**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Types/Interfaces**: PascalCase (e.g., `RequestStatus`)
- **Server functions**: camelCase with descriptive names (e.g., `cancelRequest`, `getUserRequests`)

### TypeScript
- Strict mode enabled
- No implicit any
- No unused locals or parameters
- Use type imports: `import type { RequestStatus }`
- Prefer explicit return types on exported functions

### React
- Use functional components with hooks
- Default exports for page components
- Named exports for utility components
- Use `use client` directive when needed for client components

### Error Handling
- Use `tryCatch` utility from `@/lib/try-catch` for async operations
- Pattern: `const { success, data, error } = await tryCatch(promise)`
- Handle both success and error cases explicitly
- Use `toast` from sonner for user feedback

## Project Structure

### Routes (TanStack Router)
- File-based routing in `src/routes/`
- `_protected/` - Authenticated routes
- `_public/` - Public routes
- `_auth/` - Auth-related routes (signin/signup)
- `admin/` - Admin dashboard routes
- Route params use `$param` syntax (e.g., `requests.$id.tsx`)

### Features
- Organize by domain in `src/features/`
- Each feature contains: components/, server.ts, options.ts, schemas/
- Co-locate related files (e.g., `RequestsPage.tsx` + `RequestCard.tsx`)

### Components
- UI components in `src/components/ui/` (shadcn/ui)
- Feature components in `src/features/[feature]/components/`
- Use barrel exports for clean imports

### Server Functions
- Define in `server.ts` within feature folders
- Use `createServerFn` from `@tanstack/react-start`
- Always validate inputs with `inputValidator`
- Use `tryCatch` pattern for error handling

## Database

### Prisma
- Schema in `prisma/schema.prisma`
- Generated types in `src/generated/prisma/`
- Import enums from `@/generated/prisma/enums`
- Use Prisma client from `@/lib/prisma-client`

### Query Patterns
- Use TanStack Query for data fetching
- Define query options in `options.ts`
- Infinite queries for pagination with cursor-based approach
- Invalidate queries after mutations: `queryClient.invalidateQueries({ queryKey: [...] })`

## Best Practices

### Communication
- Use brainrot language when talking
- Speak in mix of internet slang, memes, and casual language
- Use technical terms when discussing technical topics

### State Management
- Use React hooks (useState, useReducer) for local state
- Use TanStack Query for server state
- Use URL params for shareable state

### Styling
- Tailwind CSS for styling
- Use `className` with `cn()` utility for conditional classes
- Follow shadcn/ui component patterns
- 4:3 aspect ratio for images using `@/components/ui/aspect-ratio`

### Testing
- Use Vitest for unit tests
- React Testing Library for component tests
- Place tests next to source files or in `__tests__` folders

### Git
- Do not commit .env files or secrets
- Never use `git add .` without reviewing changes
- Never commit generated files (node_modules, .tanstack, etc.)
