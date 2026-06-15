#!/usr/bin/env zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
PROJECT_ROOT="${SCRIPT_DIR:h}"
TARS_SOURCE="$PROJECT_ROOT/tars"
BIN_DIR="$HOME/.local/bin"
TARGET="$BIN_DIR/tars"
ZSHRC="$HOME/.zshrc"

if [[ ! -f "$TARS_SOURCE" ]]; then
  echo "Missing TARS source: $TARS_SOURCE" >&2
  exit 1
fi

mkdir -p "$BIN_DIR"
ln -sf "$TARS_SOURCE" "$TARGET"
chmod +x "$TARS_SOURCE"

if [[ ! -f "$ZSHRC" ]]; then
  touch "$ZSHRC"
fi

if ! grep -q 'HOME/.local/bin' "$ZSHRC"; then
  {
    echo ''
    echo '# TARS local CLI'
    echo 'export PATH="$HOME/.local/bin:$PATH"'
  } >> "$ZSHRC"
fi

echo "Installed tars -> $TARGET"
echo "Restart your terminal or run: source ~/.zshrc"
echo "Then run: tars"

