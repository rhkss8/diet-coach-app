# G-Stack

## G1. Goal Stack
### MVP Goal
Prove that users continue after manually adjusting a diet plan.

### Core Loop
Onboarding -> initial plan -> approval -> today plan -> manual adjustment -> revision approval -> continued plan.

### Primary Metric
Return within 24 hours after approved plan revision.

### Secondary Metrics
- Onboarding completion rate.
- Plan approval rate.
- Adjustment entry rate.
- Adjustment approval rate.
- 7-day retention.

### Non-Goals
- Calorie precision as the main value.
- Automatic failure detection.
- Infinite AI chat.
- Community.
- Wearable integration.
- Paid subscription in MVP.

## G2. Growth Stack
### First 10 Users
Close contacts who match the persona and can give detailed feedback.

### First 50 Users
Korean users who have tried diet apps or coaching and felt existing tools were too rigid.

### Acquisition Channel
Founder-led recruiting, small communities, personal network, and direct outreach.

### Feedback Channel
In-app feedback link plus direct interview for early testers.

### Retention Hypothesis
Users who approve at least one plan revision are more likely to return because the app reframes a changed day as continuation.

## G3. Governance Stack
### Scope Guardrails
Build only what moves the core loop forward.

### Decision Log
Use `docs/decision-log.md`.

### Definition of Done
Use `docs/mvp-execution-harness.md`.

### Stop Conditions
Use `docs/agent-runbook.md`.

### Release Gates
Use `docs/qa-checklist.md`.

## G4. Ground Truth Stack
### Analytics Events
Use `docs/analytics-events.md`.

### User State Model
New -> onboarded -> plan generated -> plan approved -> active today -> adjustment requested -> revision approved -> returned.

### Dashboard Questions
- Did users reach an approved plan?
- Did users find "Adjust today"?
- Did users approve revisions?
- Did users return after revisions?

### QA Checklist
Use `docs/qa-checklist.md`.

### Manual Observation Plan
Watch at least 5 testers complete onboarding, approve a plan, and find the adjustment entry point.

## G5. Generation Stack
### AI Functions
- `generateInitialPlan`
- `adjustTodayPlan`
- `summarizeProgress`

### JSON Contracts
Use `docs/ai-contracts.md`.

### Prompt Fixtures
Use `tests/fixtures` once the test harness exists.

### Regression Checks
Every prompt change must run fixture tests.

### Fallback Behavior
Invalid AI output must not change the user's plan. Show a retry or safe mock fallback.

