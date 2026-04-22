# Liftivity

AI-powered fitness coaching platform — monorepo.

## Structure

| Path | Description |
|------|-------------|
| `apps/web` | React frontend |
| `apps/api` | Node.js backend (NestJS/Fastify) |
| `apps/worker` | Queue worker / orchestration |
| `services/nlp-service` | Python NLP service |
| `services/cv-service` | Python computer-vision service |
| `services/scoring-service` | Python ML scoring service |
| `packages/shared-types` | Shared TypeScript types |
| `packages/ui` | Shared UI component library |
| `packages/config` | Shared ESLint / tsconfig |
| `infra/` | Docker, DB migrations, compose files |
| `docs/` | Architecture, API, flow, and product docs |

## Quick start

```bash
cp .env.example .env
docker-compose up --build
```

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9
- Python ≥ 3.11
- Docker ≥ 24
