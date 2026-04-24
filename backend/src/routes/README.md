# backend — routes

This folder needs to be implemented with API route definitions.

## What to implement

- `auth.routes.ts` — `POST /auth/login`, `POST /auth/register`, `POST /auth/logout`
- `sites.routes.ts` — `GET /sites`, `POST /sites`, `DELETE /sites/:id`
- `analyses.routes.ts` — `POST /analyses`, `GET /analyses/:id`, `GET /analyses` (list)
- `reports.routes.ts` — `GET /reports/:analysisId`
- `index.ts` — mounts all routers onto the main Express/Fastify app
