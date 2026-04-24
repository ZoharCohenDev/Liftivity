# backend — config

This folder needs to be implemented with server configuration and environment setup.

## What to implement

- `env.ts` — validates and exports all environment variables (using `zod` or `dotenv`)
- `db.ts` — database connection setup (PostgreSQL via Prisma or pg)
- `cors.ts` — CORS allowed origins per environment
- `constants.ts` — shared constants (JWT expiry, rate limits, plan limits)
