# Design Tone and Manner

## Concept

Diet Planner is a calm planning companion for people whose real life does not follow a perfect diet schedule.

The product should feel:

- Calm.
- Practical.
- Trustworthy.
- Lightly encouraging.
- Non-judgmental.
- Daily-use friendly.

It should not feel:

- Medical.
- Punitive.
- Loud.
- Gamified in a childish way.
- Like a calorie spreadsheet.
- Like a generic AI chatbot.

## Core Message

Plans change. You can still continue.

## UX Tone

Use language that helps the user resume.

Good:

- "오늘 계획을 조금 조정해볼까요?"
- "점심이 평소보다 든든했네요. 저녁을 가볍게 이어가면 충분해요."
- "운동을 못 한 날도 괜찮아요. 내일 플랜에 자연스럽게 반영할게요."
- "오늘 남은 계획을 다시 맞춰볼게요."

Avoid:

- "실패했습니다."
- "초과했습니다."
- "규칙을 지키지 않았습니다."
- "반드시 해야 합니다."
- "위험합니다."
- "야, 이건 좀 많이 먹었네요."

## Tone Levels

Default tone must be calm and recovery-focused.

### Default

Use for MVP.

- "괜찮아요. 오늘 기준으로 다시 맞춰볼게요."
- "계획이 조금 달라졌네요. 남은 하루를 이어갈 수 있게 조정할게요."

### Direct

Use only when the user chooses a more direct coaching style.

- "오늘은 계획과 조금 달라졌어요. 저녁을 가볍게 조정하면 됩니다."

### Hard

Do not use as the MVP default.

Hard tone can create review risk and make the app feel punitive. If introduced later, it must be opt-in and bounded by explicit copy rules.

## Visual Direction

The app should look like a polished daily planner, not a hospital app or fitness challenge app.

Recommended:

- Clean mobile-first layouts.
- Quiet neutral background.
- Clear section hierarchy.
- Small but warm color accents.
- Progress shown as continuity, not punishment.
- Rounded corners may be used, but keep cards restrained.

Avoid:

- Overly cute diet illustrations.
- Heavy gradients.
- Dark neon fitness styling.
- Dashboard clutter.
- Big marketing hero screens inside the app.
- Excessive badges, streak pressure, or shame-based UI.

## Primary Screens

### Onboarding

Should feel short and guided. Avoid survey fatigue.

### Plan Approval

Should help users understand the generated plan quickly:

- What changes this week?
- What should I do today?
- What can be adjusted later?

### Today

This is the home screen after onboarding.
It should show:

- Today's meals.
- Today's exercise.
- Progress for today.
- A clear "Adjust today" action.

Priority:

1. "Continue today's plan" message.
2. Today's meal/exercise items.
3. "Adjust today" action.
4. Progress summary.

Avoid making the first screen feel like a food diary.

### Adjust Today

This is the product's signature screen.
It should be faster than writing a chat message.

Recommended choices:

- "식사를 다르게 했어요"
- "운동을 못 했어요"
- "일정이 바뀌었어요"
- "그냥 다시 맞추고 싶어요"

### Progress

Show consistency and continuation:

- Weekly execution rate.
- Number of approved adjustments.
- Current weight and target weight if available.
- Simple trend, not judgment.

## Notification Tone

Notification permission should be recommended softly.

Example:
"계획이 틀어진 날에도 다시 이어갈 수 있게, 하루 한 번만 가볍게 확인해드릴까요?"

Avoid urgency, guilt, or fear.
