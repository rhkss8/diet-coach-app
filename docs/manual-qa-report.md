# Manual QA Report

Date: 2026-06-17

Scope: chat-first MVP core loop from auth gate to AI consultation, structured approval cards, Today plan, and chat-based revision recovery.

## Environment

- Runtime: Expo web static export.
- Export command: `pnpm mobile:build:web`
- Static server: `python3 -m http.server 19009 --bind 127.0.0.1`
- Browser target: `http://127.0.0.1:19009`

Note: Expo QR/device server still depends on local network and free Metro port. The run script now supports `PORT=8082 ./script/build_and_run.sh` and `PORT=8082 ./script/build_and_run.sh --tunnel`.

## Result

Passed.

## Checked Flow

1. Auth gate
   - Guest start is visible and works without Supabase env vars.
   - Email magic link path is visible and explains env state.

2. AI consultation entry
   - Guest start opens the AI consultation screen.
   - The first screen is chat-first, not a form onboarding wizard.
   - The initial assistant copy explains that suggestions are only applied after approval.

3. Meal suggestion
   - Sending "저녁 식단 추천해줘" returns a structured meal suggestion.
   - Confirmation card shows "식단에 추가하시겠습니까?".
   - Approving the card moves to Today.
   - Today shows "상담 기반 저녁 식단" as the approved meal.

4. Today
   - Today summary renders date, remaining count, plan rationale, progress, settings, AI consultation entry, notification recommendation, and adjustment CTA.
   - "AI 상담" returns the user to the chat screen.
   - "플랜" from chat returns to Today when an approved plan exists.

5. Chat revision
   - Sending "회식 때문에 오늘 플랜 수정해줘" from chat returns a structured revision suggestion.
   - Confirmation card shows "플랜을 수정하시겠습니까?".
   - Approving the revision returns to Today.
   - Today meal changes to "상담 반영 저녁 플랜".

6. Manual adjustment
   - "오늘 계획 조정" remains visible as a secondary recovery path from Today.

## Follow-Up Notes

- Browser QA used a fresh `localhost` origin to avoid stale `127.0.0.1` AsyncStorage from earlier form-onboarding builds.
- Native device QA is still needed before external tester distribution.
