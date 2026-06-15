# Frontend Engineering Standards

## Goal
Write code that is strong against change, not merely code that works today.

## Senior Standard
Junior code makes the feature work.
Mid-level code makes the feature reusable.
Senior code makes future changes cheap.

## Core Rules
### 1. Single Responsibility Principle
One function, component, or hook should own one reason to change.

Bad:
```ts
const save = async () => {
  validate();
  openConfirmModal();
  await api.save();
  showToast();
  navigate();
};
```

Good:
```ts
validateBeforeSave();
confirmSave();
doSave();
navigateAfterSave();
```

Review questions:
- Does this function do more than one job?
- Does the name contain "and" or imply a chain of unrelated work?
- Are validation, API calls, navigation, and UI feedback mixed together?

### 2. Separation of Concerns
Do not hide business rules inside JSX.

Bad:
```tsx
<Button disabled={plan.status === "approved" && revision.reason === "meal"} />
```

Good:
```tsx
const canRequestPlanAdjustment = checkPlanAdjustmentAvailable(plan, revision);
<Button disabled={!canRequestPlanAdjustment} />
```

Review questions:
- Is JSX carrying business policy?
- Would a policy change require editing a visual component?

### 3. DRY
Repeated policy means missing domain modeling.

Bad:
```ts
goal.targetWeight < profile.currentWeight
```

Good:
```ts
isWeightLossGoal(goal, profile)
```

Review questions:
- Is the same condition repeated?
- Would a change require multiple edits?

### 4. Abstraction
Call sites should explain intent, not implementation.

Bad:
```ts
if (reason === "meal" && remainingMeals.length > 0)
```

Good:
```ts
if (shouldAdjustRemainingMeals(adjustmentRequest, todayPlan))
```

Review questions:
- Can a product person understand the condition name?
- Are implementation details leaking into screens?

### 5. Encapsulation
Business rules belong in domain functions.

Bad:
```ts
if (planItem.status !== "completed")
```

Good:
```ts
isPlanItemAdjustable(planItem)
```

Review questions:
- Is a policy scattered across files?
- Is there one place to change it?

### 6. Domain Modeling
Use product language in code.

Preferred terms:
- `Plan`
- `PlanItem`
- `PlanRevision`
- `AdjustmentRequest`
- `AdjustmentReason`
- `DailyCheckIn`
- `TodayPlan`

Avoid vague names:
- `data`
- `item`
- `thing`
- `statusData`
- `handleAction`
- `doStuff`

### 7. Derived State
Do not store values that can be calculated from existing state.

Bad:
```ts
const [isAdjustmentAvailable, setIsAdjustmentAvailable] = useState(false);
```

Good:
```ts
const isAdjustmentAvailable = canAdjustTodayPlan(todayPlan);
```

State is allowed for:
- User input.
- Draft data.
- Server snapshots.
- Expensive computed values with memoization.

### 8. Declarative Programming
Prefer declaring outcomes over pushing state around.

Bad:
```ts
if (completedCount === totalCount) {
  setDone(true);
} else {
  setDone(false);
}
```

Good:
```ts
const isTodayPlanDone = completedCount === totalCount;
```

### 9. Predictable Data Flow
Use one-directional flow:

User action -> validation -> domain logic -> API/AI -> state update -> UI render

Review questions:
- Where can this state change?
- Can more than one component mutate the same concept?
- Is a hook hiding navigation, API, and UI side effects together?

### 10. Maintainability
Every implementation should answer:

If product changes this rule tomorrow, where do we edit?

The target is one obvious edit location.

### 11. Composition
Build large behavior by composing small pieces.

Bad:
```tsx
<TodayScreen />
```
where one file owns loading, plan display, food logging, adjustment, revision approval, analytics, and navigation.

Good:
```tsx
<TodayScreen>
  <TodayPlanSection />
  <AdjustmentEntryPoint />
  <ProgressSummary />
</TodayScreen>
```

Hook composition:
```ts
const todayPlan = useTodayPlan();
const adjustment = usePlanAdjustment();
const analytics = useAnalytics();
```

## Project File Rules
Use this default structure:

```txt
apps/mobile/src/
  app/
  features/
    onboarding/
    plan/
    today/
    adjustment/
    progress/
  shared/
    ui/
    hooks/
    lib/
packages/
  core/
    domain/
    analytics/
  ai/
  db/
```

## Review Checklist
Before a change is accepted:
- Is business logic outside JSX?
- Are domain rules named?
- Are repeated conditions centralized?
- Is derived state avoided?
- Are hooks focused?
- Are components small enough to change safely?
- Are analytics events emitted near user actions, not scattered randomly?
- Can a future product change be made in one obvious place?

