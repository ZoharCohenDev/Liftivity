# backend — models

This folder needs to be implemented with database models and TypeScript type definitions.

## What to implement

- `User.ts` — user account model (id, email, plan, createdAt)
- `Site.ts` — monitored site model (url, userId, lastCrawl, score)
- `Analysis.ts` — analysis run model (siteId, status, results, startedAt, completedAt)
- `Issue.ts` — detected issue model (analysisId, category, severity, description, fix)
- `index.ts` — barrel export of all models
