# Agent Runbook

## Mission

Build the MVP until the core loop is complete:

Onboarding -> initial plan -> plan approval -> today plan -> manual adjustment -> revised plan approval -> continued plan.

Use `docs/new-service-starter-protocol.md` as the reusable kickoff protocol for this and future new services.

## Start Every Work Cycle

1. Read `docs/agent-runbook.md`.
2. Read `docs/lessons-quick.md`.
3. Read `docs/mvp-todo.md`.
4. Read `docs/mvp-execution-harness.md`.
5. Read `docs/decision-log.md`.
6. Read `docs/lessons-and-rules.md`.
7. Read `docs/decision-gates.md`.
8. If doing maintenance, bug fixes, corrections, or refactors, read `.codex/skills/tars-maintenance/SKILL.md` and `docs/maintenance-workflow.md`.
9. If resuming after a context reset, break, or another PC, read `docs/reentry-protocol.md` and `docs/workstation-handoff.md`.
10. If changing kickoff structure, read `docs/new-service-starter-protocol.md` and `docs/new-service-copy-pack.md`.
11. If changing product definition, read `docs/service-definition.md`, `docs/g-stack.md`, and `docs/superpowers.md`.
12. If product intent, research, UX, copy, positioning, or design evidence is unclear, read `docs/wiki/schema.md` and `docs/wiki/index.md`.
13. If touching UI or copy, read `docs/design-tone-and-manner.md`.
14. If touching frontend code, read `docs/frontend-engineering-standards.md`.
15. If touching AI behavior, read `docs/ai-contracts.md`.
16. If touching metrics, read `docs/analytics-events.md`.
17. If testing or preparing release, read `docs/qa-checklist.md`.
18. If touching Expo run loops, builds, EAS/TestFlight, native device QA, SDK upgrades, or mobile networking, read `.codex/skills/expo-mvp-delivery/SKILL.md`.

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

## Maintenance Rule

For existing behavior, use `.codex/skills/tars-maintenance/SKILL.md`.

Maintenance work must:

- Restate the requested outcome.
- Establish current behavior and root cause before editing.
- Keep the fix scoped to the request.
- Preserve unrelated behavior.
- Add a regression check when practical.
- Run `tars verify` before completion.

## Knowledge Wiki Rule

Use `docs/inbox/` and `docs/wiki/` as an optional Karpathy-style plain Markdown knowledge graph.

- Humans put original source material in `docs/inbox/`.
- Codex updates `docs/wiki/` with `[[Wiki Links]]` using `docs/wiki/schema.md`.
- Do not read wiki for every task.
- Read wiki only when product intent, research, UX, copy, positioning, or design evidence matters.
- For narrow maintenance, current code, tests, and user request come first.
- If wiki conflicts with source material, current code, tests, or user request, ask which source wins.

## Re-Entry Rule

When resuming after a context reset, machine switch, or long break:

- Do not restart from scratch.
- Follow `docs/reentry-protocol.md`.
- Reconstruct state from git status, TARS status, open todo, and current diff.
- Report branch, worktree state, next todo, applicable workflow, and blockers before editing.

## Quality Rule

Frontend code must follow `docs/frontend-engineering-standards.md`.

Any code that mixes UI, policy, API, navigation, and analytics in one component should be refactored before moving on.

Every exported function, hook, domain helper, AI/API boundary, persistence helper, and flow-coordinating component should include useful TSDoc. Comments should explain ownership, intent, product rule, or flow guarantees, not repeat syntax.

## Stop Conditions

Only stop when:

- A todo requires user credentials or external account setup.
- A product decision is impossible to infer safely.
- The agent must guess because the docs, design source, code, and user request disagree or leave an important detail ambiguous.
- A command needs user approval and cannot proceed.
- The next step crosses an approval gate in `docs/decision-gates.md`.
- The MVP definition of done is satisfied.

Use `docs/decision-gates.md` to decide whether to ask the user or continue.

## Ambiguity Rule

Do not silently bridge gaps with assumptions.

If a screen, icon, route, copy block, product rule, or implementation detail differs from the agent's understanding, pause and ask the user using the decision-gate format before editing.

Default behavior:

- Direct source exists: follow it exactly.
- Source is missing: ask if the choice affects user-visible behavior, design, product positioning, data, cost, or release quality.
- Source conflicts with previous work: ask which source wins before changing code.
- Tiny internal implementation choice with no user-visible effect: proceed and document only if useful.

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
4. If the same rule appears in multiple projects or survives one vertical slice, mark it as a skill candidate.
5. If it becomes stable, promote it into a global skill.

Do not let important project knowledge live only in chat.
