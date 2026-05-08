# StudyBuddy

A personal study aid that grows from undergrad coursework to PhD-level material.
Built around four pillars: spaced-repetition flashcards, a markdown notes editor
with math and chemistry rendering, AI Q&A grounded in your own course materials
(RAG), and AI-generated quizzes.

## Repository layout

```
StudyBuddy/
├── web/         Next.js 16 (App Router, TypeScript, Tailwind, shadcn/ui)
├── ai/          FastAPI service for RAG, embeddings, and science-specific tooling
├── infra/       docker-compose for local AI service, Supabase migrations
├── docs/        Architecture notes and ADRs
└── .github/     CI workflows
```

## Stack at a glance

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui, Framer Motion, cmdk, lucide-react, next-themes
- **Auth + DB + Storage**: Supabase (Postgres + pgvector + Auth + Storage)
- **ORM**: Prisma 7 on the web side; Supabase Python client on the AI side
- **AI**: Anthropic Claude (`claude-sonnet-4-6`) via the AI service and server actions
- **Spaced repetition**: FSRS via `ts-fsrs`
- **Testing**: Vitest + Playwright for `web/`, pytest for `ai/`

## Getting started

```bash
cd web && pnpm install
cp web/.env.local.example web/.env.local   # fill in Supabase + Anthropic creds

cd ai && uv sync
cp ai/.env.example ai/.env                 # fill in Supabase + Anthropic creds

# Two terminals:
cd web && pnpm dev          # http://localhost:3000
cd ai  && uv run fastapi dev app/main.py   # http://localhost:8000
```

## Phased roadmap

- **Phase 0** — Scaffolding (current): two apps boot, theming + shell + auth wired, CI green.
- **Phase 1** — Courses + Markdown notes (KaTeX + RDKit chem structures).
- **Phase 2** — PDF upload + course-scoped RAG chat with citations.
- **Phase 3** — Flashcards with FSRS scheduling.
- **Phase 4** — AI quiz generator (MCQ + free-response rubric).
- **Phase 5** — Dashboard polish: streaks, mastery heatmap, theme variants.

See `docs/architecture.md` and `docs/decisions/` for more.
