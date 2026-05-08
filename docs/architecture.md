# Architecture

## Overview

StudyBuddy is a two-service application: a Next.js web app and a FastAPI
"AI service." They communicate over HTTPS, share a Postgres database hosted by
Supabase, and use Supabase for auth and file storage.

```
┌────────────┐        HTTPS         ┌──────────────────┐
│  Browser   │ ───────────────────▶ │   Next.js (web)  │
│            │ ◀─────────────────── │   App Router     │
└────────────┘                      └────────┬─────────┘
                                             │ HTTPS (server-side only)
                                             ▼
                                    ┌──────────────────┐
                                    │   FastAPI (ai)   │
                                    │  RAG, RDKit, …   │
                                    └────────┬─────────┘
                                             │
        ┌────────────────────────────────────┼─────────────────────┐
        ▼                                    ▼                     ▼
   Supabase Auth                  Supabase Postgres         Supabase Storage
   (JWT issuance)                 (+ pgvector)              (PDFs, images)
```

The browser never talks to the AI service directly. All AI calls flow through
the Next.js server (a server action or `app/api/ai/*` route), which validates
the user's Supabase session and forwards the request with the user's JWT. The
AI service revalidates the JWT against Supabase's JWKS before any DB work.

## Why two services

Most of the app is best in TypeScript: server components, server actions,
Prisma, Tailwind. But three categories of work pull toward Python:

1. **PDF ingestion + chunking** — pypdf, unstructured, layout-aware parsers.
2. **Embeddings** — fine to do in TS, but easier to swap models in Python.
3. **Domain libs** — RDKit for chemistry (SMILES → 2D structures, properties),
   BioPython if molecular biology features land later.

Putting these in a separate service keeps the Next.js bundle small, isolates
heavy dependencies, and lets the AI service scale independently.

## Auth model

Supabase issues JWTs. The web app uses `@supabase/ssr` to attach the session
to incoming requests via middleware. Server-side code reads the session from
cookies. When the web server calls the AI service, it forwards the access
token in an `Authorization: Bearer <jwt>` header. The AI service validates the
token's signature against Supabase's published JWKS and extracts `sub` (the
user id) for row-level filtering.

Row-Level Security (RLS) is enabled in Supabase for all user-owned tables.
The AI service uses the user's JWT to make Supabase-side queries so RLS is
enforced consistently.

## Data model

See `web/prisma/schema.prisma` for the source of truth. High-level entities:

- **Course / Topic** — hierarchical organization of study material.
- **Document / DocumentChunk** — uploaded PDFs and their embedded chunks
  (`embedding vector(1536)` in Postgres via pgvector).
- **Note / NoteLink** — markdown notes with backlinks.
- **Deck / Card / Review** — flashcards and FSRS scheduling state.
- **Quiz / QuizQuestion / QuizAttempt / QuizResponse** — generated quizzes
  and grading history.
- **ChatSession / ChatMessage** — RAG chat history with citations.

Embeddings live on `DocumentChunk.embedding` and are populated by the AI
service during ingestion. Similarity search is done via raw SQL or through the
AI service rather than Prisma's typed query API, since Prisma does not natively
model the `vector` type.

## Type sharing

`web/` uses `zod` schemas; `ai/` uses Pydantic. The two are hand-mirrored for
the small surface that crosses the boundary (RAG requests, quiz generation
payloads). If the surface grows, we'll generate one from the other; for now
duplication is cheap.

## Deployment

- `web/` → Vercel. `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_*`, `ANTHROPIC_API_KEY`,
  and `AI_SERVICE_URL` set as project env vars.
- `ai/`  → Fly.io (`fly launch` from `ai/`). Same env vars relevant to the
  service. A long timeout for ingestion endpoints.
- `infra/supabase/` — migrations applied via the Supabase CLI.

## Local development

`pnpm dev` in `web/` and `uv run fastapi dev` in `ai/` is the default. Docker
Compose in `infra/` starts the AI service in a container if you'd rather not
install Python locally.

## Decisions

Non-trivial architectural choices are recorded as ADRs in `docs/decisions/`.
Each ADR captures context, the decision, and the consequences. The first
record (`0001-two-service-polyglot-repo.md`) explains why we chose this
two-service shape over a single Next.js app.
