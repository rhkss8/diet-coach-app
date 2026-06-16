# MVP Execution Harness

## Objective

Ship a focused MVP that proves one core loop:

User creates a diet plan, life changes, user requests an adjustment, and the app helps them continue without feeling like they failed.

The MVP is not a food recognition app, calorie tracker, health diagnosis tool, generic AI coach, or community app.

This project follows the reusable new-service kickoff protocol in `docs/new-service-starter-protocol.md`.

## Core Loop

1. User completes onboarding.
2. App generates a 7-day plan.
3. User approves the plan.
4. User follows today's plan.
5. User taps "Adjust today" when reality changes.
6. App proposes a revised remaining plan.
7. User approves the revision.
8. App carries the changed plan forward.

## MVP Scope

### Must Have

- Onboarding with basic profile, target, and 3 lifestyle questions.
- 7-day initial meal and exercise plan generation.
- Plan approval screen.
- Today plan screen.
- Manual adjustment entry point.
- Adjustment reason selection.
- Revised plan proposal.
- Plan revision approval.
- PlanRevision history as the core data asset.
- Progress screen with simple weekly execution metrics.
- Analytics events for every step in the core loop.

### Should Have

- Food input by text as an adjustment aid.
- Food input by photo if API cost and implementation time remain acceptable.
- Soft notification permission recommendation after onboarding or on main entry.
- Admin/debug view for user plan and revision history.

### Not MVP

- Community.
- Shopping or supplement recommendation.
- Exercise video library.
- Wearable or InBody integration.
- Global food database.
- Infinite free-form AI chat.
- Complex calorie accounting UI.
- Paid subscription.

## Product Principles

- The app does not detect failure. The user asks for adjustment.
- The app does not scold. It helps the user continue.
- The app does not optimize for calorie precision. It optimizes for plan continuity.
- The app should make the adjustment path easier than quitting.
- Every AI output must be reviewable and editable before it changes the plan.
- Food logging is an input to plan adjustment, not the center of the product.
- The first post-onboarding screen is Today Plan, not a food diary or chatbot.

## MVP Priority

1. AI plan generation.
2. Today plan execution.
3. Manual adjustment and PlanRevision approval.
4. Progress and continuation feedback.
5. Food text/photo input as a supporting input for adjustment.

## Food Log Positioning

Food logging should answer:

- "What changed today?"
- "How should the remaining plan adapt?"

It should not make the product feel like a calorie audit.

If image recognition feels uncertain, the user must be able to correct it quickly or use text input instead.

## PlanRevision Data Asset

PlanRevision is the MVP's most important learning record.

Track:

- Why the user requested adjustment.
- Which items changed.
- Which revision the user approved.
- Whether the user returned after approval.
- Whether the user executed the next plan item.

## Harness Layers

### Product Harness

Defines scope, flows, success metrics, and what must not be built yet.

### Design Harness

Defines tone, visual language, and UX patterns for a calm recovery-focused diet planner.

### Frontend Harness

Defines code quality rules for maintainable React Native development.

### AI Harness

Defines prompt contracts, JSON schemas, fixtures, and regression tests.

### Data Harness

Defines database entities, event names, and revision traceability.

### QA Harness

Defines acceptance tests for the core loop and edge cases.

## Definition of Done

The MVP is done only when all are true:

- A new user can complete onboarding.
- A user can generate and approve a 7-day plan.
- A user can view today's plan.
- A user can manually request an adjustment.
- A revised plan is generated, reviewed, approved, and persisted.
- Plan revision history is stored.
- Analytics events are emitted for the full core loop.
- The app runs on a local dev build.
- The main flow has at least one automated or scripted regression check.
- Manual QA passes on a fresh user account.
