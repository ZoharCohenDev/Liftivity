#!/bin/bash
# Guard Hook — runs before any file operation
# Warns and asks for confirmation when sensitive patterns are detected

FILE_PATH="$1"
CONTENT="$2"

# ─── Sensitive pattern definitions ───────────────────────────────────────────

DANGEROUS_PATTERNS=(
  "process\.env\.[A-Z_]*SECRET"
  "process\.env\.[A-Z_]*KEY"
  "process\.env\.[A-Z_]*PASSWORD"
  "console\.log.*password"
  "console\.log.*token"
  "console\.log.*secret"
  "any"
  "TODO.*hack"
  "FIXME.*urgent"
  "rm -rf"
  "DROP TABLE"
  "DELETE FROM.*WHERE.*1=1"
)

# Python-specific dangerous patterns
PYTHON_PATTERNS=(
  "print.*password"
  "print.*secret"
  "print.*token"
  "eval("
  "exec("
  "pickle\.loads"
  "random\." # unfixed seed in ML context
)

# ─── File type detection ──────────────────────────────────────────────────────

IS_TS=false
IS_PY=false

[[ "$FILE_PATH" == *.ts || "$FILE_PATH" == *.tsx ]] && IS_TS=true
[[ "$FILE_PATH" == *.py ]] && IS_PY=true

# ─── Guard checks ─────────────────────────────────────────────────────────────

WARNINGS=()

# Check general patterns
for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$CONTENT" | grep -qE "$pattern"; then
    WARNINGS+=("⚠️  Detected dangerous pattern: '$pattern' in $FILE_PATH")
  fi
done

# Check Python-specific patterns
if $IS_PY; then
  for pattern in "${PYTHON_PATTERNS[@]}"; do
    if echo "$CONTENT" | grep -qE "$pattern"; then
      WARNINGS+=("⚠️  [Python] Detected risky pattern: '$pattern' in $FILE_PATH")
    fi
  done
fi

# Check for hardcoded IPs or localhost URLs committed to non-dev files
if echo "$FILE_PATH" | grep -qvE "(\.env|config\.dev|\.local)"; then
  if echo "$CONTENT" | grep -qE "http://localhost|127\.0\.0\.1|192\.168\."; then
    WARNINGS+=("⚠️  Hardcoded local URL detected in $FILE_PATH — should use env variable")
  fi
fi

# ─── Output warnings and ask for confirmation ─────────────────────────────────

if [ ${#WARNINGS[@]} -gt 0 ]; then
  echo ""
  echo "╔══════════════════════════════════════════════╗"
  echo "║         🛡️  GUARD — Issues Detected           ║"
  echo "╚══════════════════════════════════════════════╝"
  echo ""
  for warning in "${WARNINGS[@]}"; do
    echo "  $warning"
  done
  echo ""
  echo "  Do you want to proceed anyway? (yes/no)"
  read -r ANSWER

  if [[ "$ANSWER" != "yes" ]]; then
    echo "  ❌ Operation cancelled by guard."
    exit 1
  fi

  echo "  ✅ Proceeding with user confirmation."
fi

exit 0