#!/usr/bin/env zsh
set -euo pipefail

git config core.hooksPath .githooks
chmod +x .githooks/pre-commit
chmod +x .githooks/commit-msg

echo "Installed git hooks from .githooks"
