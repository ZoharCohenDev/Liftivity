import { Queue } from "bullmq";
import IORedis from "ioredis";
import { ANALYSIS_QUEUE_NAME } from "@liftivity/shared-types";
import type { AnalysisJobPayload } from "@liftivity/shared-types";
import { env } from "../config/env";

const connection = new IORedis(env.REDIS_URL, {
  // Required by BullMQ — disables the default 20 retry limit so the worker
  // can block on BRPOP without timing out.
  maxRetriesPerRequest: null,
});

export const analysisQueue = new Queue<AnalysisJobPayload>(ANALYSIS_QUEUE_NAME, {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
    // Keep the last 100 completed and 200 failed jobs for observability.
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 200 },
  },
});

export async function enqueueAnalysis(payload: AnalysisJobPayload): Promise<void> {
  const job = await analysisQueue.add("run-analysis", payload);
  console.log(
    `[queue] Enqueued job ${job.id} for analysisId=${payload.analysisId} projectId=${payload.projectId}`
  );
}
