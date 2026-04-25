import { z } from "zod";

const schema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters")
    .refine(
      (v) => v !== "change_me_in_production",
      "JWT_SECRET must be changed from the example default"
    ),
  JWT_EXPIRES_IN: z.string().default("7d"),
  API_PORT: z.coerce.number().int().default(3000),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  WEB_URL: z.string().url("WEB_URL must be a valid URL (e.g. http://localhost:5173)"),
  NLP_SERVICE_URL: z.string().url().default("http://localhost:8001"),
  CV_SERVICE_URL: z.string().url().default("http://localhost:8002"),
  SCORING_SERVICE_URL: z.string().url().default("http://localhost:8003"),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid or missing environment variables:\n");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
