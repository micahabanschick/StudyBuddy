# StudyBuddy — web

Next.js 16 App Router frontend for StudyBuddy.

For setup, architecture, and the broader project, see the
[root README](../README.md) and [docs/architecture.md](../docs/architecture.md).

## Quick start

```bash
pnpm install
cp .env.local.example .env.local   # fill in Supabase + Anthropic creds
pnpm dev                           # http://localhost:3000
```

## Scripts

| Command           | Purpose                                |
| ----------------- | -------------------------------------- |
| `pnpm dev`        | Run the dev server (Turbopack)         |
| `pnpm build`      | Production build                       |
| `pnpm typecheck`  | `tsc --noEmit`                         |
| `pnpm lint`       | ESLint                                 |
| `pnpm format`     | Prettier write                         |
| `pnpm test`       | Vitest (unit)                          |
| `pnpm test:e2e`   | Playwright (E2E)                       |
| `pnpm db:migrate` | Prisma migrations (needs DATABASE_URL) |
| `pnpm db:seed`    | Seed BIO 1107 + CHEM 1128Q             |
