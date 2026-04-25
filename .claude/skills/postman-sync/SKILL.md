---
name: postman-sync
description: Automatically update Postman collections whenever new API endpoints are created or modified. Use this skill when creating new API endpoints, modifying existing routes, adding authentication, or updating request validation. Always trigger this skill when the user mentions Postman, API collections, or endpoint documentation.
---

# Postman Sync Skill

## Purpose
Automatically update Postman collection whenever new API endpoints are created or modified.

## When to use
- When creating a new API endpoint
- When modifying existing API routes
- When adding auth or request validation

## Instructions

1. Use the Postman MCP server.

2. Find or create a collection named:
   "Liftivity API"

3. Organize endpoints into folders:
   - Auth
   - Analyses
   - Projects
   - Health

4. For each endpoint:
   - Add correct HTTP method (GET, POST, etc.)
   - Use {{API_BASE_URL}} variable
   - Add request body examples
   - Add query params if needed

5. If endpoint is protected:
   Add header:
   Authorization: Bearer {{accessToken}}

6. Add Tests scripts:
   - login → save accessToken
   - refresh → update accessToken
   - logout → remove accessToken

7. Add description explaining what the endpoint does.

8. After updating Postman:
   - Explain what was added
   - Show request example
