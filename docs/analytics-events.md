# Analytics Events

## Goal
The 50-user MVP test must answer whether manual plan adjustment improves continuation.

## Primary Metrics
- Onboarding completion rate.
- Plan approval rate.
- Adjustment entry rate.
- Adjustment approval rate.
- Return within 24 hours after approved adjustment.
- 7-day retention.

## Event Naming Rules
- Use uppercase snake case.
- Event names describe user actions or system milestones.
- Keep payloads small and structured.

## Required Events
### Onboarding
- `ONBOARDING_STARTED`
- `PROFILE_STEP_COMPLETED`
- `GOAL_STEP_COMPLETED`
- `LIFESTYLE_STEP_COMPLETED`
- `ONBOARDING_COMPLETED`

### Plan
- `INITIAL_PLAN_GENERATION_STARTED`
- `INITIAL_PLAN_GENERATION_SUCCEEDED`
- `INITIAL_PLAN_GENERATION_FAILED`
- `PLAN_APPROVED`
- `PLAN_REGENERATED`

### Today
- `TODAY_SCREEN_VIEWED`
- `PLAN_ITEM_COMPLETED`
- `PLAN_ITEM_SKIPPED`

### Adjustment
- `ADJUST_TODAY_CLICKED`
- `ADJUSTMENT_REASON_SELECTED`
- `ADJUSTMENT_NOTE_SUBMITTED`
- `PLAN_ADJUSTMENT_GENERATION_STARTED`
- `PLAN_ADJUSTMENT_GENERATION_SUCCEEDED`
- `PLAN_ADJUSTMENT_GENERATION_FAILED`
- `PLAN_REVISION_APPROVED`
- `PLAN_REVISION_DISMISSED`

### Return
- `APP_OPENED_AFTER_REVISION`
- `NEXT_DAY_RETURNED_AFTER_REVISION`

### Notification
- `NOTIFICATION_PROMPT_SHOWN`
- `NOTIFICATION_PROMPT_ACCEPTED`
- `NOTIFICATION_PROMPT_DISMISSED`

## Minimum Payloads
### Adjustment Events
```ts
{
  userId: string;
  planId: string;
  affectedDate: string;
  reason?: "meal_changed" | "missed_exercise" | "schedule_changed" | "want_replan";
}
```

### Plan Item Events
```ts
{
  userId: string;
  planId: string;
  planItemId: string;
  type: "meal" | "exercise";
  date: string;
}
```

## Dashboard Questions
At the end of the MVP test, answer:
- How many users reached an approved plan?
- How many users clicked "Adjust today"?
- Which adjustment reason was most common?
- How many approved a revision?
- How many returned within 24 hours after revision?
- Did adjusted users retain better than non-adjusted users?

