# 0001 — Two-service polyglot repo (Next.js + FastAPI)

Date: 2026-05-08
Status: Accepted

## Context

StudyBuddy needs a polished, dynamic UI and AI features that lean on the
Python ecosystem (RDKit for chemistry structures, mature PDF ingestion
libraries, future use of Biopython). A Next.js-only app would force us to
either reimplement these tools or call them out of process anyway; a
Python-backend-only architecture would give up the type-safe, server-component
DX that Next.js offers.

## Decision

Maintain two top-level applications in a single repository:

- `web/` — Next.js 16 (App Router, TypeScript). Owns UI, auth flow, server
  actions for plain CRUD, and orchestration of AI calls.
- `ai/`  — FastAPI (Python 3.12). Owns PDF ingestion, embeddings, RDKit
  operations, and any future science-specific computation.

They share a Postgres database (Supabase) and Supabase Auth. The web service
calls the AI service over HTTPS, forwarding the user's Supabase JWT; the AI
service validates the JWT against Supabase's JWKS before doing DB work.

No JS monorepo tooling (turbo, nx) — the two trees are independent projects in
sibling directories.

## Consequences

- (+) Each side uses its native idioms (Prisma vs Pydantic; Tailwind vs
  whatever Python doesn't need).
- (+) Heavy Python deps don't bloat the Next.js bundle or cold-start.
- (+) Independent deploy + scale (Vercel vs Fly.io).
- (−) Two `.env` files, two CI matrices, two dep upgrade cadences.
- (−) Type sharing across the boundary is hand-mirrored (zod ↔ Pydantic).
  Tolerable while the surface is small; revisit if it grows.
- (−) Local dev requires both processes running. Mitigated by a Docker Compose
  file under `infra/` for contributors who don't want Python locally.
