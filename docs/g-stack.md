# G-Stack

## G1. Goal Stack

### MVP Goal

Prove that users can turn chat consultation into approved meal, exercise, and plan revision actions.

### Core Loop

Chat consultation -> structured AI action -> user confirmation -> plan mutation -> today plan -> chat or plan-based revision.

### Primary Metric

Approval rate of AI chat suggestions and return within 24 hours after an approved revision.

### Secondary Metrics

- Consultation start rate.
- Chat suggestion generation rate.
- Chat suggestion approval rate.
- Plan approval rate.
- Chat-based revision approval rate.
- Next plan item completion after approved revision.
- 7-day retention.

### Non-Goals

- Calorie precision as the main value.
- Automatic failure detection.
- Food recognition as the main value.
- Unstructured infinite AI chat with no reviewable plan action.
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

Users who approve at least one chat-generated plan action are more likely to return because the app turns vague intent into a concrete next plan change.

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

New -> consultation started -> profile inferred -> action suggested -> action approved -> active today -> revision approved -> returned.

### Dashboard Questions

- Did users start consultation?
- Did chat produce a useful action?
- Did users approve meal, exercise, or revision actions?
- Did users return after revisions?
- Did users complete the next plan item after revision?

### QA Checklist

Use `docs/qa-checklist.md`.

### Manual Observation Plan

Watch at least 5 testers start chat consultation, approve an AI suggestion, and find the plan screen after approval.

## G5. Generation Stack

### AI Functions

- `generateInitialPlan`
- `generateChatPlannerResponse`
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
