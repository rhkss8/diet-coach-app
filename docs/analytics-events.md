# Analytics Events

## Goal

The 50-user MVP test must answer whether chat-generated plan actions help users continue after reality breaks the original plan.

## Primary Metrics

- Consultation start rate.
- Chat planner response generation rate.
- Chat action approval rate.
- Chat revision approval rate.
- Return within 24 hours after approved adjustment.
- Next plan item completion after approved adjustment.
- 7-day retention.

## Event Naming Rules

- Use uppercase snake case.
- Event names describe user actions or system milestones.
- Keep payloads small and structured.

## Required Events

### Consultation

- `CHAT_CONSULTATION_STARTED`
- `CHAT_PLANNER_RESPONSE_GENERATED`
- `CHAT_PLANNER_ACTION_APPROVED`

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
- `PLAN_ITEM_COMPLETED_AFTER_REVISION`

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

### Chat Planner Events

```ts
{
  userId: string;
  responseType:
    | "meal_plan_suggestion"
    | "exercise_plan_suggestion"
    | "plan_revision_suggestion"
    | "clarification_question";
  action?: "add_meal_to_plan" | "add_exercise_to_plan" | "apply_plan_revision";
  planId?: string;
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

- How many users started chat consultation?
- How many users received a structured meal, exercise, or revision suggestion?
- How many users approved a chat-generated action?
- How many users clicked "Adjust today"?
- Which adjustment reason was most common?
- How many approved a revision?
- How many returned within 24 hours after revision?
- How many completed the next plan item after revision?
- Did adjusted users retain better than non-adjusted users?
