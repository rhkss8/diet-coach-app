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
      content:
        "온보딩에서 받은 정보를 바탕으로 오늘부터 이어갈 플랜을 준비해볼게요. 식사나 운동에서 꼭 맞추고 싶은 점을 편하게 알려주세요.",
    },
  ];
}
