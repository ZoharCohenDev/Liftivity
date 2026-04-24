# backend — views

This folder needs to be implemented with response formatters / DTOs (Data Transfer Objects).

## What to implement

- `UserView.ts` — strips sensitive fields (password hash, internal IDs) from user responses
- `AnalysisView.ts` — shapes analysis results for the frontend (score, issues, recommendations)
- `SiteView.ts` — public-safe site representation
- `ErrorView.ts` — standard error response shape `{ error: string, code: string }`
