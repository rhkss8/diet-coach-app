# Agent Runbook

## Mission
Build the MVP until the core loop is complete:

`[Core loop from docs/g-stack.md]`

Use `docs/new-service-starter-protocol.md` as the reusable kickoff protocol.

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

## Work Selection
Pick the first incomplete todo that unlocks the core loop.

Priority order:
1. Foundation.
2. Product contracts.
3. First core action.
4. Main repeated use flow.
5. Persistence and analytics.
6. Real AI integration if applicable.
7. Release readiness.

Do not spend cycles on non-MVP features.

## Implementation Rule
Prefer vertical slices over horizontal infrastructure.

Good:
- Input -> mock result -> review -> persisted result.

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

## Lesson-And-Run Loop
At the end of each meaningful discussion, implementation slice, QA pass, or user feedback review:

1. If a decision was made, update `docs/decision-log.md`.
2. If a reusable lesson emerged, update `docs/lessons-and-rules.md`.
3. If the lesson affects execution, update the relevant harness doc.
4. If the same rule appears in multiple projects or survives one vertical slice, mark it as a reusable starter candidate.

Do not let important project knowledge live only in chat.
