import type {
  AiPlanItem,
  ChatPlannerResponse,
  GenerateChatPlannerResponseInput,
  PlanningContext,
} from "../contracts";

export function generateMockChatPlannerResponse(
  input: GenerateChatPlannerResponseInput,
): ChatPlannerResponse {
  const latestChatMessage = input.messages.at(-1);
  const latestMessage = latestChatMessage?.content ?? "";
  const attachments = latestChatMessage?.attachments ?? [];

  if (attachments.length > 0 && isRevisionIntent(latestMessage) && input.currentPlan) {
    const dinnerItem = findDinnerItem(input.currentPlan.items);
    const revisedDinnerItem = {
      ...(dinnerItem ?? createAttachmentMealItem(input.todayDate, attachments)),
      title: "첨부 분석 반영 저녁 플랜",
      description: `${formatAttachmentNames(attachments)} 내용을 기준으로 오늘 식단 부담을 낮춰 조정해요.`,
      foods: [
        { name: "두부", amount: "150g", caloriesKcal: 180, proteinG: 16, carbsG: 5, fatG: 11 },
        { name: "샐러드 채소", amount: "150g", caloriesKcal: 35, proteinG: 2, carbsG: 7, fatG: 0 },
        { name: "무가당 두유", amount: "1팩", caloriesKcal: 120, proteinG: 9, carbsG: 8, fatG: 5 },
      ],
      nutrition: createEstimatedNutrition(335, 27, 20, 16),
      status: "adjusted" as const,
    };

    return {
      type: "plan_revision_suggestion",
      message: `첨부한 ${formatAttachmentNames(attachments)} 기준으로 오늘 플랜을 다시 맞춰볼게요.`,
      revision: {
        planId: input.currentPlan.id ?? "chat-plan",
        affectedDate: input.todayDate,
        reason: "want_replan",
        summary: "첨부 분석 기반 플랜 수정",
        userMessage: "업로드한 자료를 참고해서 오늘 플랜을 조정했어요.",
        changedItemIds: [revisedDinnerItem.id ?? `chat-${input.todayDate}-dinner`],
        updatedTodayItems: [revisedDinnerItem],
      },
      confirmation: {
        action: "revise_plan",
        label: "플랜을 수정하시겠습니까?",
      },
    };
  }

  if (attachments.length > 0) {
    return {
      type: "meal_plan_suggestion",
      message: `첨부한 ${formatAttachmentNames(attachments)} 기준으로 식단에 반영하기 쉬운 항목을 제안할게요.`,
      suggestedItems: [
        createAttachmentMealItem(input.todayDate, attachments, input.planningContext),
      ],
      confirmation: {
        action: "add_to_meal_plan",
        label: "식단에 추가하시겠습니까?",
      },
    };
  }

  if (isExerciseIntent(latestMessage)) {
    return {
      type: "exercise_plan_suggestion",
      message: createExerciseMessage(input.planningContext),
      suggestedItems: [createExerciseItem(input.todayDate, input.planningContext)],
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
      message: createMealMessage(input.planningContext),
      suggestedItems: [createMealItem(input.todayDate, input.planningContext)],
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

function createMealItem(date: string, planningContext?: PlanningContext): AiPlanItem {
  const preferredFood = getFirstAllowedFood(
    planningContext?.foodContext.foodsToKeep,
    planningContext,
  );
  const preferredFoodEntry = preferredFood
    ? {
        name: preferredFood,
        amount: "1회분",
        caloriesKcal: 220,
        proteinG: 8,
        carbsG: 32,
        fatG: 6,
      }
    : {
        name: "삶은 계란",
        amount: "2개",
        caloriesKcal: 156,
        proteinG: 12,
        carbsG: 1,
        fatG: 10,
      };

  return {
    id: `chat-${date}-dinner`,
    planId: "chat-plan",
    date,
    type: "meal",
    slot: "dinner",
    title: "상담 기반 저녁 식단",
    description: createMealDescription(planningContext, preferredFood),
    foods: [
      preferredFoodEntry,
      { name: "샐러드 채소", amount: "150g", caloriesKcal: 35, proteinG: 2, carbsG: 7, fatG: 0 },
      { name: "무가당 두유", amount: "1팩", caloriesKcal: 120, proteinG: 9, carbsG: 8, fatG: 5 },
    ],
    nutrition: createEstimatedNutrition(311, 23, 16, 15),
    status: "pending",
  };
}

function createAttachmentMealItem(
  date: string,
  attachments: { name: string }[],
  planningContext?: PlanningContext,
): AiPlanItem {
  const preferredFood = getFirstAllowedFood(
    planningContext?.foodContext.preferredFoods,
    planningContext,
  );
  const firstFood = preferredFood
    ? { name: preferredFood, amount: "1회분", caloriesKcal: 220, proteinG: 8, carbsG: 32, fatG: 6 }
    : { name: "두부", amount: "150g", caloriesKcal: 180, proteinG: 16, carbsG: 5, fatG: 11 };

  return {
    id: `chat-${date}-attachment-meal`,
    planId: "chat-plan",
    date,
    type: "meal",
    slot: "dinner",
    title: "첨부 분석 기반 식단",
    description: createAttachmentMealDescription(attachments, planningContext, preferredFood),
    foods: [
      firstFood,
      { name: "샐러드 채소", amount: "150g", caloriesKcal: 35, proteinG: 2, carbsG: 7, fatG: 0 },
      { name: "삶은 계란", amount: "1개", caloriesKcal: 78, proteinG: 6, carbsG: 1, fatG: 5 },
    ],
    nutrition: createEstimatedNutrition(293, 24, 13, 16),
    status: "pending",
  };
}

function createExerciseItem(date: string, planningContext?: PlanningContext): AiPlanItem {
  return {
    id: `chat-${date}-workout`,
    planId: "chat-plan",
    date,
    type: "exercise",
    slot: "workout",
    title: "20분 빠르게 걷기",
    description: createExerciseDescription(planningContext),
    intensity: "light",
    status: "pending",
  };
}

function createMealMessage(planningContext?: PlanningContext) {
  const trait = getPlanningTrait(planningContext);

  return trait
    ? `좋아요. ${trait} 기준으로 지키기 쉬운 한 끼부터 플랜에 넣어볼게요.`
    : "좋아요. 식단은 지키기 쉬운 한 끼부터 플랜에 넣어볼게요.";
}

function createExerciseMessage(planningContext?: PlanningContext) {
  const trait = planningContext?.routineContext.rawRoutineText.trim();

  return trait
    ? `좋아요. 알려준 하루 흐름(${trait})을 기준으로 바로 시작할 수 있는 운동으로 잡아볼게요.`
    : "좋아요. 지금은 무리하지 않고 바로 시작할 수 있는 운동으로 잡아볼게요.";
}

function createMealDescription(planningContext?: PlanningContext, preferredFood?: string) {
  if (!planningContext) {
    return "대화에서 나온 생활 패턴을 반영해 부담 없는 단백질 중심으로 구성해요.";
  }

  const keepFood = preferredFood ? `${preferredFood}은 살리고 ` : "";
  const routine = planningContext.routineContext.rawRoutineText;

  return `${keepFood}${routine} 흐름에 맞춰 부담 없는 단백질 중심으로 구성해요.`;
}

function createAttachmentMealDescription(
  attachments: { name: string }[],
  planningContext?: PlanningContext,
  preferredFood?: string,
) {
  const base = `${formatAttachmentNames(attachments)} 내용을 참고해 오늘 실행 가능한 식단으로 반영해요.`;

  if (!planningContext) {
    return base;
  }

  return preferredFood
    ? `${base} 좋아하는 ${preferredFood}은 가능한 범위에서 살려요.`
    : `${base} 입력한 음식 제외 기준과 하루 루틴을 함께 반영해요.`;
}

function createExerciseDescription(planningContext?: PlanningContext) {
  const routine = planningContext?.routineContext.rawRoutineText.trim();

  return routine
    ? `${routine} 흐름을 고려해 부담스럽지 않게 바로 실행 가능한 걷기로 시작해요.`
    : "운동 루틴이 부담스럽지 않게 바로 실행 가능한 걷기로 시작해요.";
}

function getPlanningTrait(planningContext?: PlanningContext) {
  return (
    planningContext?.foodContext.foodsToKeep.at(0) ??
    planningContext?.foodContext.preferredFoods.at(0) ??
    planningContext?.routineContext.rawRoutineText
  );
}

function getFirstAllowedFood(foods: string[] = [], planningContext?: PlanningContext) {
  return foods.find((food) => !isFoodExcluded(food, planningContext));
}

function isFoodExcluded(food: string, planningContext?: PlanningContext) {
  const excludedFoods = [
    ...(planningContext?.foodContext.allergies ?? []),
    ...(planningContext?.foodContext.avoidedFoods ?? []),
  ];

  return excludedFoods.some((excludedFood) => food.includes(excludedFood));
}

function findDinnerItem(items: AiPlanItem[]) {
  return items.find((item) => item.type === "meal" && item.slot === "dinner");
}

function createEstimatedNutrition(
  caloriesKcal: number,
  proteinG: number,
  carbsG: number,
  fatG: number,
): AiPlanItem["nutrition"] {
  return {
    caloriesKcal,
    proteinG,
    carbsG,
    fatG,
    source: "estimated",
    confidence: "medium",
  };
}

function formatAttachmentNames(attachments: { name: string }[]) {
  const names = attachments.map((attachment) => attachment.name);

  if (names.length <= 2) {
    return names.join(", ");
  }

  return `${names.slice(0, 2).join(", ")} 외 ${names.length - 2}개`;
}
