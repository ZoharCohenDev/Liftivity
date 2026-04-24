# infra/db/seeds

SQL seed files that populate the database with development and test data.

## Files

- `seed_dev.sql` — inserts sample users, sites, and analyses for local development

Run with: `psql $DATABASE_URL -f seeds/seed_dev.sql`
