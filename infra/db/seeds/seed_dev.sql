-- Dev seed data — do NOT run in production

INSERT INTO users (id, email, display_name, password_hash) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@liftivity.app', 'Demo User',
   '$2b$12$placeholder_hash_replace_with_real_bcrypt_hash');

INSERT INTO workouts (id, user_id, title, started_at, completed_at) VALUES
  ('10000000-0000-0000-0000-000000000001',
   '00000000-0000-0000-0000-000000000001',
   'Morning Push Day',
   NOW() - INTERVAL '1 day',
   NOW() - INTERVAL '23 hours');

INSERT INTO exercises (id, workout_id, name, sort_order) VALUES
  ('20000000-0000-0000-0000-000000000001',
   '10000000-0000-0000-0000-000000000001',
   'Bench Press', 1),
  ('20000000-0000-0000-0000-000000000002',
   '10000000-0000-0000-0000-000000000001',
   'Overhead Press', 2);

INSERT INTO sets (exercise_id, reps, weight_kg, form_score) VALUES
  ('20000000-0000-0000-0000-000000000001', 8, 80.0, 92.5),
  ('20000000-0000-0000-0000-000000000001', 7, 80.0, 88.0),
  ('20000000-0000-0000-0000-000000000002', 10, 50.0, 95.0);
