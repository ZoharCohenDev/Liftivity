# Liftivity — Developer Runbook

Everything you need to run the project locally.

---

## Prerequisites

Make sure these are installed before anything else:

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 20 | https://nodejs.org |
| pnpm | ≥ 9 | `npm install -g pnpm` |
| Docker Desktop | ≥ 24 | https://www.docker.com/products/docker-desktop |

---

## One-time setup (do this once after cloning)

```bash
# 1. Go to the monorepo root — all commands run from here
cd ~/Liftivity

# 2. Install all dependencies
pnpm install

# 3. Build shared types (required for frontend and worker imports)
pnpm --filter @liftivity/shared-types build

# 4. Copy the env file (if .env doesn't exist yet)
cp .env.example .env
# Then open .env and fill in your values (see "Environment variables" section below)

# 5. Run the database migration (only needed on first run or after schema changes)
pnpm --filter @liftivity/api db:migrate
```

---

## Daily dev workflow

All commands are run from: **`~/Liftivity`** (the monorepo root).

Open **3 terminal tabs**:

---

### Tab 1 — Redis (background infrastructure)

```bash
# Start Redis in the background (detached)
docker-compose up redis -d

# Check it's running
docker-compose ps

# Stop Redis when done
docker-compose stop redis
```

> **Why Redis only?** The database is hosted on Supabase — no need to run Postgres locally.

---

### Tab 2 — Backend API

```bash
# Start with hot reload (logs appear here)
pnpm --filter @liftivity/api dev
```

Runs on → **http://localhost:3000**  
Health check → **http://localhost:3000/health**

Logs look like:
```
{"level":30,"msg":"Server listening at http://0.0.0.0:3000"}
{"level":30,"reqId":"req-1","msg":"incoming request"}
```

Stop with `Ctrl+C`.

---

### Tab 3 — Frontend

```bash
# Start Vite dev server with hot reload (logs appear here)
pnpm dev
```

Runs on → **http://localhost:5173**

Stop with `Ctrl+C`.

---

### Tab 4 — Worker (optional)

Only needed when you're working on analysis jobs. Otherwise you can skip this.

```bash
pnpm --filter @liftivity/worker dev
```

No port — it connects to Redis and processes background jobs.

Stop with `Ctrl+C`.

---

## Run everything in the background (no log output)

If you want all services running silently in the background:

```bash
# Start Redis in background
docker-compose up redis -d

# Start backend in background (logs go to a file)
pnpm --filter @liftivity/api dev > /tmp/api.log 2>&1 &

# Start worker in background
pnpm --filter @liftivity/worker dev > /tmp/worker.log 2>&1 &

# Start frontend in background
pnpm dev > /tmp/web.log 2>&1 &
```

Then check the logs at any time:

```bash
tail -f /tmp/api.log      # Follow backend logs
tail -f /tmp/worker.log   # Follow worker logs
tail -f /tmp/web.log      # Follow frontend logs
```

Stop all background Node processes:
```bash
pkill -f ts-node-dev   # Stops backend and worker
pkill -f vite          # Stops frontend
docker-compose stop redis
```

---

## View logs

### Docker services
```bash
# All docker services (live)
docker-compose logs -f

# Just Redis
docker-compose logs -f redis

# Last 50 lines of Redis
docker-compose logs --tail=50 redis
```

### Backend / Worker / Frontend (when running in terminal)
Logs print directly in the terminal tab. No extra command needed.

### Backend (when running in background)
```bash
tail -f /tmp/api.log
```

---

## Database commands

All run from `~/Liftivity`:

```bash
# Apply pending migrations (run after pulling schema changes)
pnpm --filter @liftivity/api db:migrate

# Open Prisma Studio (visual DB browser) → http://localhost:5555
pnpm --filter @liftivity/api db:studio

# Push schema changes without creating a migration file (for quick prototyping)
pnpm --filter @liftivity/api db:push

# Seed the database with dev data
pnpm --filter @liftivity/api db:seed

# Regenerate the Prisma client after schema changes
pnpm --filter @liftivity/api db:generate
```

---

## Full Docker mode (run everything in containers, no local Node)

This starts all 8 services — Postgres, Redis, API, Worker, Frontend, NLP, CV, Scoring:

```bash
# Start all (foreground — you see all logs mixed together)
docker-compose up

# Start all in background (detached)
docker-compose up -d

# View logs for specific services after detach
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f worker

# Stop everything
docker-compose down

# Stop and delete all data volumes (clean slate)
docker-compose down -v
```

> **Note:** For full Docker mode you need `POSTGRES_PASSWORD` set in `.env`.

---

## Environment variables

The `.env` file lives at the monorepo root. It is auto-loaded by:
- `pnpm --filter @liftivity/api dev` (via dotenv-cli)
- `pnpm --filter @liftivity/worker dev` (via dotenv-cli)
- Vite reads `VITE_*` vars automatically
- Docker Compose reads the whole file

Required values — the backend **will not start** without these:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `DIRECT_URL` | Direct DB URL (for Prisma migrations) | same as above for local |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Must be ≥ 32 chars, not the default | `openssl rand -base64 32` |
| `WEB_URL` | Exact frontend origin (no trailing slash) | `http://localhost:5173` |

Generate a strong JWT secret:
```bash
openssl rand -base64 32
```

---

## Port reference

| Service | URL | Notes |
|---------|-----|-------|
| Frontend | http://localhost:5173 | Vite dev server |
| Backend API | http://localhost:3000 | Fastify |
| Health check | http://localhost:3000/health | Returns `{"status":"ok"}` |
| Prisma Studio | http://localhost:5555 | Only when `db:studio` is running |
| Redis | localhost:6379 | Internal only |
| NLP service | http://localhost:8001 | Python, Docker only |
| CV service | http://localhost:8002 | Python, Docker only |
| Scoring service | http://localhost:8003 | Python, Docker only |

---

## Code quality commands

All run from `~/Liftivity`:

```bash
# Type check all packages at once
pnpm typecheck

# Type check one package
pnpm --filter @liftivity/api typecheck
pnpm --filter @liftivity/web typecheck
pnpm --filter @liftivity/worker typecheck

# Lint all packages
pnpm lint

# Build shared types (needed after editing packages/shared-types)
pnpm --filter @liftivity/shared-types build

# Build everything for production
pnpm build
```

---

## Troubleshooting

**Backend won't start — env validation error**
```
❌ Invalid or missing environment variables:
  JWT_SECRET: Must be changed from the example default
```
→ Open `.env` and set `JWT_SECRET` to a random string of at least 32 characters.  
→ Run `openssl rand -base64 32` to generate one.

---

**`No projects matched the filters`**
→ Make sure you're in the monorepo root (`~/Liftivity`), not inside a subdirectory.

---

**Frontend can't reach the API (`Network Error`)**  
→ Make sure the backend is running on port 3000.  
→ Check `VITE_API_BASE_URL=http://localhost:3000` is in `.env`.

---

**Prisma error: `Can't reach database server`**  
→ Check `DATABASE_URL` in `.env` is correct.  
→ If using local Postgres: make sure `docker-compose up postgres` is running.

---

**Redis connection refused**  
→ Run `docker-compose up redis -d` and try again.

---

**`pnpm install` fails**  
→ Make sure Node ≥ 20 and pnpm ≥ 9 are installed.  
→ Run `node -v` and `pnpm -v` to check.
