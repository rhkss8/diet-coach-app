# MVP Todo

## Execution Rule

Work in vertical slices. A slice is complete only when product flow, data, AI contract, UI, analytics, and basic QA are connected.

Avoid building isolated screens that do not move the core loop forward.

## Phase 0: Foundation

Goal: create the development harness.

Todos:

- [x] Create Expo React Native app.
- [x] Create TypeScript workspace structure.
- [x] Add formatting and linting.
- [x] Add test runner.
- [x] Add route structure.
- [x] Add shared UI primitives.
- [x] Add domain model package.
- [x] Add AI package.
- [x] Add DB package.
- [x] Add environment variable convention.

Exit criteria:

- App starts locally.
- TypeScript checks run.
- Tests run.
- Repo has clear package boundaries.

## Phase 1: Product Contracts

Goal: define contracts before building UI deeply.

Todos:

- [x] Define domain types: User, Goal, Plan, PlanItem, PlanRevision, AdjustmentRequest, DailyCheckIn.
- [x] Define AI JSON schemas.
- [x] Define analytics event names.
- [x] Define initial fixture users.
- [x] Define adjustment fixture cases.
- [x] Define core flow acceptance criteria.

Exit criteria:

- AI and UI share the same domain terms.
- Fixture tests can run without the mobile app.

## Phase 2: Onboarding to Plan

Goal: user can create and approve the first plan.

Todos:

- [x] Build onboarding basic profile step.
- [x] Build goal setup step.
- [x] Build 3-question lifestyle step.
- [x] Generate mock 7-day plan.
- [x] Build plan approval screen.
- [x] Persist approved plan locally or in DB.
- [x] Track onboarding and plan approval events.

Exit criteria:

- Fresh user can reach an approved plan.

## Phase 3: Today Plan

Goal: user can act on today's plan.

Todos:

- [x] Build Today screen.
- [x] Show meals and exercise.
- [x] Add completion check controls.
- [x] Add daily progress summary.
- [x] Track plan item completion events.

Exit criteria:

- User can complete or skip today's plan items.

## Phase 4: Manual Adjustment

Goal: user can request a plan adjustment.

Todos:

- [x] Add "Adjust today" entry point.
- [x] Build adjustment reason selection.
- [x] Add optional short text input.
- [x] Generate mock revised plan.
- [x] Build revised plan review screen.
- [x] Persist PlanRevision.
- [x] Apply approved revision to today and future plan items.
- [x] Track adjustment events.

Exit criteria:

- User can change the plan and continue.

## Phase 5: Real AI Integration

Goal: replace mocks with structured AI calls.

Todos:

- [x] Implement initial plan generation prompt.
- [x] Implement adjustment prompt.
- [x] Enforce JSON schema validation.
- [x] Add fallback for invalid AI output.
- [x] Add AI fixture regression tests.
- [x] Add cost/logging guardrails.

Exit criteria:

- AI output can be trusted by UI after schema validation.

## Phase 6: Persistence and Analytics

Goal: make MVP measurable.

Todos:

- [x] Set up Supabase project.
- [x] Add DB schema migrations.
- [x] Add auth.
- [x] Persist users, goals, plans, items, revisions, and check-ins.
- [x] Add analytics provider.
- [x] Verify full event coverage.

Exit criteria:

- 50-user test can produce useful data.

## Phase 7: Release Readiness

Goal: prepare closed MVP test.

Todos:

- [x] Add notification permission recommendation.
- [x] Add basic settings screen.
- [x] Add privacy policy link.
- [x] Add terms link.
- [x] Add feedback channel.
- [x] Run full manual QA.
- [x] Run test suite.
- [x] Create build.
- [ ] Recruit first tester cohort.

Exit criteria:

- Closed MVP can be distributed to testers.

## Non-Stop Loop

For every scheduled work cycle:

1. Read this file.
2. Pick the highest incomplete todo that moves the core loop forward.
3. Read the relevant harness docs.
4. Implement the smallest complete slice.
5. Run checks.
6. Mark completed todos.
7. Record blockers, decisions, and lessons.
8. Use `docs/decision-gates.md` for any branch that requires user input.
9. Promote repeated lessons into checklist or skill candidates.
10. Continue to the next todo unless blocked by credentials, external accounts, or user decision.
