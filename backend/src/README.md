# backend — src

TypeScript source for the Liftivity backend API server (Node.js / Express or Fastify).

## Structure

| Folder | Purpose |
|---|---|
| `models/` | Database models and TypeScript interfaces |
| `views/` | Response formatters / DTOs |
| `routes/` | API route definitions |
| `controllers/` | Request handlers (thin layer — delegates to services) |
| `services/` | Business logic |
| `middleware/` | Auth, validation, error handling, rate limiting |
| `config/` | Environment config, DB connection, constants |
| `python/` | Bridge scripts / clients that call the Python AI services |

## Entry point

`main.ts` — starts the HTTP server.
