import type { AdjustTodayPlanInput, AdjustTodayPlanOutput, AiPlanItem } from "../contracts";

export function generateMockAdjustedPlan(input: AdjustTodayPlanInput): AdjustTodayPlanOutput {
  const changedItemIds = getChangedItemIds(input.todayItems, input.request.reason);
  const updatedTodayItems = input.todayItems.map((planItem) =>
    changedItemIds.includes(planItem.id ?? "")
      ? createAdjustedPlanItem(planItem, input.request.reason)
      : planItem,
  );

  return {
    revision: {
      planId: input.currentPlan.id ?? input.request.planId,
      affectedDate: input.request.affectedDate,
      reason: input.request.reason,
      summary: getRevisionSummary(input.request.reason),
      userMessage: getRevisionMessage(input.request.reason),
      changedItemIds,
      updatedTodayItems,
    },
  };
}

function getChangedItemIds(
  todayItems: AiPlanItem[],
  reason: AdjustTodayPlanInput["request"]["reason"],
) {
  const targetSlots = getTargetSlots(reason);

  return todayItems
    .filter((planItem) => targetSlots.includes(planItem.slot))
    .map((planItem) => planItem.id)
    .filter((id): id is string => Boolean(id));
}

function createAdjustedPlanItem(
  planItem: AiPlanItem,
  reason: AdjustTodayPlanInput["request"]["reason"],
): AiPlanItem {
  if (planItem.slot === "dinner") {
    return {
      ...planItem,
      title: "가벼운 조정 저녁",
      description: "오늘 상황에 맞춰 탄수화물은 낮추고 단백질은 유지해요.",
      foods: [
        { name: "두부", amount: "150g", caloriesKcal: 180, proteinG: 16, carbsG: 5, fatG: 11 },
        { name: "삶은 계란", amount: "1개", caloriesKcal: 78, proteinG: 6, carbsG: 1, fatG: 5 },
        { name: "샐러드 채소", amount: "150g", caloriesKcal: 35, proteinG: 2, carbsG: 7, fatG: 0 },
        { name: "무가당 두유", amount: "1팩", caloriesKcal: 120, proteinG: 9, carbsG: 8, fatG: 5 },
      ],
      nutrition: createEstimatedNutrition(413, 33, 21, 21),
      status: "adjusted",
    };
  }

  if (planItem.slot === "workout") {
    return {
      ...planItem,
      title: reason === "missed_exercise" ? "오늘 운동 쉬기" : "짧은 회복 산책",
      description:
        reason === "missed_exercise"
          ? "오늘은 쉬고 내일 다시 이어갈 수 있게 플랜을 낮춰요."
          : "10분 정도 가볍게 걸으며 흐름만 이어가요.",
      intensity: "light",
      status: "adjusted",
    };
  }

  return {
    ...planItem,
    description: "오늘 상황에 맞춰 무리 없이 이어갈 수 있게 조정했어요.",
    status: "adjusted",
  };
}

function getTargetSlots(reason: AdjustTodayPlanInput["request"]["reason"]): AiPlanItem["slot"][] {
  if (reason === "missed_exercise") {
    return ["workout"];
  }

  if (reason === "schedule_changed") {
    return ["dinner", "workout"];
  }

  if (reason === "want_replan") {
    return ["breakfast", "lunch", "dinner", "workout"];
  }

  return ["dinner"];
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

function getRevisionSummary(reason: AdjustTodayPlanInput["request"]["reason"]) {
  if (reason === "missed_exercise") {
    return "오늘 운동 부담을 낮추고 내일 다시 이어갈 수 있게 조정합니다.";
  }

  if (reason === "schedule_changed") {
    return "바뀐 일정에 맞춰 저녁과 운동을 더 작게 조정합니다.";
  }

  if (reason === "want_replan") {
    return "오늘 플랜 전체 강도를 낮춰 이어가기 쉽게 조정합니다.";
  }

  return "식사가 달라진 상황에 맞춰 남은 저녁을 가볍게 조정합니다.";
}

function getRevisionMessage(reason: AdjustTodayPlanInput["request"]["reason"]) {
  if (reason === "missed_exercise") {
    return "괜찮아요. 오늘 운동은 낮추고 다음 흐름으로 이어가면 돼요.";
  }

  if (reason === "schedule_changed") {
    return "일정이 달라졌네요. 남은 시간 기준으로 다시 맞춰볼게요.";
  }

  if (reason === "want_replan") {
    return "좋아요. 오늘은 더 쉬운 버전으로 다시 맞춰볼게요.";
  }

  return "괜찮아요. 지금 상황 기준으로 오늘 저녁을 다시 맞춰볼게요.";
}
