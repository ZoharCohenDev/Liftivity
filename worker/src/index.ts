import { Worker } from "bullmq";
import IORedis from "ioredis";
import type { AnalysisJobPayload } from "@liftivity/shared-types";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

// Main job processor — add queue handlers here
const worker = new Worker<AnalysisJobPayload>(
  "liftivity-jobs",
  async (job) => {
    console.log(`[worker] Processing job ${job.id} (${job.name}) for analysis ${job.data.analysisId}`);
    // TODO: dispatch to per-job handlers
  },
  { connection }
);

worker.on("completed", (job) => console.log(`[worker] Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`[worker] Job ${job?.id} failed:`, err));

console.log("[worker] Listening for jobs on queue: liftivity-jobs");
