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
