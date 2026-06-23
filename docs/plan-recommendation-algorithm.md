# Plan Recommendation Algorithm

## Purpose

This document defines the product algorithm behind diet, exercise, and recovery plan recommendations.

The app must not generate generic diet advice from a blank chat. It should first learn enough user context to explain why a plan fits this person, then produce reviewable plan actions.

## Product Position

Diet Planner is not a food diary and not a generic AI chatbot.

It is a guided planning system that:

- understands why the user came in,
- remembers practical user traits needed for planning,
- proposes meal, exercise, and recovery actions,
- lets the user approve before the plan changes.

## Required User Context

The recommendation algorithm needs at least three context groups before making the first meaningful plan.

### 1. Management Intent

Goal: understand the user's reason for coming in.

Guided prompt:

> 안녕하세요. 어떤 관리가 필요해서 오셨나요? 다이어트, 건강 관리, 식습관 개선, 운동 루틴처럼 편하게 이야기해 주세요.

Recommended UX:

- Show quick choices first: 체중 감량, 건강 관리, 식습관 개선, 운동 루틴 만들기, 일정 때문에 무너지는 플랜 조정, 기타.
- Let the user tap one or multiple choices.
- Keep a free-text field below the choices for "요즘 가장 어려운 점" or any context the choices do not cover, but treat it as optional.
- If the user selects "기타", make the free-text field feel primary, not like an error path.

Extract:

- selected management goals
- user's own reason text, if provided
- emotional constraint, if present: frustration, low energy, lack of consistency, work stress
- preferred coaching direction, if present: gentle, practical, direct

Why it matters:

- Weight-loss users need calorie and protein balance.
- Health-management users may need consistency and meal quality before aggressive deficit.
- Routine-recovery users need lower-friction actions first.

### 2. Food Preferences And Constraints

Goal: recommend food the user can actually eat and continue.

Guided prompt:

> 좋아하는 음식이나, 관리하면서도 계속 먹고 싶은 음식이 있나요? 반대로 피하고 싶은 음식, 알레르기, 소화가 불편한 음식도 알려주세요.

This step is optional. The user can skip it, but any allergy or hard avoidance they do provide becomes a hard planning rule.

Extract:

- preferred foods
- foods the user wants to keep
- avoided foods
- allergies and hard exclusions
- disliked textures or preparation styles, if mentioned
- eating context: convenience store, delivery, home cooking, cafeteria

Hard rules:

- Allergies and hard exclusions must never appear in suggested foods.
- Preferred foods should be included when compatible with the goal.
- Foods the user wants to keep should be adjusted, portioned, or paired before being removed.

Why it matters:

- A plan that ignores favorite foods feels unrealistic.
- A plan that ignores allergies or strong avoidance is unsafe and untrustworthy.

### 3. Daily Routine

Goal: fit the plan to the user's actual day.

Guided prompt:

> 하루 루틴을 알려주세요. 기상 시간, 식사 시간, 퇴근 시간, 운동 가능한 시간처럼 생활 흐름에 맞춰 플랜을 구성할게요. 예: 8시 기상, 11시 점심, 21시 퇴근.

Extract:

- wake time
- meal windows
- work or school schedule
- commute or late-night constraints
- available exercise windows
- likely high-risk moments: skipped breakfast, late dinner, night snack, overtime

Why it matters:

- Meal timing should match the day.
- Exercise should be placed where the user can realistically do it.
- Recovery suggestions should respond to the user's actual constraint, not an ideal schedule.

## Recommendation Flow

### Step 1. Guided Context Capture

The app asks the three onboarding questions in sequence inside the chat surface, revealing the next question only after the current answer is captured. Do not show the whole form at once, and do not turn the flow into a legacy multi-step form with "next" buttons.

The UI can feel conversational, but internally the answers must be parsed into structured context.

Use hybrid input where it reduces user effort:

- Prefer choice chips for common categories users recognize quickly.
- Keep free text for nuance, exceptions, and the user's own words.
- Do not make users write from a blank page when a clear set of common answers exists.
- Do not force all answers into chips when the user needs to explain constraints.

Recommended onboarding input model:

- Management intent: required choice chips plus optional text for "요즘 가장 어려운 점".
- Food context: optional chat answer, with quick replies such as 좋아하는 음식, 피해야 할 음식, 특별히 없음.
- Daily routine: required chat answer, with structured time examples and optional time chips if the user wants help.

Expected internal shape:

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

### Step 2. Context Quality Check

Before generating a plan, the app checks whether it has enough context.

If a critical field is missing, the AI asks one focused follow-up question instead of generating a vague plan.

Critical fields:

- at least one selected management goal,
- at least one routine clue or raw routine text.

Optional fields:

- reason text about what is difficult lately,
- food preferences, foods to keep, avoided foods, allergies, and eating context,
- exercise window.

Do not block the user for perfect data. The goal is enough context, not a complete medical profile.

### Step 3. Plan Strategy Selection

The algorithm chooses a strategy based on user context.

Examples:

- Weight loss plus normal workday: protein-forward meals, moderate deficit, simple workout.
- Late work schedule: lighter dinner, planned snack, short evening movement.
- Skipped breakfast pattern: small breakfast option or protein drink, not a heavy morning meal.
- Favorite convenience food: keep it with portion and pairing guidance.
- Low exercise habit: walking or stretching before PT-style routines.

### Step 4. Meal Recommendation

Each meal suggestion should include:

- meal slot,
- food items and amounts,
- estimated calories,
- estimated protein, carbs, and fat,
- reason this meal fits the user,
- substitution note if a preferred food is being adapted.

Rules:

- Do not present calorie estimates as exact medical truth.
- Prefer simple foods the user can access.
- Avoid banned foods.
- Include preferred foods where possible.
- Make the plan feel doable before making it optimal.

### Step 5. Exercise Recommendation

Exercise suggestions should be chosen from routine and current ability.

Rules:

- If the user has no exercise habit, start with low-friction movement.
- If the user has a fixed available window, place exercise there.
- If the user reports fatigue or late work, use recovery movement instead of intense workout.
- Do not make PT-style plans the default before the user asks for them or provides enough ability context.

### Step 6. Recovery And Adjustment

When the user says the plan broke, the app should not judge or restart from zero.

It should:

- identify what changed,
- preserve completed items,
- revise only the remaining plan when possible,
- explain the change in one practical sentence,
- ask for approval before mutating the plan.

## Roles: Counselor, Nutrition Coach, PT

The app can use role-based reasoning internally, but should not overcomplicate the MVP UI with multiple visible agents yet.

Recommended MVP model:

- One visible AI planner in the chat.
- Internal reasoning split into three lenses:
  - counselor: understands intent, friction, emotional context, continuation risk,
  - nutrition coach: builds meal suggestions from preferences, exclusions, nutrition estimates,
  - PT coach: builds exercise suggestions from routine, ability, and available time.

Why not show three agents immediately:

- It can make the app feel heavier before the user understands the main loop.
- "Nutritionist" and "PT" can create professional-expertise expectations.
- The core product should first prove that one planner can create useful approved actions.

Future expansion:

- Add mode entry points in the chat surface:
  - 식단 맞추기
  - 운동 맞추기
  - 오늘 플랜 조정
- These should be entry points into the same planner, not separate hidden flows.

## Chat As Main Surface

The consultation screen currently feels hidden because the user lacks clear entry points.

The chat should expose visible next actions after onboarding:

- 식단 추천 받기
- 운동 루틴 잡기
- 오늘 플랜 조정하기
- 먹은 음식 기준으로 조정하기

This preserves chat as the main surface while reducing blank-page anxiety.

## Good Recommendation Example

Input context:

- User wants weight loss but often works late.
- Likes eggs, tofu, convenience-store food.
- Wants to keep triangle kimbap sometimes.
- Wakes at 8:00, lunch at 11:30, leaves work around 21:00.

Output style:

- Breakfast: eggs plus protein drink, because morning time is short.
- Lunch: normal meal with protein-first ordering, because lunch is fixed.
- Dinner: light tofu or salad option, because work ends late.
- Snack: triangle kimbap plus soy milk as an allowed late-work option, with estimated calories.
- Exercise: 10-minute walk or stretch after work, not a full workout.

The explanation should say why the plan fits the user's stated day.

## Bad Recommendation Example

Bad:

- "Eat chicken breast, salad, and sweet potato."
- No reference to schedule.
- No reference to preferred foods.
- No calories or macro estimate.
- No explanation of why this fits the user.

This feels generic and should fail QA.

## QA Criteria

A generated plan or suggestion passes only if:

- It uses at least one captured user trait.
- It avoids hard exclusions and allergies.
- It includes enough food detail for meal items: amount, estimated calories, protein, carbs, fat.
- It places meal or exercise suggestions in a realistic routine slot.
- It explains the recommendation in user-facing language.
- It remains reviewable before approval.

## Open Product Decisions

- Whether onboarding should require all three guided answers before entering the main chat.
- Whether the chat surface should show quick action chips immediately after onboarding.
- Whether role labels should be visible later as modes, such as 식단, 운동, 오늘 조정.
- Whether user context should be editable from settings or only through chat updates.
