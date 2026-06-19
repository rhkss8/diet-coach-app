# Figma Make Parity Map

## Purpose

Use this map before editing the mobile UI for Phase 9 publishing parity.

Source of truth:

- `figma_make/src/app/App.tsx`
- `figma_make/src/styles/theme.css`
- User-approved published-flow screenshots

Rule:

- Do not infer icons, headers, card structure, or button colors when the Figma Make source defines them.
- Fix one screen group at a time, then run visual QA against the matching Figma Make state.

## Shared Source Tokens

Figma Make defines the visual system inline in `App.tsx` and mirrors it in `theme.css`:

- Background: `#F7F3EC`
- Deep background: `#EDE9DF`
- Card: `#FEFCF8`
- Ink: `#2A3D2E`
- Muted: `#968E7E`
- Green: `#3D6142`
- Green soft: `#E6EFE6`
- Coral: `#C97355`
- Coral soft: `#F5EAE3`
- Serif: `Gowun Batang`, fallback Georgia/serif
- Sans: `Noto Sans KR`, fallback system sans

Current React Native token coverage:

- `apps/mobile/src/shared/ui/design-system.ts` matches the main color tokens closely.
- Typography is approximate; RN uses `fontFamily: "serif"` for the title token, not the exact Figma Make font stack.
- Icons are not yet source-equivalent because RN still uses drawn text/symbol approximations in shared planner components.

## Screen Map

| Figma Make screen  | Source component                     | Current RN route/component                                                                                                 | Status                 | Required parity work                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `login`            | `LoginScreen`                        | `apps/mobile/src/features/auth/AuthScreen.tsx`                                                                             | Partial                | Brand row, hero card, email form, guest path, and footer note exist. RN uses `LeafMark` approximation instead of `Leaf`, `PrimaryButton` lacks `ArrowRight`, message state differs from the Figma Make "링크를 보냈어요" card, and spacing must be visually checked.                                                                                                                                                                                                                          |
| `onboarding`       | `OnboardingScreen`                   | `apps/mobile/src/features/onboarding/OnboardingFlow.tsx`, `BasicProfileStep.tsx`, `GoalSetupStep.tsx`, `LifestyleStep.tsx` | Structurally different | Figma Make has one compact onboarding screen with small brand row, gender, age, height, current weight, target weight, optional target date, one bottom CTA, and footer quote. RN splits onboarding into 3 steps and includes extra fields such as name, "기타", "선택 안 함", pace, hardest part, and exercise experience. This is a product/flow mismatch, not only a styling gap.                                                                                                          |
| `chat`             | `ChatScreen`                         | `apps/mobile/src/features/consultation/ConsultationChatScreen.tsx`, `apps/mobile/src/root/AppRoot.tsx`                     | Partial                | RN has the bordered top bar, assistant/user bubbles, and docked input. Initial state now has one onboarding-based welcome bubble, while Figma Make source still contains a fake multi-message conversation and a proposal teaser. Phase 9 todo says the published initial state should keep only the onboarding-based welcome bubble, so the RN behavior is directionally correct but needs visual QA. RN top bar includes a visible "오늘 플랜" action where Figma Make uses a right spacer. |
| `chat-proposal`    | `ChatProposalScreen`, `ProposalCard` | `ConsultationChatScreen.tsx`, `PlanProposalCard` in `apps/mobile/src/shared/ui/planner-components.tsx`                     | Partial                | RN has the proposal card shell, dashed header, type label, footnote, dismiss, and approve action. RN item rows are generic text rows, not the exact Figma Make item structure with name, note, kcal/detail hierarchy. RN uses `LeafMark` and text checkmark instead of lucide `Leaf` and `Check`.                                                                                                                                                                                             |
| `today-plan`       | `TodayPlanScreen`, `PlanItemCard`    | `apps/mobile/src/features/today/TodayScreen.tsx`, `PlannerItemCard`, `PlannerProgress`, `BottomActionPanel`                | Partial                | Compact header, date/title block, progress rail, grouped meal/exercise cards, skip controls, and coral recovery CTA exist. RN section headers use a dot instead of Figma Make `Utensils` and `Dumbbell`; header brand uses `LeafMark`; controls use text symbols instead of lucide icons. Needs visual QA against the user-approved compact Image #1.                                                                                                                                         |
| `recovery-reasons` | `RecoveryReasonsScreen`, `REASONS`   | `apps/mobile/src/features/adjustment/AdjustmentReasonSelectionScreen.tsx`                                                  | Partial                | Seven reasons exist and map internally to domain reasons. RN uses text symbols (`☕`, `◐`, `♨`, `▧`, `✈`, `♡`, `?`) instead of lucide `Coffee`, `Moon`, `Utensils`, `Dumbbell`, `Plane`, `Heart`, `HelpCircle`. RN adds an optional note card that is not present in Figma Make. CTA text differs: Figma Make says "AI에게 조정 요청하기"; RN says "조정안 만들기".                                                                                                                           |
| `plan-approval`    | `PlanApprovalScreen`                 | `apps/mobile/src/features/adjustment/RevisedPlanReviewScreen.tsx`                                                          | Partial                | Revised approval comparison structure exists: assistant bubble, before/after card, divider, badges, reassurance row, approve button, and "다시 제안받기" button. RN is missing the Figma Make back button/title block combo at the top. RN uses text symbols for approve and divider instead of lucide `Check` and `ArrowRight`.                                                                                                                                                              |

## Extra Or Adjacent RN Screens

| RN screen/component                                                     | Why it is extra or adjacent                                                                                                           | Handling                                                                                                                                                            |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/mobile/src/features/plan/PlanApprovalScreen.tsx`                  | This is the initial generated-plan approval screen. Figma Make Phase 9 list uses `plan-approval` for the revised plan approval state. | Keep as core MVP behavior unless a separate Figma Make initial-plan state is provided. Do not force it into the revised approval layout without a source reference. |
| `apps/mobile/src/features/settings/SettingsScreen.tsx`                  | Settings is release-readiness functionality, not part of the seven Figma Make parity states.                                          | Leave out of Phase 9 visual parity unless screenshots or Figma Make source are added.                                                                               |
| `apps/mobile/src/features/notifications/NotificationRecommendation.tsx` | Notification recommendation is release-readiness functionality, not part of the seven Figma Make parity states.                       | Leave out of Phase 9 visual parity unless screenshots or Figma Make source are added.                                                                               |

## Global Gaps

- Native icon strategy is resolved with `lucide-react-native` and `react-native-svg`. The former hand-drawn `LeafMark` and text-symbol icons have been replaced with lucide icons in the shared planner UI and mapped Phase 9 screens.
- Header rules are only partially implemented. Chat uses a right action where Figma Make uses a spacer; revised approval lacks the top back button; login/onboarding need the small brand row only.
- Onboarding is the largest structural mismatch. RN's 3-step product flow conflicts with Figma Make's single-screen published state and should go through a decision gate before removing fields or collapsing the flow.
- Recovery reasons include an extra note card. Because the Figma Make state does not show it, keeping, moving, or hiding the note field needs a product/design decision.
- Visual QA is still required for all seven states after implementation fixes.

## Recommended Next Slice

Fix the screen header rules:

1. Login and onboarding should use the small brand row, not the chat top bar.
2. Chat and chat-proposal should use the bordered top bar with back button on the left, centered brand, and right spacer or action.
3. Today should keep the compact header from Figma Make: back on left, small brand on right.
4. Recovery reasons and revised plan approval should use the back button/title block layout.
5. Avoid adding headers where the Figma Make screen does not define them.
