import type { AiPlan, ChatPlannerResponse } from "@diet-coach/ai";

import { applyPlanRevisionToPlan } from "../plan/apply-plan-revision";

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
      title: "귀리볼 + 삶은 계란",
      description: "오전 8시 · 약 380kcal",
      status: "completed",
    },
    {
      id: `chat-${todayDate}-lunch`,
      planId: "chat-plan",
      date: todayDate,
      type: "meal",
      slot: "lunch",
      title: "닭가슴살 샐러드",
      description: "오후 12시 30분 · 약 420kcal",
      status: "completed",
    },
    {
      id: `chat-${todayDate}-dinner`,
      planId: "chat-plan",
      date: todayDate,
      type: "meal",
      slot: "dinner",
      title: "현미밥 + 두부구이",
      description: "오후 7시 · 약 510kcal",
      status: "pending",
    },
    {
      id: `chat-${todayDate}-night-meal`,
      planId: "chat-plan",
      date: todayDate,
      type: "meal",
      slot: "snack",
      title: "삼각김밥 + 두유",
      description: "야근 대비 · 약 470kcal",
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
