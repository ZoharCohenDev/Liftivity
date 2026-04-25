#!/bin/bash
# Pre-Edit Hook — runs before Claude edits any file
# Validates the file is safe to edit and creates a backup

FILE_PATH="$1"

# ─── Protect critical files from accidental edits ────────────────────────────

PROTECTED_FILES=(
  ".env"
  ".env.production"
  ".env.prod"
  "prisma/schema.prisma"
  "package-lock.json"
  "yarn.lock"
  "pnpm-lock.yaml"
)

for protected in "${PROTECTED_FILES[@]}"; do
  if [[ "$FILE_PATH" == *"$protected"* ]]; then
    echo ""
    echo "╔══════════════════════════════════════════════╗"
    echo "║      🔒 PRE-EDIT — Protected File            ║"
    echo "╚══════════════════════════════════════════════╝"
    echo ""
    echo "  ⛔ Claude is trying to edit a protected file:"
    echo "     $FILE_PATH"
    echo ""
    echo "  Are you sure you want to allow this? (yes/no)"
    read -r ANSWER

    if [[ "$ANSWER" != "yes" ]]; then
      echo "  ❌ Edit cancelled."
      exit 1
    fi
  fi
done

# ─── Create backup before editing ────────────────────────────────────────────

BACKUP_DIR=".claude/backups"
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME=$(basename "$FILE_PATH")
BACKUP_PATH="$BACKUP_DIR/${FILENAME}.${TIMESTAMP}.bak"

if [ -f "$FILE_PATH" ]; then
  cp "$FILE_PATH" "$BACKUP_PATH"
  echo "[pre-edit] ✅ Backup created: $BACKUP_PATH"
fi

# ─── Validate file is not binary ─────────────────────────────────────────────

if file "$FILE_PATH" | grep -q "binary"; then
  echo ""
  echo "  ⛔ [pre-edit] Attempted to edit a binary file: $FILE_PATH"
  echo "  ❌ Edit cancelled."
  exit 1
fi

echo "[pre-edit] ✅ File cleared for editing: $FILE_PATH"
exit 0