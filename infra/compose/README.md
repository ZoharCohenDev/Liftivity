# infra/compose

Environment-specific Docker Compose override files.

| File | Purpose |
|------|---------|
| `docker-compose.prod.yml` | Production overrides (resource limits, secrets) |
| `docker-compose.ci.yml` | CI-specific overrides (no volume mounts, ephemeral DBs) |

The root `docker-compose.yml` is the base configuration; use `-f` to layer these overrides:

```bash
docker-compose -f docker-compose.yml -f infra/compose/docker-compose.prod.yml up
```
