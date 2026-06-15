# QA Checklist

## Core Flow
The release cannot ship unless this flow passes:

1. Fresh user opens app.
2. User completes onboarding.
3. App generates a plan.
4. User approves the plan.
5. User opens Today.
6. User completes one plan item.
7. User taps "Adjust today".
8. User selects an adjustment reason.
9. App generates revised plan.
10. User approves revision.
11. Today plan updates.
12. Revision history is stored.
13. Analytics events are emitted.

## Manual QA Cases
### Onboarding
- Empty required fields show clear errors.
- Goal step can be completed without confusion.
- Lifestyle questions are limited and fast.

### Plan Approval
- Generated plan is readable.
- User can approve.
- User can request regeneration if supported.
- User is not forced into a free-form chat.

### Today
- Meal and exercise items are visually distinct.
- Completion state is stable after navigation.
- "Adjust today" is visible and not alarming.

### Adjustment
- Reason selection is fast.
- Optional note can be skipped.
- Revised plan is reviewable before saving.
- User can dismiss without changing the plan.
- Approved revision changes today or future items.

### Analytics
- Every required event fires once.
- Event payloads contain userId and planId where needed.
- Failed AI calls emit failure events.

## AI QA
- Invalid JSON is handled.
- Missing plan items are handled.
- User-facing copy is non-judgmental.
- AI does not claim exact calorie precision.
- AI does not present medical diagnosis.

## Frontend QA
- No business rules embedded directly in JSX.
- No unnecessary derived state.
- Feature hooks are focused.
- Domain functions are named with product language.
- Components remain small enough to review.

## Release Gate
Before closed MVP distribution:
- Type check passes.
- Unit or fixture tests pass.
- Core flow manual QA passes.
- One fresh install path passes.
- Environment variables are documented.
- Error logging is enabled.

