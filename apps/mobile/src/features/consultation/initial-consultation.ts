import type { ChatPlannerMessage } from "@diet-coach/ai";

/**
 * Creates the first visible consultation message for the published initial chat state.
 *
 * The initial screen should contain only this onboarding-based welcome bubble; user messages,
 * follow-up planner replies, and proposal cards are added only after the user acts.
 */
export function createInitialConsultationMessages(): ChatPlannerMessage[] {
  return [
    {
      id: "assistant-welcome",
      role: "assistant",
      content: "먼저 세 가지만 알려주시면 오늘부터 이어갈 플랜을 더 현실적으로 맞춰볼게요.",
    },
  ];
}
