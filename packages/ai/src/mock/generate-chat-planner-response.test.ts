import { describe, expect, it } from "vitest";

import { generateMockChatPlannerResponse } from "./generate-chat-planner-response";

const todayDate = "2026-06-17";

describe("generateMockChatPlannerResponse", () => {
  it("returns a meal suggestion action from meal intent", () => {
    const response = generateMockChatPlannerResponse({
      todayDate,
      messages: [{ id: "1", role: "user", content: "저녁 식단 추천해줘" }],
    });

    expect(response.type).toBe("meal_plan_suggestion");
    if (response.type === "meal_plan_suggestion") {
      expect(response.confirmation.label).toBe("식단에 추가하시겠습니까?");
    }
  });

  it("returns an exercise suggestion action from exercise intent", () => {
    const response = generateMockChatPlannerResponse({
      todayDate,
      messages: [{ id: "1", role: "user", content: "운동은 걷기부터 하고 싶어" }],
    });

    expect(response.type).toBe("exercise_plan_suggestion");
    if (response.type === "exercise_plan_suggestion") {
      expect(response.confirmation.label).toBe("운동에 추가하시겠습니까?");
    }
  });

  it("returns a revision action when the user asks to adjust an existing plan", () => {
    const response = generateMockChatPlannerResponse({
      todayDate,
      currentPlan: {
        id: "chat-plan",
        goalId: "chat-goal",
        startDate: todayDate,
        endDate: todayDate,
        summary: "기존 플랜",
        items: [],
      },
      messages: [{ id: "1", role: "user", content: "회식 때문에 오늘 플랜 수정해줘" }],
    });

    expect(response.type).toBe("plan_revision_suggestion");
    if (response.type === "plan_revision_suggestion") {
      expect(response.confirmation.label).toBe("플랜을 수정하시겠습니까?");
    }
  });
});
