# AI Contracts

## Goal

AI must produce structured, reviewable plan outputs. It must not behave like an unconstrained chatbot inside core product flows.

Recommendation logic is defined in `docs/plan-recommendation-algorithm.md`. Prompt and schema changes should preserve that algorithm: user context first, structured plan action second, approval before mutation.

## AI Functions

### generateChatPlannerResponse

Input:

- Current chat messages.
- Optional current plan.
- Optional inferred profile context.

Output:

- User-facing assistant message.
- Structured action type.
- Optional meal item suggestion.
- Optional exercise item suggestion.
- Optional plan revision suggestion.
- Confirmation label and action.

The app must render the message as chat and the structured action as a confirmation card. The plan is not changed until the user confirms.

### generateInitialPlan

Input:

- User profile.
- Goal.
- Lifestyle answers.

Output:

- 7-day plan.
- Meal items.
- Exercise items.
- Short rationale.
- Adjustment notes.

### adjustTodayPlan

Input:

- Current plan.
- Today plan.
- Completed items.
- Adjustment request.
- Optional food text or photo interpretation.

Output:

- Revision summary.
- Updated remaining items for today.
- Optional future plan changes.
- Encouraging explanation.

### summarizeProgress

Input:

- Weekly completion data.
- Revision history.
- Recent check-ins.

Output:

- Short progress summary.
- One practical suggestion.
- No shame or diagnosis.

## Output Rules

- Return JSON only for product flows.
- Use domain terms from `docs/frontend-engineering-standards.md`.
- Include user-facing copy separately from structured plan data.
- Do not include medical diagnosis.
- Do not overstate calorie precision.
- Do not shame the user.
- Do not use hard coaching copy unless the user explicitly opted into it.
- Treat food text/photo interpretation as context for plan adjustment, not as the final product output.
- Do not update persisted plan data until the user approves.

## Initial JSON Shapes

### Plan

```ts
type Plan = {
  id?: string;
  goalId: string;
  startDate: string;
  endDate: string;
  summary: string;
  items: PlanItem[];
};
```

### PlanItem

```ts
type PlanItem = {
  id?: string;
  date: string;
  type: "meal" | "exercise";
  slot: "breakfast" | "lunch" | "dinner" | "snack" | "workout";
  title: string;
  description: string;
  intensity?: "light" | "moderate" | "challenging";
  status?: "pending" | "completed" | "skipped" | "adjusted";
};
```

### PlanningContext

```ts
type PlanningContext = {
  managementIntent: {
    goalTypes: Array<
      | "weight_loss"
      | "health_management"
      | "habit_improvement"
      | "routine_recovery"
      | "schedule_recovery"
      | "other"
    >;
    preferredMethods?: string[];
    reasonText?: string;
    coachingPreference?: "gentle" | "practical" | "direct";
  };
  foodContext: {
    preferredFoods: string[];
    foodsToKeep: string[];
    avoidedFoods: string[];
    allergies: string[];
    eatingContext?: string[];
  };
  routineContext: {
    wakeTime?: string;
    mealWindows: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
      snack?: string;
    };
    workEndTime?: string;
    exerciseWindows: string[];
    riskMoments: string[];
    rawRoutineText: string;
  };
};
```

`PlanningContext` is optional for legacy flows, but guided onboarding and chat-first recommendation should pass it whenever available.

### AdjustmentRequest

```ts
type AdjustmentRequest = {
  reason: "meal_changed" | "missed_exercise" | "schedule_changed" | "want_replan";
  note?: string;
  affectedDate: string;
};
```

### PlanRevision

```ts
type PlanRevision = {
  planId: string;
  affectedDate: string;
  reason: AdjustmentRequest["reason"];
  summary: string;
  userMessage: string;
  updatedTodayItems: PlanItem[];
  updatedFutureItems?: PlanItem[];
  changedItemIds: string[];
};
```

### ChatPlannerResponse

```ts
type ChatPlannerResponse =
  | {
      type: "meal_plan_suggestion";
      message: string;
      suggestedItems: PlanItem[];
      confirmation: {
        label: "식단에 추가하시겠습니까?";
        action: "add_to_meal_plan";
      };
    }
  | {
      type: "exercise_plan_suggestion";
      message: string;
      suggestedItems: PlanItem[];
      confirmation: {
        label: "운동에 추가하시겠습니까?";
        action: "add_to_exercise_plan";
      };
    }
  | {
      type: "plan_revision_suggestion";
      message: string;
      revision: PlanRevision;
      confirmation: {
        label: "플랜을 수정하시겠습니까?";
        action: "revise_plan";
      };
    }
  | {
      type: "clarification_question";
      message: string;
      question: string;
    };
```

## Fixture Cases

Create fixtures for:

- User skips breakfast regularly.
- User must eat normal lunch.
- User has no exercise habit.
- User eats a heavy lunch and wants dinner adjustment.
- User misses workout and wants tomorrow adjusted.
- User wants a gentler plan without explaining why.

## Regression Rule

Every prompt change must run AI fixtures.

The test does not need to judge perfect nutrition. It must verify:

- JSON parses.
- Required fields exist.
- User-facing copy follows tone rules.
- Plan changes are plausible.
- The app can render the result.
