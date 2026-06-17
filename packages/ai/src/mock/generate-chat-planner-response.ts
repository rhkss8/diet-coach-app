import type {
  AiPlanItem,
  ChatPlannerResponse,
  GenerateChatPlannerResponseInput,
} from "../contracts";

export function generateMockChatPlannerResponse(
  input: GenerateChatPlannerResponseInput,
): ChatPlannerResponse {
  const latestMessage = input.messages.at(-1)?.content ?? "";

  if (isExerciseIntent(latestMessage)) {
    return {
      type: "exercise_plan_suggestion",
      message: "좋아요. 지금은 무리하지 않고 바로 시작할 수 있는 운동으로 잡아볼게요.",
      suggestedItems: [createExerciseItem(input.todayDate)],
      confirmation: {
        action: "add_to_exercise_plan",
        label: "운동에 추가하시겠습니까?",
      },
    };
  }

  if (isRevisionIntent(latestMessage) && input.currentPlan) {
    const dinnerItem = findDinnerItem(input.currentPlan.items);
    const revisedDinnerItem = {
      ...(dinnerItem ?? createMealItem(input.todayDate)),
      title: "상담 반영 저녁 플랜",
      description: "오늘 상황을 반영해서 단백질과 채소 중심으로 가볍게 조정해요.",
      status: "adjusted" as const,
    };

    return {
      type: "plan_revision_suggestion",
      message: "괜찮아요. 지금 대화 내용을 기준으로 오늘 플랜을 다시 맞춰볼게요.",
      revision: {
        planId: input.currentPlan.id ?? "chat-plan",
        affectedDate: input.todayDate,
        reason: "want_replan",
        summary: "채팅 상담 기반 플랜 수정",
        userMessage: "대화에서 나온 상황을 반영해서 오늘 플랜을 조정했어요.",
        changedItemIds: [revisedDinnerItem.id ?? `chat-${input.todayDate}-dinner`],
        updatedTodayItems: [revisedDinnerItem],
      },
      confirmation: {
        action: "revise_plan",
        label: "플랜을 수정하시겠습니까?",
      },
    };
  }

  if (isMealIntent(latestMessage)) {
    return {
      type: "meal_plan_suggestion",
      message: "좋아요. 식단은 지키기 쉬운 한 끼부터 플랜에 넣어볼게요.",
      suggestedItems: [createMealItem(input.todayDate)],
      confirmation: {
        action: "add_to_meal_plan",
        label: "식단에 추가하시겠습니까?",
      },
    };
  }

  return {
    type: "clarification_question",
    message: "좋아요. 식단, 운동, 오늘 플랜 수정 중 어떤 걸 먼저 맞춰볼까요?",
    question: "식단을 추가할까요, 운동을 추가할까요, 아니면 오늘 플랜을 수정할까요?",
  };
}

function isMealIntent(message: string) {
  return /식단|아침|점심|저녁|음식|먹/.test(message);
}

function isExerciseIntent(message: string) {
  return /운동|걷|헬스|러닝|산책|홈트/.test(message);
}

function isRevisionIntent(message: string) {
  return /수정|바꿔|조정|회식|야근|망|깨졌|못/.test(message);
}

function createMealItem(date: string): AiPlanItem {
  return {
    id: `chat-${date}-dinner`,
    planId: "chat-plan",
    date,
    type: "meal",
    slot: "dinner",
    title: "상담 기반 저녁 식단",
    description: "대화에서 나온 생활 패턴을 반영해 부담 없는 단백질 중심으로 구성해요.",
    status: "pending",
  };
}

function createExerciseItem(date: string): AiPlanItem {
  return {
    id: `chat-${date}-workout`,
    planId: "chat-plan",
    date,
    type: "exercise",
    slot: "workout",
    title: "20분 빠르게 걷기",
    description: "운동 루틴이 부담스럽지 않게 바로 실행 가능한 걷기로 시작해요.",
    intensity: "light",
    status: "pending",
  };
}

function findDinnerItem(items: AiPlanItem[]) {
  return items.find((item) => item.type === "meal" && item.slot === "dinner");
}
