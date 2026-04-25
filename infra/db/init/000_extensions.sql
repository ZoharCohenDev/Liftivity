-- Loaded automatically by Docker Postgres on first container start.
-- Only installs the extension needed for gen_random_uuid().
-- Schema is managed by Prisma migrations (see backend/prisma/migrations/).
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
