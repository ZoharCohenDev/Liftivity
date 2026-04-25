import IORedis from "ioredis";
import { env } from "../config/env";

// maxRetriesPerRequest: null is required by BullMQ — without it BullMQ throws
// on long-lived blocking commands like BRPOP.
export const redisConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
