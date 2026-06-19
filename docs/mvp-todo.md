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
- [ ] Complete Figma Make publishing parity before tester recruitment.
- [ ] Recruit first tester cohort.
  - [x] Prepare recruiting message.
  - [x] Prepare first 10 tester operating packet.
  - [ ] Confirm distribution path.
  - [ ] Confirm feedback URL.
  - [ ] Fill first tester list.
  - [ ] Decide privacy/legal review scope before inviting non-close-contact users.

Exit criteria:

- Closed MVP can be distributed to testers.

## Phase 8: Chat-First Pivot

Goal: make AI consultation the primary way to create and revise plans.

Todos:

- [x] Define chat planner JSON action contract.
- [x] Add mock chat planner response generation.
- [x] Build consultation chat screen.
- [x] Render confirmation cards for meal, exercise, and revision actions.
- [x] Apply approved chat actions to plan state.
- [x] Add route history for chat, today, adjustment, and settings.
- [x] Update Expo run script for port and tunnel reliability.

Exit criteria:

- User can chat, approve a suggested meal or exercise, and see it in the plan.
- User can chat a revision and approve a plan change.
- Web route history and native back behavior are not just local boolean state.

## Phase 9: Figma Make Publishing Parity

Goal: rebuild the mobile UI so every MVP screen follows `figma_make/src/app/App.tsx` structure before recruiting testers.

Source of truth:

- `figma_make/src/app/App.tsx`
- `figma_make/src/styles/theme.css`
- User screenshots from the Figma Make published flow.

Do not infer shapes, icons, headers, or screen states when the Figma Make file defines them.

Todos:

- [x] Create a Figma Make parity map.
  - [x] List each Figma Make screen: login, onboarding, chat, chat-proposal, today-plan, recovery-reasons, plan-approval.
  - [x] Map each screen to the current React Native screen/component file.
  - [x] Mark missing, extra, or structurally different UI regions.
- [x] Replace the incorrect custom brand mark.
  - [x] Use the actual Figma Make icon source instead of a hand-drawn approximation.
  - [x] Add the required native icon strategy, such as `lucide-react-native`, if the app does not already have it.
  - [x] Use `Leaf` exactly where Figma Make uses `Leaf`.
  - [x] Use `Coffee`, `Moon`, `Dumbbell`, `Plane`, `Heart`, `HelpCircle`, `RotateCcw`, `Send`, `Utensils`, `Zap`, `Check`, `ArrowRight`, and `ChevronLeft` only where the Figma Make file uses them.
- [x] Fix screen header rules.
  - [x] Login and onboarding use the small brand row, not the chat top bar.
  - [x] Chat and chat-proposal use the bordered top bar with back button on the left, centered brand, and right spacer or action.
  - [x] Today uses the compact header from Figma Make: back on left, small brand on right.
  - [x] Recovery reasons and plan approval use the back button/title block layout, not a centered app header.
  - [x] Do not add a header where the Figma Make screen does not have one.
- [x] Rebuild the chat screen to match the initial published state.
  - [x] Initial chat shows only the onboarding-based welcome bubble.
  - [x] Remove fake multi-message conversation from the initial state unless it is generated by user action.
  - [x] Preserve the large empty chat canvas and docked input from the reference.
  - [x] Replace visible AI wording with product language while keeping the same layout.
- [x] Rebuild the chat proposal card.
  - [x] Match the dashed proposal header, icon, type label, item rows, footnote, dismiss button, and approve button.
  - [x] Use the Figma Make two-button action layout.
  - [x] Do not mutate the plan before approval.
- [x] Rebuild the today plan screen.
  - [x] Match the compact top area, date, serif title, progress rail, meal/exercise section headers, cards, skip pills, and bottom coral recovery CTA.
  - [x] Confirm the design matches the user-approved Image #1 compact version, not the earlier oversized Image #2 version.
- [x] Rebuild the recovery reason screen.
  - [x] Show seven Figma Make reasons: 회식, 야근, 폭식, 운동 못했어요, 여행 / 외출, 몸 상태, 기타.
  - [x] Use the actual Figma Make icon set and selected coral styling.
  - [x] Keep domain mapping internal when multiple UI reasons map to one adjustment reason.
- [x] Rebuild the revised plan approval screen.
  - [x] Match assistant bubble, before/after comparison card, divider, badges, reassurance row, approve button, and secondary "다시 제안받기" button.
- [ ] Run visual QA before marking this phase done.
  - [x] Export web build.
  - [x] Capture screenshots for login, chat, chat-proposal, today, recovery-reasons, and plan-approval.
  - [ ] Decide whether RN should restore a routable onboarding screen or keep the chat-first guest entry before capturing onboarding.
  - [x] Compare captured screenshots against `figma_make` state by state.
  - [x] Fix mismatches before committing.

Exit criteria:

- The UI uses the same screen structure, icon language, header rules, card hierarchy, and button colors as Figma Make.
- Any remaining differences are intentionally documented before moving back to tester recruitment.

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
