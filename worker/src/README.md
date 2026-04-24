# worker — src

Background job worker source code.

The worker processes async jobs queued by the backend (e.g. site crawls, analysis runs, report generation).

## What to implement

- `index.ts` — already exists: worker entry point and job queue consumer
- `jobs/` — individual job handlers (one file per job type)
- `queue.ts` — job queue client setup (BullMQ / pg-boss / etc.)
- `crawler.ts` — headless browser crawler (Playwright / Puppeteer) that captures screenshots and HTML
