import { describe, expect, it } from "vitest";

import { applyChatPlannerResponseToPlan } from "./chat-plan-actions";

const todayDate = "2026-06-17";

describe("applyChatPlannerResponseToPlan", () => {
  it("creates a plan when a meal suggestion is approved without an existing plan", () => {
    const plan = applyChatPlannerResponseToPlan(
      {
        type: "meal_plan_suggestion",
        message: "저녁을 넣어볼게요.",
        suggestedItems: [
          {
            date: todayDate,
            type: "meal",
            slot: "dinner",
            title: "단백질 저녁",
            description: "가볍게 이어가는 저녁",
          },
        ],
        confirmation: {
          action: "add_to_meal_plan",
          label: "식단에 추가하시겠습니까?",
        },
      },
      null,
      todayDate,
    );

    expect(plan?.items).toHaveLength(7);
    expect(plan?.items.filter((item) => item.status === "completed")).toHaveLength(2);
    expect(plan?.items.some((item) => item.title === "단백질 저녁")).toBe(true);
  });

  it("adds exercise items to an existing plan", () => {
    const plan = applyChatPlannerResponseToPlan(
      {
        type: "exercise_plan_suggestion",
        message: "걷기를 넣어볼게요.",
        suggestedItems: [
          {
            id: "walk",
            date: todayDate,
            type: "exercise",
            slot: "workout",
            title: "20분 걷기",
            description: "퇴근 후 걷기",
          },
        ],
        confirmation: {
          action: "add_to_exercise_plan",
          label: "운동에 추가하시겠습니까?",
        },
      },
      {
        id: "chat-plan",
        goalId: "chat-goal",
        startDate: todayDate,
        endDate: todayDate,
        summary: "기존 플랜",
        items: [],
      },
      todayDate,
    );

    expect(plan?.items[0]?.type).toBe("exercise");
  });
});
