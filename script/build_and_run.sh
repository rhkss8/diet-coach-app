#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-start}"
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
APP_DIR="$ROOT_DIR/apps/mobile"

cd "$APP_DIR"

show_usage() {
  cat <<'USAGE'
usage: ./script/build_and_run.sh [mode]

Modes:
  start, run        Start the Expo dev server
  --ios, ios        Start Expo and open iOS
  --android, android
                   Start Expo and open Android
  --web, web        Start Expo for web
  --dev-client, dev-client
                   Start Expo in development-client mode
  --lan, lan        Start Expo using LAN transport
  --tunnel, tunnel Start Expo using tunnel transport
  --export-web, export-web
                   Export the web build locally
  --doctor, doctor Run Expo diagnostics
  --help, help     Show this help

Environment:
  PORT=8082         Start Metro on a specific port when 8081 is occupied
  EXPO_CLI='...'    Override the Expo command, for example: EXPO_CLI='pnpm exec expo'

Examples:
  ./script/build_and_run.sh
  PORT=8082 ./script/build_and_run.sh
  PORT=8082 ./script/build_and_run.sh --tunnel
USAGE
}

resolve_expo_cmd() {
  if [[ -n "${EXPO_CLI:-}" ]]; then
    # shellcheck disable=SC2206
    EXPO_CMD=(${EXPO_CLI})
    return
  fi

  if [[ -f "$ROOT_DIR/pnpm-lock.yaml" ]] && command -v pnpm >/dev/null 2>&1; then
    EXPO_CMD=(pnpm exec expo)
  elif [[ -f "$ROOT_DIR/yarn.lock" ]] && command -v yarn >/dev/null 2>&1; then
    EXPO_CMD=(yarn expo)
  elif { [[ -f "$ROOT_DIR/bun.lock" ]] || [[ -f "$ROOT_DIR/bun.lockb" ]]; } && command -v bun >/dev/null 2>&1; then
    EXPO_CMD=(bunx expo)
  else
    EXPO_CMD=(npx expo)
  fi
}

run_doctor() {
  if [[ -f "$ROOT_DIR/pnpm-lock.yaml" ]] && command -v pnpm >/dev/null 2>&1; then
    pnpm exec expo-doctor
  elif [[ -f "$ROOT_DIR/yarn.lock" ]] && command -v yarn >/dev/null 2>&1; then
    yarn expo-doctor
  elif { [[ -f "$ROOT_DIR/bun.lock" ]] || [[ -f "$ROOT_DIR/bun.lockb" ]]; } && command -v bun >/dev/null 2>&1; then
    bunx expo-doctor
  else
    npx expo-doctor
  fi
}

resolve_expo_cmd

EXPO_START_ARGS=()
if [[ -n "${PORT:-}" ]]; then
  EXPO_START_ARGS+=(--port "$PORT")
fi

case "$MODE" in
  start | run)
    exec "${EXPO_CMD[@]}" start "${EXPO_START_ARGS[@]}"
    ;;
  --ios | ios)
    exec "${EXPO_CMD[@]}" start --ios "${EXPO_START_ARGS[@]}"
    ;;
  --android | android)
    exec "${EXPO_CMD[@]}" start --android "${EXPO_START_ARGS[@]}"
    ;;
  --web | web)
    exec "${EXPO_CMD[@]}" start --web "${EXPO_START_ARGS[@]}"
    ;;
  --dev-client | dev-client)
    exec "${EXPO_CMD[@]}" start --dev-client "${EXPO_START_ARGS[@]}"
    ;;
  --lan | lan)
    exec "${EXPO_CMD[@]}" start --lan "${EXPO_START_ARGS[@]}"
    ;;
  --tunnel | tunnel)
    exec "${EXPO_CMD[@]}" start --tunnel "${EXPO_START_ARGS[@]}"
    ;;
  --export-web | export-web)
    cd "$ROOT_DIR"
    exec pnpm mobile:build:web
    ;;
  --doctor | doctor)
    run_doctor
    ;;
  --help | help)
    show_usage
    ;;
  *)
    show_usage >&2
    exit 2
    ;;
esac
