# StudyBuddy — ai

FastAPI service for StudyBuddy. Owns PDF ingestion, embeddings, RAG retrieval,
and RDKit chemistry tooling. Called by the Next.js `web` app over HTTPS.

## Quick start

```bash
uv sync
cp .env.example .env
uv run fastapi dev app/main.py --port 8000
```

## Endpoints (Phase 0)

| Method | Path      | Description              |
| ------ | --------- | ------------------------ |
| GET    | `/health` | Liveness probe (no auth) |
| GET    | `/whoami` | Authenticated identity   |
