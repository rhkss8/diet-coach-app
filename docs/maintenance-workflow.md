# Maintenance Workflow

## Purpose

Use this workflow for bug fixes, regressions, refactors, and user-requested corrections after the MVP already exists.

Maintenance work is different from starter work:

- Starter work creates or expands the MVP.
- Maintenance work preserves existing behavior, changes only the requested surface, and proves the fix.

## Modes

### Default Mode: `tars maintain`

Use this for narrow corrections where the requested behavior and source of truth are clear.

Read only:

- Current git diff/status.
- Directly relevant code and tests.
- Directly relevant source-of-truth material, if named by the user or required by the bug.

Then follow the required flow below. Keep updates and final reporting concise.

### Hard Mode: `tars maintain --hard`

Use this for production-facing changes, release blockers, visual parity work, route/user-flow changes, and any correction that could affect tester distribution or core-loop trust.

Read the full maintenance harness:

- `.codex/skills/tars-maintenance/SKILL.md`
- `docs/maintenance-workflow.md`
- `docs/lessons-quick.md`
- `docs/agent-runbook.md`
- Relevant routing docs from `docs/skills-and-agents.md`
- `docs/decision-gates.md`
- Relevant design/product/QA docs for the changed surface

Hard mode may include visual QA artifacts, parity-map updates, manual QA notes, `tars done`, and commit-hook verification.

## Required Flow

1. Restate the requested outcome.
2. Read the relevant code, tests, docs, and current git diff.
3. Reproduce or explain the current behavior from evidence.
4. Identify the root cause before editing.
5. Choose the smallest safe fix.
6. Add or update a regression check when practical.
7. Run `tars verify`.
8. Report exactly what changed, what passed, what was not checked, and what risk remains.

## Root Cause Rule

Do not modify code until you can state:

- What is wrong.
- Where it starts.
- Why the requested change fixes that cause.
- What existing behavior must not change.

## Scope Rule

Allowed:

- Local bug fixes.
- Small refactors needed to make the fix clear.
- Regression tests or targeted checks.
- Documentation updates when a reusable lesson emerges.

Not allowed unless the user asks:

- New product direction.
- UI redesign.
- Large architecture rewrite.
- Unrelated cleanup.
- Broad dependency churn.

## Completion Rule

Completion requires evidence:

- `tars verify` passed, or failed checks are reported with cause and next action.
- The final response names changed files and verification.
- Any skipped checks are explicitly listed.
