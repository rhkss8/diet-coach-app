# QA Checklist

## Core Flow

The release cannot ship unless this flow passes:

1. Fresh user opens app.
2. User starts AI consultation from the main screen.
3. User sends a meal or exercise request.
4. App returns a structured suggestion with an approval card.
5. User approves the suggestion.
6. Today plan opens with the approved item.
7. User completes one plan item.
8. User sends a revision request from chat.
9. App returns a structured revision suggestion with an approval card.
10. User approves revision.
11. Today plan updates.
12. Revision history is stored.
13. Analytics events are emitted.

## Manual QA Cases

### Consultation

- First screen is chat consultation, not a form wizard.
- User can send text without losing previous messages.
- Chat quick actions are visible after the first planning context is submitted.
- Meal, exercise, today adjustment, and food-based adjustment quick actions prefill useful prompts.
- Meal suggestion shows "식단에 추가하시겠습니까?" before mutating the plan.
- Exercise suggestion shows "운동에 추가하시겠습니까?" before mutating the plan.
- Revision suggestion shows "플랜을 수정하시겠습니까?" before mutating the plan.
- Clarification questions do not mutate the plan.

### Plan Approval From Chat

- Approved meal and exercise suggestions appear in Today.
- Approved revision creates PlanRevision history.
- User can open the current plan from chat.
- User is never forced to accept an AI suggestion automatically.

### Today

- Meal and exercise items are visually distinct.
- Completion state is stable after navigation.
- "Adjust today" is visible and not alarming.
- Today screen feels like a continuation planner, not a food diary.

### Adjustment

- Reason selection is fast.
- Optional note can be skipped.
- Revised plan is reviewable before saving.
- User can dismiss without changing the plan.
- Approved revision changes today or future items.
- Approved revision creates PlanRevision history.
- Copy says the user can continue, not that they failed.
- Manual adjustment remains available from Today as a secondary path.

### Analytics

- Every required event fires once.
- Event payloads contain userId and planId where needed.
- Failed AI calls emit failure events.

## AI QA

- Invalid JSON is handled.
- Missing plan items are handled.
- Initial plan and chat recommendation prompts include `planningContext` when it exists.
- Recommendations cite at least one captured user trait such as food preference, food to keep, routine, or management intent.
- Recommendations never suggest foods listed as allergies or hard exclusions.
- User-facing copy is non-judgmental.
- AI does not claim exact calorie precision.
- AI does not present medical diagnosis.
- Hard-tone coaching copy is not used by default.

Automated coverage:

- `packages/ai/src/prompts/generate-initial-plan-prompt.test.ts`
- `packages/ai/src/prompts/generate-chat-planner-response-prompt.test.ts`
- `packages/ai/src/mock/generate-chat-planner-response.test.ts`

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
