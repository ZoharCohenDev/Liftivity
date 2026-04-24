#!/bin/bash
# Post-Edit Hook — runs after Claude edits any file
# Runs Prettier, validates output, and logs the change

FILE_PATH="$1"

# ─── File type detection ──────────────────────────────────────────────────────

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
    # Warn but don't block — Claude should see the issue
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

# ─── Log the edit ─────────────────────────────────────────────────────────────

LOG_FILE=".claude/edit-log.txt"
mkdir -p ".claude"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "[$TIMESTAMP] edited: $FILE_PATH" >> "$LOG_FILE"

echo "[post-edit] ✅ Logged edit to $LOG_FILE"
exit 0