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

## 2026-06-19 - Phase 9 Figma Make Visual QA

Scope: Figma Make publishing parity for the currently routable web states.

Environment:

- Export command: `pnpm mobile:build:web`
- Static server: `python3 -m http.server 4174 --directory dist/mobile-web-qa`
- Browser target: `http://127.0.0.1:4174`
- Captures: `output/playwright/qa-login.png`, `qa-chat-initial.png`, `qa-chat-proposal.png`, `qa-today.png`, `qa-recovery-reasons.png`, `qa-plan-approval.png`

Result: partially passed.

Checked:

- Login renders the small brand row and guest entry.
- Chat initial state renders the bordered top bar, one assistant welcome bubble, empty canvas, and docked input.
- Chat proposal renders the proposal shell, type label, item row, footnote, dismiss action, and approval action.
- Today renders compact header, date/title, progress rail, grouped meal/exercise cards, skip pills, and coral recovery CTA.
- Recovery reasons render seven Figma Make reasons, selected coral styling, and disabled/enabled bottom CTA.
- Revised plan approval renders assistant bubble, "변경 내용", before/after card, divider, badges, reassurance row, approve button, and secondary action.

Fixed during QA:

- Revised plan approval displayed duplicate workout comparison rows when multiple `workout` items changed. The review helper now shows one comparison row per changed type/slot.

Blocked:

- Onboarding could not be captured because the current `AppRoot` guest flow routes from login directly to chat-first consultation. Decide whether to restore a routable onboarding screen for Figma Make parity or keep chat-first entry as the MVP flow.

## 2026-06-22 - TARS Loop Publishing Parity Recheck

Scope: Phase 9 Figma Make publishing parity follow-up after chat input and nutrition-detail changes.

Environment:

- Export command: `pnpm mobile:build:web`
- Export result: passed, output in `dist/mobile-web-qa`
- Browser automation target attempted: `http://127.0.0.1:4176`

Decisions:

- Keep the chat-first guest entry as the tester MVP route.
- Do not restore routable onboarding only for Figma Make parity before recruiting testers.
- Onboarding remains an intentional parity exception while the chat-first pivot is under test.

Checked:

- Local Expo web export completed successfully after the latest UI changes.
- `docs/decision-log.md` now records the onboarding route decision as accepted.

Blocked:

- Fresh Playwright capture could not run in this environment because the wrapper attempted to fetch `@playwright/cli` from npm and network access was unavailable.
- A fresh visual screenshot pass is still required before marking Phase 9 fully done.
