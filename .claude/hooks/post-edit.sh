#!/bin/bash
# Post-Edit Hook — runs after Claude edits any file
# Runs Prettier, validates output, logs changes, and reminds about Postman when API endpoints change

FILE_PATH="$1"

IS_TS=false
IS_PY=false

[[ "$FILE_PATH" == *.ts || "$FILE_PATH" == *.tsx ]] && IS_TS=true
[[ "$FILE_PATH" == *.py ]] && IS_PY=true

# ─── Run Prettier on TypeScript / TSX files ───────────────────────────────────

if $IS_TS; then
  echo "[post-edit] Running Prettier on $FILE_PATH..."

  if ! npx prettier --write "$FILE_PATH" 2>/dev/null; then
    echo ""
    echo "╔══════════════════════════════════════════════╗"
    echo "║     ⚠️  POST-EDIT — Prettier Failed           ║"
    echo "╚══════════════════════════════════════════════╝"
    echo ""
    echo "  Prettier could not format: $FILE_PATH"
    echo "  This may indicate a syntax error in the file."
    echo "  Please review before continuing."
    echo ""
    exit 0
  fi

  echo "[post-edit] ✅ Prettier done: $FILE_PATH"
fi

# ─── Basic Python syntax check ────────────────────────────────────────────────

if $IS_PY; then
  echo "[post-edit] Checking Python syntax for $FILE_PATH..."

  if ! python3 -m py_compile "$FILE_PATH" 2>/dev/null; then
    echo ""
    echo "╔══════════════════════════════════════════════╗"
    echo "║     ⚠️  POST-EDIT — Python Syntax Error       ║"
    echo "╚══════════════════════════════════════════════╝"
    echo ""
    echo "  Syntax error detected in: $FILE_PATH"
    echo "  Run: python3 -m py_compile $FILE_PATH"
    echo "  Please fix before continuing."
    echo ""
    exit 0
  fi

  echo "[post-edit] ✅ Python syntax OK: $FILE_PATH"
fi

# ─── API endpoint reminder for Postman ────────────────────────────────────────

if $IS_TS; then
  if grep -Eq "(fastify\.(get|post|put|patch|delete)|router\.(get|post|put|patch|delete)|app\.(get|post|put|patch|delete))" "$FILE_PATH"; then
    echo ""
    echo "╔════════════════════════════════════════════════════╗"
    echo "║     📮 API ENDPOINT DETECTED — UPDATE POSTMAN      ║"
    echo "╚════════════════════════════════════════════════════╝"
    echo ""
    echo "  Claude edited a file that appears to define API endpoints:"
    echo "  $FILE_PATH"
    echo ""
    echo "  Please add/update the matching request in Postman:"
    echo ""
    echo "  1. Create or update a request in the Liftivity collection"
    echo "  2. Set the correct HTTP method: GET / POST / PUT / PATCH / DELETE"
    echo "  3. Set the URL, for example:"
    echo "     {{API_BASE_URL}}/api/analyses"
    echo ""
    echo "  4. If protected, add Authorization:"
    echo "     Bearer {{accessToken}}"
    echo ""
    echo "  5. Add body example if needed:"
    echo "     { \"url\": \"https://example.com\" }"
    echo ""
    echo "  6. Add a Tests script if the endpoint returns tokens or IDs"
    echo ""
  fi
fi

# ─── Log the edit ─────────────────────────────────────────────────────────────

LOG_FILE=".claude/edit-log.txt"
mkdir -p ".claude"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "[$TIMESTAMP] edited: $FILE_PATH" >> "$LOG_FILE"

echo "[post-edit] ✅ Logged edit to $LOG_FILE"
exit 0