import { describe, expect, it } from "vitest";

import {
  canContinuePlanningContextStep,
  createEmptyPlanningContextDraft,
  createPlanningContextFromDraft,
  isPlanningContextDraftReady,
  summarizePlanningContext,
} from "./planning-context";

describe("planning context onboarding", () => {
  it("requires a selected intent and routine before generating a context", () => {
    const draft = createEmptyPlanningContextDraft();

    expect(isPlanningContextDraftReady(draft)).toBe(false);

    draft.goalTypes = ["weight_loss"];

    expect(isPlanningContextDraftReady(draft)).toBe(false);

    draft.routineText = "8시 기상, 11시 30분 점심, 21시 퇴근";

    expect(isPlanningContextDraftReady(draft)).toBe(true);
  });

  it("allows progressive guide steps with optional difficulty and food answers", () => {
    const draft = createEmptyPlanningContextDraft();

    expect(canContinuePlanningContextStep(draft, "intent")).toBe(false);

    draft.goalTypes = ["habit_improvement"];

    expect(canContinuePlanningContextStep(draft, "intent")).toBe(true);
    expect(canContinuePlanningContextStep(draft, "food")).toBe(true);
    expect(canContinuePlanningContextStep(draft, "routine")).toBe(false);

    draft.routineText = "8시 기상, 11시 점심, 20시 퇴근";

    expect(canContinuePlanningContextStep(draft, "routine")).toBe(true);
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
      goalTypes: ["weight_loss"],
      routineText: "8시 기상, 21시 퇴근",
    });

    const summary = summarizePlanningContext(context);

    expect(summary).toContain("관리 목적: 체중 감량");
    expect(summary).not.toContain("어려운 점:");
    expect(summary).not.toContain("먹고 싶은 음식:");
    expect(summary).toContain("하루 루틴: 8시 기상");
  });
});
