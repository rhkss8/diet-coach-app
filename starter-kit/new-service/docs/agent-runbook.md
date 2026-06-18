# Agent Runbook

## Mission

Build the MVP until the core loop is complete:

`[Core loop from docs/g-stack.md]`

Use `docs/new-service-starter-protocol.md` as the reusable kickoff protocol.

## Start Every Work Cycle

1. Read `docs/agent-runbook.md`.
2. Read `docs/lessons-quick.md`.
3. Read `docs/mvp-todo.md`.
4. Read `docs/mvp-execution-harness.md`.
5. Read `docs/decision-log.md`.
6. Read `docs/lessons-and-rules.md`.
7. Read `docs/decision-gates.md`.
8. If doing maintenance, bug fixes, corrections, or refactors, read `.codex/skills/tars-maintenance/SKILL.md` and `docs/maintenance-workflow.md`.
9. If resuming from another PC, read `docs/workstation-handoff.md`.
10. If changing kickoff structure, read `docs/new-service-starter-protocol.md` and `docs/new-service-copy-pack.md`.
11. If changing product definition, read `docs/service-definition.md`, `docs/g-stack.md`, and `docs/superpowers.md`.
12. If touching UI, UX, visual design, or copy, read `docs/design-production-pipeline.md`, `docs/design-reference-brief.md`, `docs/design-philosophy.md`, `docs/interaction-principles.md`, `docs/design-system-spec.md`, `docs/service-design-blueprint.md`, `docs/design-tone-and-manner.md`, `docs/design-review-rubric.md`, and `docs/design-qa-checklist.md`.
13. If touching frontend code, read `docs/frontend-engineering-standards.md`.
14. If touching AI behavior, read `docs/ai-contracts.md`.
15. If touching metrics, read `docs/analytics-events.md`.
16. If testing or preparing release, read `docs/qa-checklist.md` and `docs/design-qa-checklist.md`.

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

- Build a large design library before any user flow works.
- Build AI infrastructure before a mock flow exists.
- Build auth before local core loop is proven.

## Maintenance Rule

For existing behavior, use `.codex/skills/tars-maintenance/SKILL.md`.

Maintenance work must:

- Restate the requested outcome.
- Establish current behavior and root cause before editing.
- Keep the fix scoped to the request.
- Preserve unrelated behavior.
- Add a regression check when practical.
- Run `tars verify` before completion.

Design rule:

- Do not jump from abstract design philosophy directly into code.
- Before major UI work, produce a reference scan, 2 to 3 visual territories, a direction decision, a wireframe plan, and a high-fidelity screen plan.
- Define design philosophy, interaction principles, and the MVP design system before building repeated UI.
- Keep the design system small enough to serve the first vertical slice.
- Run design review and design QA before marking a UI slice complete.

## Quality Rule

Frontend code must follow `docs/frontend-engineering-standards.md`.

Any code that mixes UI, policy, API, navigation, and analytics in one component should be refactored before moving on.

Every exported function, hook, domain helper, AI/API boundary, persistence helper, and flow-coordinating component should include useful TSDoc. Comments should explain ownership, intent, product rule, or flow guarantees, not repeat syntax.

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

1. Run `tars verify`.
2. Run `tars done`.
3. Commit the completed slice.
4. Then run `tars next`.

The git pre-commit hook should run the same checks. Do not bypass it unless the user explicitly asks.

## Lesson-And-Run Loop

At the end of each meaningful discussion, implementation slice, QA pass, or user feedback review:

1. If a decision was made, update `docs/decision-log.md`.
2. If a reusable lesson emerged, update `docs/lessons-and-rules.md`.
3. If the lesson affects execution, update the relevant harness doc.
4. If the same rule appears in multiple projects or survives one vertical slice, mark it as a reusable starter candidate.

Do not let important project knowledge live only in chat.
