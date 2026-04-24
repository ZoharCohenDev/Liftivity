# @liftivity/worker

BullMQ-based job worker for background processing (video analysis, scoring, notifications).

## Dev

```bash
pnpm dev    # ts-node-dev watch mode
pnpm build  # compile → dist/
pnpm start  # run compiled output
```

Requires Redis. Set `REDIS_URL` in `.env`.
