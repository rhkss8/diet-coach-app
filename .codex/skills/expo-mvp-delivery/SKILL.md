---
name: expo-mvp-delivery
description: Use for this Diet Coach Expo app whenever working on Expo run loops, EAS/TestFlight or preview distribution, web export builds, SDK upgrades, native device QA, Expo networking/API calls, or Codex Run actions. Routes to official Expo Skills and applies this project's pnpm, TARS, and MVP release guardrails.
---

# Expo MVP Delivery

Use this skill before Expo-specific work in this repo.

## Project Defaults

- Workspace root: `diet-coach-app`
- Expo app root: `apps/mobile`
- Package manager: `pnpm`
- Node: `20.19.4` or newer
- Local web build: `pnpm mobile:build:web`
- Primary checks: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm format:check`
- TARS rule: complete the current todo, commit it, then continue unless blocked by credentials, external accounts, or user decision.

## Official Expo Skill Routing

Use the official Expo Skills from `expo@openai-curated` when available.

- Deployment, TestFlight, Play Store, EAS Hosting: `expo-deployment`
- Native tester/dev builds and dev-client workflows: `expo-dev-client`
- Codex app Run button and Expo run actions: `codex-expo-run-actions`
- SDK upgrades and dependency/version issues: `upgrading-expo`
- Network/API/fetch/auth request work: `native-data-fetching`
- Expo UI/native UI packages: `building-native-ui`, `expo-ui-swift-ui`, or `expo-ui-jetpack-compose`
- CI/CD build pipelines: `expo-cicd-workflows`

If official skills are not active in the current session, consult the installed Expo plugin cache or official docs:

- `https://docs.expo.dev/skills/`
- `https://docs.expo.dev/llms.txt`

## Run Loop

Prefer the project-local action script:

```bash
./script/build_and_run.sh --help
./script/build_and_run.sh
./script/build_and_run.sh --web
./script/build_and_run.sh --export-web
./script/build_and_run.sh --doctor
```

Do not use EAS Build, EAS Submit, TestFlight, Play Store, or public deployment without asking the user first.

## Release Decision Gates

Ask before:

- Creating or logging into EAS, Apple, or Google accounts.
- Running remote EAS builds or store submissions.
- Sending tester invites.
- Publishing web or native builds outside local QA.
- Adding paid services or external monitoring.

Do not ask before:

- Running local checks.
- Running local web export.
- Updating docs, TARS todo, QA reports, or local run scripts.
- Fixing Expo dependency mismatches needed for local QA.

## Build Expectations

For closed MVP readiness, produce:

- Local web export build result in `docs/build-report.md`.
- Manual QA result in `docs/manual-qa-report.md`.
- Test result in `docs/test-suite-report.md`.
- Native distribution decision in `docs/tester-cohort-recruitment.md` or `docs/decision-log.md`.

Native tester distribution is not ready until a fresh install path passes on a real device.
