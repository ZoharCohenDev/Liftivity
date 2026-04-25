-- Dev seed data — do NOT run in production.
-- Run after migrations: psql $DATABASE_URL -f infra/db/seeds/seed_dev.sql

INSERT INTO users (id, email, display_name, password_hash) VALUES
  ('00000000-0000-0000-0000-000000000001',
   'demo@liftivity.app',
   'Demo User',
   '$2b$12$placeholder_replace_with_real_bcrypt_hash')
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, user_id, name, url) VALUES
  ('10000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   'Acme Corp',
   'https://acme-corp.com')
ON CONFLICT (id) DO NOTHING;

-- A completed analysis
INSERT INTO analyses (id, project_id, url, status, stage, progress, created_at, updated_at) VALUES
  ('20000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   'https://acme-corp.com',
   'COMPLETED',
   'COMPLETED',
   100,
   NOW() - INTERVAL '1 hour',
   NOW() - INTERVAL '30 minutes')
ON CONFLICT (id) DO NOTHING;

-- Result for the completed analysis
INSERT INTO analysis_results (
  id, analysis_id, overall_score, category_scores, raw_features, insights, screenshot_url
) VALUES (
  '30000000-0000-0000-0000-000000000001',
  '20000000-0000-0000-0000-000000000001',
  78.50,
  '{"nlp": 85, "performance": 68, "dom": 82}',
  '{"text_length_words": 450, "flesch_reading_ease": 62.3, "h1_count": 1, "has_meta_description": true, "lighthouse_score": 68}',
  '["Clear value proposition above the fold.", "Page load time is slower than ideal — consider image optimisation.", "Good heading structure with a single H1.", "Meta description is present and well-written."]',
  NULL
)
ON CONFLICT (id) DO NOTHING;

-- A pending analysis (to test in-progress states)
INSERT INTO analyses (id, project_id, url, status, stage, progress) VALUES
  ('20000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000001',
   'https://acme-corp.com/about',
   'PENDING',
   'QUEUED',
   0)
ON CONFLICT (id) DO NOTHING;
