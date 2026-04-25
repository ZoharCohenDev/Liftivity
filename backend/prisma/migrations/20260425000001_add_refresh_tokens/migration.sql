-- CreateTable: refresh_tokens
-- Stores hashed refresh tokens for session management.
-- Raw tokens are NEVER persisted; only SHA-256 hashes are stored.
CREATE TABLE "refresh_tokens" (
    "id"         UUID        NOT NULL DEFAULT gen_random_uuid(),
    "user_id"    UUID        NOT NULL,
    "token_hash" TEXT        NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "revoked_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- Foreign key to users (cascade delete when user is removed)
ALTER TABLE "refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes for lookup performance
CREATE INDEX "idx_refresh_tokens_user_id"   ON "refresh_tokens"("user_id");
CREATE INDEX "idx_refresh_tokens_token_hash" ON "refresh_tokens"("token_hash");
