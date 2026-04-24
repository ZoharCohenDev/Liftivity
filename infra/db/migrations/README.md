# infra/db/migrations

SQL migration files applied in order to build the database schema.

## Naming convention

`NNN_description.sql` — e.g. `001_init.sql`, `002_add_analyses_table.sql`

Run migrations with: `psql $DATABASE_URL -f migrations/NNN_file.sql`
