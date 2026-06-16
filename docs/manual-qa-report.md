# Manual QA Report

Date: 2026-06-16

Scope: closed MVP core loop from auth gate to onboarding, plan approval, today execution, settings, and manual adjustment recovery.

## Environment

- Runtime: Expo web static export.
- Export command: `pnpm --filter @diet-coach/mobile exec expo export --platform web --output-dir ../../dist/mobile-web-qa`
- Static server: `python3 -m http.server 19009 --bind 127.0.0.1`
- Browser target: `http://127.0.0.1:19009`

Note: `expo start --web` stayed in dependency validation without opening a port in the current sandbox, so QA used a static web export. The export completed successfully and loaded in the browser.

## Result

Passed.

## Checked Flow

1. Auth gate
   - Guest start is visible and works without Supabase env vars.
   - Email magic link path is visible and explains env state.

2. Onboarding
   - Basic profile accepts name, age, sex, height, and current weight.
   - Goal setup accepts target weight and target date.
   - Lifestyle step accepts the 3-question setup and advances.

3. First plan
   - Mock 7-day plan review renders the first-day meals and exercise.
   - Plan approval moves the user to Today.

4. Today
   - Today summary renders date, remaining count, plan rationale, progress, meals, exercise, settings, notification recommendation, and adjustment CTA.
   - Dismissing the notification recommendation removes the card.
   - Completing one item updates progress from 0% to 25% and remaining count from 4 to 3.

5. Settings
   - Guest mode status renders.
   - Privacy policy, terms, and feedback channel rows render with URL-not-configured copy.

6. Manual adjustment
   - "Today plan adjustment" opens the reason selection screen.
   - Reason and optional note create a revised plan review.
   - Review uses recovery-centered copy: "괜찮아요. 지금 상황 기준으로 오늘 저녁을 다시 맞춰볼게요."
   - Approving the revision returns to Today and updates dinner to "가벼운 조정 저녁".

## Follow-Up Notes

- Expo web runtime dependencies were added so static web export can be used for repeatable QA.
- Native device QA is still needed before external tester distribution.
