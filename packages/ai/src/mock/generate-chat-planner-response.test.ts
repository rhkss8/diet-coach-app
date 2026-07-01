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

  it("uses planning context when suggesting meals", () => {
    const response = generateMockChatPlannerResponse({
      todayDate,
      messages: [{ id: "1", role: "user", content: "저녁 식단 추천해줘" }],
      planningContext: {
        foodContext: {
          allergies: ["새우"],
          avoidedFoods: ["라면"],
          foodsToKeep: ["삼각김밥"],
          preferredFoods: ["라면"],
        },
        managementIntent: {
          goalTypes: ["weight_loss"],
          preferredMethods: ["간헐적 단식"],
          reasonText: "체중 감량이 필요해요",
        },
        routineContext: {
          exerciseWindows: [],
          mealWindows: {},
          rawRoutineText: "8시 기상, 11시 점심, 21시 퇴근",
          riskMoments: [],
        },
      },
    });

    expect(response.type).toBe("meal_plan_suggestion");
    if (response.type === "meal_plan_suggestion") {
      expect(response.message).toContain("삼각김밥");
      expect(response.suggestedItems[0]?.description).toContain("삼각김밥");
      expect(response.suggestedItems[0]?.description).toContain("21시 퇴근");
      expect(response.suggestedItems[0]?.foods?.some((food) => food.name.includes("라면"))).toBe(
        false,
      );
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

  it("targets tomorrow when the user asks to revise a future plan date", () => {
    const response = generateMockChatPlannerResponse({
      todayDate,
      currentPlan: {
        id: "chat-plan",
        goalId: "chat-goal",
        startDate: todayDate,
        endDate: "2026-06-18",
        summary: "기존 플랜",
        items: [
          {
            id: "tomorrow-dinner",
            date: "2026-06-18",
            type: "meal",
            slot: "dinner",
            title: "내일 저녁",
            description: "기존 저녁",
          },
        ],
      },
      messages: [{ id: "1", role: "user", content: "내일 회식이라 내일 저녁 바꿔줘" }],
    });

    expect(response.type).toBe("plan_revision_suggestion");
    if (response.type === "plan_revision_suggestion") {
      expect(response.revision.affectedDate).toBe("2026-06-18");
      expect(response.revision.updatedTodayItems).toHaveLength(0);
      expect(response.revision.updatedFutureItems?.[0]).toEqual(
        expect.objectContaining({
          id: "tomorrow-dinner",
          date: "2026-06-18",
          status: "adjusted",
        }),
      );
    }
  });

  it("creates a weekly revision from chat when the user asks for this week", () => {
    const response = generateMockChatPlannerResponse({
      todayDate,
      currentPlan: {
        id: "chat-plan",
        goalId: "chat-goal",
        startDate: todayDate,
        endDate: "2026-06-19",
        summary: "기존 플랜",
        items: [
          {
            id: "today-dinner",
            date: todayDate,
            type: "meal",
            slot: "dinner",
            title: "오늘 저녁",
            description: "기존 저녁",
          },
          {
            id: "future-workout",
            date: "2026-06-19",
            type: "exercise",
            slot: "workout",
            title: "미래 운동",
            description: "기존 운동",
          },
        ],
      },
      messages: [{ id: "1", role: "user", content: "이번 주 운동이랑 저녁 좀 줄여줘" }],
    });

    expect(response.type).toBe("plan_revision_suggestion");
    if (response.type === "plan_revision_suggestion") {
      expect(response.revision.changedItemIds).toEqual(["today-dinner", "future-workout"]);
      expect(response.revision.updatedTodayItems).toHaveLength(1);
      expect(response.revision.updatedFutureItems).toHaveLength(1);
    }
  });

  it("returns a meal suggestion from uploaded context", () => {
    const response = generateMockChatPlannerResponse({
      todayDate,
      messages: [
        {
          id: "1",
          role: "user",
          content: "이 자료 기준으로 분석해줘",
          attachments: [
            {
              id: "attachment-1",
              name: "dinner-photo.jpg",
              mimeType: "image/jpeg",
              sizeBytes: 1024,
            },
          ],
        },
      ],
    });

    expect(response.type).toBe("meal_plan_suggestion");
    expect(response.message).toContain("dinner-photo.jpg");
  });

  it("returns a plan revision from uploaded context when the user asks to adjust", () => {
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
      messages: [
        {
          id: "1",
          role: "user",
          content: "업로드한 내용 기준으로 오늘 플랜 조정해줘",
          attachments: [
            {
              id: "attachment-1",
              name: "food-log.pdf",
              mimeType: "application/pdf",
              sizeBytes: 2048,
            },
          ],
        },
      ],
    });

    expect(response.type).toBe("plan_revision_suggestion");
    if (response.type === "plan_revision_suggestion") {
      expect(response.revision.summary).toBe("첨부 분석 기반 플랜 수정");
    }
  });
});
