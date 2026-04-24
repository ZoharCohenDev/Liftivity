# backend — controllers

This folder needs to be implemented with request handler functions.

Controllers are thin — they parse/validate the request, call the appropriate service, and format the response using a view.

## What to implement

- `AuthController.ts` — handles login, register, logout
- `SitesController.ts` — handles CRUD operations for monitored sites
- `AnalysesController.ts` — triggers new analyses, fetches status and results
- `ReportsController.ts` — retrieves formatted analysis reports
