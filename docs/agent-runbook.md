# Agent Runbook

## Mission

Build the MVP until the core loop is complete:

Onboarding -> initial plan -> plan approval -> today plan -> manual adjustment -> revised plan approval -> continued plan.

Use `docs/new-service-starter-protocol.md` as the reusable kickoff protocol for this and future new services.

## Start Every Work Cycle

1. Read `docs/agent-runbook.md`.
2. Read `docs/mvp-todo.md`.
3. Read `docs/mvp-execution-harness.md`.
4. Read `docs/decision-log.md`.
5. Read `docs/lessons-and-rules.md`.
6. Read `docs/decision-gates.md`.
7. If resuming from another PC, read `docs/workstation-handoff.md`.
8. If changing kickoff structure, read `docs/new-service-starter-protocol.md` and `docs/new-service-copy-pack.md`.
9. If changing product definition, read `docs/service-definition.md`, `docs/g-stack.md`, and `docs/superpowers.md`.
10. If touching UI or copy, read `docs/design-tone-and-manner.md`.
11. If touching frontend code, read `docs/frontend-engineering-standards.md`.
12. If touching AI behavior, read `docs/ai-contracts.md`.
13. If touching metrics, read `docs/analytics-events.md`.
14. If testing or preparing release, read `docs/qa-checklist.md`.
15. If touching Expo run loops, builds, EAS/TestFlight, native device QA, SDK upgrades, or mobile networking, read `.codex/skills/expo-mvp-delivery/SKILL.md`.

## Work Selection

Pick the first incomplete todo that unlocks the core loop.

Priority order:

1. Foundation.
2. Product contracts.
3. Onboarding to plan.
4. Today plan.
5. Manual adjustment.
6. Real AI integration.
7. Persistence and analytics.
8. Release readiness.

Do not spend cycles on non-MVP features.

## Implementation Rule

Prefer vertical slices over horizontal infrastructure.

Good:

- Onboarding data -> mock plan -> approval -> persisted plan.

Bad:

- Build a complete design system before any user flow works.
- Build AI infrastructure before a mock flow exists.
- Build auth before local core loop is proven.

## Quality Rule

Frontend code must follow `docs/frontend-engineering-standards.md`.

Any code that mixes UI, policy, API, navigation, and analytics in one component should be refactored before moving on.

## Stop Conditions

Only stop when:

- A todo requires user credentials or external account setup.
- A product decision is impossible to infer safely.
- A command needs user approval and cannot proceed.
- The MVP definition of done is satisfied.

Use `docs/decision-gates.md` to decide whether to ask the user or continue.

## Status Update Format

At the end of each cycle, report:

- Completed todo.
- Files changed.
- Checks run.
- Next todo.
- Blockers, if any.

## End Every Work Cycle

Before moving to the next todo:

1. Run `pnpm typecheck`.
2. Run `pnpm lint`.
3. Run `pnpm test`.
4. Run `pnpm format:check`.
5. Run `tars done`.
6. Commit the completed slice.
7. Then run `tars next`.

The git pre-commit hook should run the same checks. Do not bypass it unless the user explicitly asks.

## Lesson-And-Run Loop

At the end of each meaningful discussion, implementation slice, QA pass, or user feedback review:

1. If a decision was made, update `docs/decision-log.md`.
2. If a reusable lesson emerged, update `docs/lessons-and-rules.md`.
3. If the lesson affects execution, update the relevant harness doc.
4. If the same rule appears in multiple projects or survives one vertical slice, mark it as a skill candidate.
5. If it becomes stable, promote it into a global skill.

Do not let important project knowledge live only in chat.
