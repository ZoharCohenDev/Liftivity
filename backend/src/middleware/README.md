# backend — middleware

This folder needs to be implemented with Express/Fastify middleware.

## What to implement

- `auth.middleware.ts` — JWT verification, attach `req.user` to authenticated requests
- `validate.middleware.ts` — request body/param validation (using Zod or Joi)
- `rateLimit.middleware.ts` — per-user and per-IP rate limiting
- `errorHandler.middleware.ts` — global error handler that formats errors via `ErrorView`
- `logger.middleware.ts` — request/response logging
