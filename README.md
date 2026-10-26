# LovedbyLovef

LovedbyLovef is a custom crochet request and order platform with role-based
user and admin workflows.

## Why This Project

This project was built to explore a modern full-stack setup using Prisma 7 and
TanStack Start, while implementing real product flows like request review,
order lifecycle management, and chat coordination.

It also serves as a reference project for future builds, especially for
feature-oriented architecture decisions.

> Owner note: This project is for learning purposes, and actual production and use of this platform is a separate purpose. To check out the web application and order crochets yourself, visit [the site](https://lovedbylovef.vercel.app) or the [instagram page](https://www.instagram.com/_lovedbylovef).

## AI Workflow

> Owner note: I want to be as transparent as possible on the use of AI on the things that I do, so I'm keeping this section up-to-date with the tools and prompts I'm using as I work on the maintenance of this application.

AI was part of the implementation workflow, not the product itself:

- Kimi K2.5 via OpenCode
- GPT-5.3 Codex via Codex app
- Claude Sonnet 5.5 via Claude Desktop
- [skills.sh](https://skills.sh) for better agent prompt quality and consistency

## Core Features

- User and admin role separation
- Request lifecycle (create, review, approve/reject/cancel)
- Order lifecycle (pending, processing, delivered, canceled visibility)
- Order-linked chat between customer and admin
- User and admin dashboards with KPI + recent activity views
- Role-aware request detail page with order actions for both customer and admin
- Admin-managed crochet gallery shown on the public site
- Supabase-backed auth, storage, and realtime integration

## Tech Stack

- TanStack Start (Router, Query, Form, Table, Pacer)
- Supabase (Auth, Storage, Realtime)
- shadcn/ui
- React 19
- Prisma 7
- PostgreSQL
- Tailwind CSS v4
- Vite 8 with the React Compiler
- Nitro (Vercel preset, Bun runtime)
- Bun
- Zod
- Biome
- Vitest

## Architecture Notes

This repository leans toward a feature-based structure for business domains
(`requests`, `orders`, `chat`, `dashboard`, etc.), with each feature owning
its internal layers (`components`, `schemas`, `server`, `options`).

This differs from a pure layer-first layout where all components/hooks/lib are
grouped globally. The intent is to make feature behavior easier to evolve and
reuse as a pattern in future projects.

## Project Structure

```txt
prisma/
src/
  components/
    icons/
    ui/
  features/
    admin/
    auth/
    chat/
    dashboard/
    orders/
    public/
    requests/
    storage/
  hooks/
  integrations/
    supabase/
    tanstack-form/
    tanstack-query/
  lib/
  routes/
```

## Getting Started

### Prerequisites

- Bun
- PostgreSQL database
- Supabase project (auth, storage, realtime)

### Environment Variables

Copy `.env.example` to `.env` and provide:

- `DATABASE_URL`: Supabase pooler connection string, used by the app at runtime
- `DIRECT_URL`: direct (non-pooled) connection string, used by the Prisma CLI
  for `db:push`, `db:migrate`, and `db:studio`
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_KEY`: Supabase anon (public) key

`VITE_*` values are bundled into the browser. Never put the service-role key in
them.

### Install and Run

```bash
bun install
bun --bun run db:generate
bun --bun run db:push
bun --bun run dev
```

The dev server runs at `http://localhost:3000`.

### Database Commands

```bash
bun --bun run db:generate
bun --bun run db:push
bun --bun run db:migrate
bun --bun run db:studio
bun --bun run db:seed
```

## Scripts

| Category | Command                     | Description                                           |
| -------- | --------------------------- | ----------------------------------------------------- |
| Dev      | `bun --bun run dev`         | Start local development server                        |
| Build    | `bun --bun run build`       | Build for production                                  |
| Preview  | `bun --bun run serve`       | Preview production build                              |
| Start    | `bun run start`             | Run the built server from `.output/`                  |
| Test     | `bun --bun run test`        | Run Vitest (no tests yet)                             |
| Format   | `bun --bun run format`      | Run Biome formatter                                   |
| Lint     | `bun --bun run lint`        | Run Biome lint                                        |
| Check    | `bun --bun run check`       | Run Biome check                                       |
| DB       | `bun --bun run db:generate` | Generate Prisma client                                |
| DB       | `bun --bun run db:push`     | Push schema to database                               |
| DB       | `bun --bun run db:migrate`  | Run Prisma migrations                                 |
| DB       | `bun --bun run db:studio`   | Open Prisma Studio                                    |
| DB       | `bun --bun run db:seed`     | Seed database (needs `prisma/seed.ts`, not yet added) |

## Credits

Created for LovedbyLovef, with implementation support from modern AI coding
workflows and the open-source tooling ecosystem used in this stack.
