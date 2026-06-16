#!/usr/bin/env zsh
set -euo pipefail

git config core.hooksPath .githooks
chmod +x .githooks/pre-commit

echo "Installed git hooks from .githooks"
