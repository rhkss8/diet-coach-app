import type { AiPlan, ChatPlannerResponse } from "@diet-coach/ai";

import { applyPlanRevisionToPlan } from "../plan/apply-plan-revision";
import { createEstimatedNutrition } from "../plan/plan-item-display";

export function applyChatPlannerResponseToPlan(
  response: ChatPlannerResponse,
  currentPlan: AiPlan | null,
  todayDate: string,
): AiPlan | null {
  if (response.type === "clarification_question") {
    return currentPlan;
  }

  if (response.type === "plan_revision_suggestion") {
    return currentPlan ? applyPlanRevisionToPlan(currentPlan, response.revision) : null;
  }

  const basePlan = currentPlan ?? createEmptyChatPlan(todayDate);
  const existingItemIds = new Set(basePlan.items.map((item) => item.id));
  const newItems = response.suggestedItems
    .map((item, index) => ({
      ...item,
      id: item.id ?? `chat-${todayDate}-${response.type}-${index}`,
      planId: basePlan.id ?? "chat-plan",
      status: item.status ?? "pending",
    }))
    .filter((item) => !existingItemIds.has(item.id));

  return {
    ...basePlan,
    endDate: getLatestPlanDate([...basePlan.items, ...newItems], basePlan.endDate),
    items: [...basePlan.items, ...newItems],
    summary: getPlanSummaryAfterAction(response.type),
  };
}

export function getChatPlannerConfirmationAction(response: ChatPlannerResponse) {
  return response.type === "clarification_question" ? null : response.confirmation.action;
}

function createEmptyChatPlan(todayDate: string): AiPlan {
  return {
    id: "chat-plan",
    goalId: "chat-goal",
    startDate: todayDate,
    endDate: todayDate,
    summary: "상담을 통해 만든 플랜입니다.",
    items: createStarterTodayItems(todayDate),
  };
}

function createStarterTodayItems(todayDate: string): AiPlan["items"] {
  return [
    {
      id: `chat-${todayDate}-breakfast`,
      planId: "chat-plan",
      date: todayDate,
      type: "meal",
      slot: "breakfast",
      title: "호두 계란 단백질 쉐이크",
      description: "오전 8시 · 앱 기준 추정치",
      foods: [
        { name: "호두", amount: "2알", caloriesKcal: 52, proteinG: 1, carbsG: 1, fatG: 5 },
        { name: "삶은 계란", amount: "2개", caloriesKcal: 156, proteinG: 12, carbsG: 1, fatG: 10 },
        {
          name: "단백질 음료",
          amount: "1병",
          caloriesKcal: 165,
          proteinG: 21,
          carbsG: 10,
          fatG: 6,
        },
      ],
      nutrition: createEstimatedNutrition(373, 34, 12, 21),
      status: "completed",
    },
    {
      id: `chat-${todayDate}-lunch`,
      planId: "chat-plan",
      date: todayDate,
      type: "meal",
      slot: "lunch",
      title: "닭가슴살 샐러드",
      description: "오후 12시 30분 · 단백질 우선 일반식",
      foods: [
        { name: "닭가슴살", amount: "120g", caloriesKcal: 198, proteinG: 37, carbsG: 0, fatG: 4 },
        { name: "현미밥", amount: "120g", caloriesKcal: 180, proteinG: 4, carbsG: 38, fatG: 1 },
        { name: "샐러드 채소", amount: "150g", caloriesKcal: 35, proteinG: 2, carbsG: 7, fatG: 0 },
      ],
      nutrition: createEstimatedNutrition(413, 43, 45, 5),
      status: "completed",
    },
    {
      id: `chat-${todayDate}-dinner`,
      planId: "chat-plan",
      date: todayDate,
      type: "meal",
      slot: "dinner",
      title: "현미밥 + 두부구이",
      description: "오후 7시 · 부담 낮춘 균형 저녁",
      foods: [
        { name: "현미밥", amount: "150g", caloriesKcal: 225, proteinG: 5, carbsG: 48, fatG: 2 },
        { name: "두부구이", amount: "150g", caloriesKcal: 180, proteinG: 16, carbsG: 5, fatG: 11 },
        { name: "데친 채소", amount: "120g", caloriesKcal: 45, proteinG: 3, carbsG: 8, fatG: 0 },
      ],
      nutrition: createEstimatedNutrition(450, 24, 61, 13),
      status: "pending",
    },
    {
      id: `chat-${todayDate}-night-meal`,
      planId: "chat-plan",
      date: todayDate,
      type: "meal",
      slot: "snack",
      title: "삼각김밥 + 두유",
      description: "야근 대비 · 편의점 선택지",
      foods: [
        { name: "삼각김밥", amount: "1개", caloriesKcal: 210, proteinG: 5, carbsG: 39, fatG: 4 },
        { name: "무가당 두유", amount: "1팩", caloriesKcal: 120, proteinG: 9, carbsG: 8, fatG: 5 },
      ],
      nutrition: createEstimatedNutrition(330, 14, 47, 9),
      status: "pending",
    },
    {
      id: `chat-${todayDate}-walk`,
      planId: "chat-plan",
      date: todayDate,
      type: "exercise",
      slot: "workout",
      title: "저녁 산책",
      description: "30분 · 약 120kcal 소모",
      intensity: "light",
      status: "pending",
    },
    {
      id: `chat-${todayDate}-stretch`,
      planId: "chat-plan",
      date: todayDate,
      type: "exercise",
      slot: "workout",
      title: "스트레칭 루틴",
      description: "10분 · 취침 전",
      intensity: "light",
      status: "pending",
    },
  ];
}

function getLatestPlanDate(items: AiPlan["items"], fallbackDate: string) {
  return items.reduce(
    (latestDate, item) => (item.date > latestDate ? item.date : latestDate),
    fallbackDate,
  );
}

function getPlanSummaryAfterAction(responseType: ChatPlannerResponse["type"]) {
  if (responseType === "meal_plan_suggestion") {
    return "채팅 상담에서 나온 식단을 반영한 플랜입니다.";
  }

  if (responseType === "exercise_plan_suggestion") {
    return "채팅 상담에서 나온 운동을 반영한 플랜입니다.";
  }

  return "채팅 상담을 통해 조정한 플랜입니다.";
}
