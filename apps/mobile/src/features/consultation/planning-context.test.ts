import { describe, expect, it } from "vitest";

import {
  createEmptyPlanningContextDraft,
  createPlanningContextFromDraft,
  isPlanningContextDraftReady,
  summarizePlanningContext,
} from "./planning-context";

describe("planning context onboarding", () => {
  it("requires intent, food context, and routine before generating a context", () => {
    const draft = createEmptyPlanningContextDraft();

    expect(isPlanningContextDraftReady(draft)).toBe(false);

    draft.goalTypes = ["weight_loss"];
    draft.reasonText = "야근 때문에 저녁이 자주 무너져요.";
    draft.foodsToKeepText = "삼각김밥";
    draft.routineText = "8시 기상, 11시 30분 점심, 21시 퇴근";

    expect(isPlanningContextDraftReady(draft)).toBe(true);
  });

  it("converts guided answers into structured planning context", () => {
    const context = createPlanningContextFromDraft({
      ...createEmptyPlanningContextDraft(),
      allergiesText: "새우",
      avoidedFoodsText: "크림소스",
      eatingContextText: "편의점, 회사 식당",
      exerciseWindowsText: "퇴근 후 10분",
      foodsToKeepText: "삼각김밥",
      goalTypes: ["weight_loss", "schedule_recovery"],
      preferredFoodsText: "계란, 두부",
      reasonText: "야근 때문에 저녁이 자주 무너져요.",
      riskMomentsText: "야근, 늦은 저녁",
      routineText: "8시 기상, 11시 30분 점심, 21시 퇴근",
      wakeTimeText: "08:00",
      workEndTimeText: "21:00",
    });

    expect(context.managementIntent.goalTypes).toEqual(["weight_loss", "schedule_recovery"]);
    expect(context.foodContext.preferredFoods).toEqual(["계란", "두부"]);
    expect(context.foodContext.allergies).toEqual(["새우"]);
    expect(context.routineContext.rawRoutineText).toContain("21시 퇴근");
  });

  it("summarizes planning context as a user message", () => {
    const context = createPlanningContextFromDraft({
      ...createEmptyPlanningContextDraft(),
      foodsToKeepText: "삼각김밥",
      goalTypes: ["weight_loss"],
      preferredFoodsText: "계란",
      reasonText: "체중 감량이 필요해요.",
      routineText: "8시 기상, 21시 퇴근",
    });

    expect(summarizePlanningContext(context)).toContain("관리 목적: 체중 감량");
    expect(summarizePlanningContext(context)).toContain("하루 루틴: 8시 기상");
  });
});
