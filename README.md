# Liftivity

AI-powered fitness coaching platform — monorepo.

## Structure

| Path | Description |
|------|-------------|
| `frontend/` | React 18 + Vite frontend (`@liftivity/web`) |
| `backend/` | Fastify API server (`@liftivity/api`) |
| `worker/` | BullMQ job worker (`@liftivity/worker`) |
| `AI Services/nlp-service` | Python NLP microservice |
| `AI Services/cv-service` | Python computer-vision microservice |
| `AI Services/scoring-service` | Python ML scoring microservice |
| `packages/shared-types` | Shared TypeScript types |
| `packages/ui` | Shared React component library |
| `packages/config` | Shared ESLint / tsconfig base |
| `infra/` | DB migrations, seeds, Docker config |
| `docs/` | Architecture, API, flow, and product docs |

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)
- Docker ≥ 24 with Docker Compose
- Python ≥ 3.11 (only if running Python services locally)

## Quick start (development)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment

```bash
cp .env.example .env
# Edit .env if you need to change any defaults
```

### 3. Start infrastructure (PostgreSQL + Redis)

```bash
docker-compose up -d postgres redis
```

Postgres is available at `localhost:5432`, Redis at `localhost:6379`.
The DB schema from `infra/db/migrations/001_init.sql` is applied automatically on first start.

### 4. Run the apps (separate terminals)

```bash
# Terminal 1 — API server → http://localhost:3000
pnpm --filter @liftivity/api dev

# Terminal 2 — Queue worker
pnpm --filter @liftivity/worker dev

# Terminal 3 — Frontend → http://localhost:5173
pnpm --filter @liftivity/web dev
```

### 5. Verify everything is up

```bash
# API health check
curl http://localhost:3000/health
# Expected: {"status":"ok","service":"api"}

# Frontend
open http://localhost:5173
```

## Full Docker build (all services)

> Requires `.env` to exist (`cp .env.example .env` first).

```bash
docker-compose up --build
```

This starts all services including the Python AI services. The frontend is served by nginx at `http://localhost:5173`.

## Useful commands

```bash
pnpm typecheck          # type-check all packages
pnpm lint               # lint all packages
pnpm --filter @liftivity/api build       # build the API
pnpm --filter @liftivity/worker build    # build the worker
pnpm --filter @liftivity/web build       # build the frontend
docker-compose down -v  # stop infra and remove volumes
```

## Environment variables

See `.env.example` for all supported variables. Key ones:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://liftivity:secret@localhost:5432/liftivity_dev` | Postgres connection |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection |
| `JWT_SECRET` | `change_me_in_production` | **Change before deploying** |
| `API_PORT` | `3000` | Port the API listens on |
| `VITE_API_BASE_URL` | `http://localhost:3000` | API base URL used by the frontend |
