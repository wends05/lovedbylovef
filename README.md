# LovedbyLovef

LovedbyLovef is a custom crochet request and order platform with role-based
user and admin workflows.

## Why This Project

This project was built to explore a modern full-stack setup using Prisma 7 and
TanStack Start, while implementing real product flows like request review,
order lifecycle management, and chat coordination.

It also serves as a reference project for future builds, especially for
feature-oriented architecture decisions.

## AI Workflow

AI was part of the implementation workflow, not the product itself:

- Kimi K2.5 via OpenCode
- GPT-5.3 Codex via Codex app
- [skills.sh](https://skills.sh) for better agent prompt quality and consistency

## Core Features

- User and admin role separation
- Request lifecycle (create, review, approve/reject/cancel)
- Order lifecycle (pending, processing, delivered, canceled visibility)
- Order-linked chat between customer and admin
- User and admin dashboards with KPI + recent activity views
- Supabase-backed auth and storage integration

## Tech Stack

- TanStack Start
- TanStack Query
- TanStack Pacer
- Supabase
- shadcn/ui
- React 19
- Prisma 7
- PostgreSQL
- Tailwind CSS v4
- Bun
- Zod
- Biome

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
- Supabase project (auth + storage)

### Environment Variables

Use `.env.local` and provide:

- `DATABASE_URL`
- `DIRECT_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_KEY`

### Install and Run

```bash
bun install
bun --bun run dev
```

### Database Commands

```bash
bun --bun run db:generate
bun --bun run db:push
bun --bun run db:migrate
bun --bun run db:studio
bun --bun run db:seed
```

## Scripts

| Category | Command | Description |
| --- | --- | --- |
| Dev | `bun --bun run dev` | Start local development server |
| Build | `bun --bun run build` | Build for production |
| Preview | `bun --bun run serve` | Preview production build |
| Format | `bun --bun run format` | Run Biome formatter |
| Lint | `bun --bun run lint` | Run Biome lint |
| Check | `bun --bun run check` | Run Biome check |
| DB | `bun --bun run db:generate` | Generate Prisma client |
| DB | `bun --bun run db:push` | Push schema to database |
| DB | `bun --bun run db:migrate` | Run Prisma migrations |
| DB | `bun --bun run db:studio` | Open Prisma Studio |
| DB | `bun --bun run db:seed` | Seed database |

## Credits

Created for LovedbyLovef, with implementation support from modern AI coding
workflows and the open-source tooling ecosystem used in this stack.
