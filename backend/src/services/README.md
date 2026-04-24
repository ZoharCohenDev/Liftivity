# backend — services

This folder needs to be implemented with business logic services.

Services contain all the core logic — they are called by controllers and call models, external APIs, and the Python AI services.

## What to implement

- `AuthService.ts` — password hashing, JWT creation/validation, session management
- `SiteService.ts` — site registration, URL validation, ownership checks
- `AnalysisService.ts` — orchestrates a full analysis run (triggers crawl → calls AI services → stores results)
- `ReportService.ts` — assembles and formats the final report from raw analysis data
- `CrawlService.ts` — crawls the target URL, captures screenshots, extracts HTML
