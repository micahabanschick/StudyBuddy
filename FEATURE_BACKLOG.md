# Feature Backlog

Items that are planned but blocked on external setup, infrastructure, or a future phase.
Add new items here; remove them when shipped.

---

## Blocked: Database + Hosting setup

**Priority:** High — unlocks all write features (courses, notes, flashcards, chat with RAG)

### Steps (requires browser auth — owner only)

#### 1. Supabase project (~3 min)
1. [supabase.com](https://supabase.com) → New project → name: `studybuddy`
2. Set a DB password, pick a nearby region, wait for provisioning
3. Collect from **Project Settings → API**:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`
   - JWT Secret (JWT Settings) → `SUPABASE_JWT_SECRET` (also needed by `ai/`)
4. Collect from **Project Settings → Database → Connection string**:
   - Transaction mode (port 6543) → `DATABASE_URL`
   - Session mode (port 5432) → `DIRECT_URL`
5. Run bootstrap SQL via the dashboard SQL editor:
   `infra/supabase/migrations/0001_initial_setup.sql`

#### 2. Vercel (web host, ~2 min)
1. [vercel.com/new](https://vercel.com/new) → import `micahabanschick/StudyBuddy`
2. Set **Root Directory** → `web`
3. Do not deploy yet — add env vars first (Claude can do this via CLI)

#### 3. Fly.io (ai service)
- `flyctl` is already installed
- `fly auth login` in terminal, then Claude handles the rest

### Once credentials are shared with Claude
Claude will:
- Update `web/.env.local` with real credentials
- Run `pnpm db:migrate` (creates all tables from Prisma schema)
- Run `pnpm db:seed SEED_USER_ID=<uuid>` (seeds BIO 1107 + CHEM 1128Q)
- Set Vercel env vars via CLI and deploy
- Launch and deploy `ai/` to Fly.io with secrets

---

## Phase 2 remainder — PDF RAG (blocked on Supabase Storage + pgvector)

- `/api/library/upload` route: upload PDF → Supabase Storage → trigger ingestion
- Python `/rag/ingest`: pypdf → chunk → Voyage AI embeddings → pgvector
- Python `/rag/query`: embed query → pgvector similarity → Claude with citations
- Chat with document citations (currently uses notes-only context)

---

## Phase 5 — Dashboard polish (post-Phase 4)

- Streak counter (consecutive days with ≥1 review)
- Mastery heatmap (cards due vs reviewed per day, GitHub-style)
- Theme variants: sepia (reading mode), synth (dark purple), focus (minimal)
- Course progress rings (% of cards mature by FSRS definition)
