# backend — python

This folder needs to be implemented with HTTP client code for calling the Python AI microservices.

The three Python services (`cv-service`, `nlp-service`, `scoring-service`) expose REST APIs. This folder contains the TypeScript clients that call them.

## What to implement

- `cvClient.ts` — HTTP client for `cv-service` (`POST /analyze`)
- `nlpClient.ts` — HTTP client for `nlp-service` (`POST /analyze`)
- `scoringClient.ts` — HTTP client for `scoring-service` (`POST /score`)
- `aiOrchestrator.ts` — coordinates calls to all three services for a full analysis run
