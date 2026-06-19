import { describe, expect, it } from "vitest";

import type { ChatPlannerResponse } from "@diet-coach/ai";

import { applyChatPlannerResponseToPlan } from "./chat-plan-actions";
import { getChatProposalPreviewItems } from "./chat-proposal-preview";

const todayDate = "2026-06-17";

describe("getChatProposalPreviewItems", () => {
  it("renders meal suggestions as two-line proposal rows", () => {
    const rows = getChatProposalPreviewItems({
      type: "meal_plan_suggestion",
      message: "저녁을 넣어볼게요.",
      suggestedItems: [
        {
          date: todayDate,
          type: "meal",
          slot: "dinner",
          title: "상담 기반 저녁 식단",
          description: "대화에서 나온 생활 패턴을 반영해요.",
        },
      ],
      confirmation: {
        action: "add_to_meal_plan",
        label: "식단에 추가하시겠습니까?",
      },
    });

    expect(rows).toEqual([
      {
        title: "저녁 · 상담 기반 저녁 식단",
        detail: "대화에서 나온 생활 패턴을 반영해요.",
      },
    ]);
  });

  it("keeps plan mutation behind explicit approval", () => {
    const response: ChatPlannerResponse = {
      type: "exercise_plan_suggestion",
      message: "걷기를 넣어볼게요.",
      suggestedItems: [
        {
          id: "walk",
          date: todayDate,
          type: "exercise",
          slot: "workout",
          title: "20분 빠르게 걷기",
          description: "바로 실행 가능한 걷기로 시작해요.",
        },
      ],
      confirmation: {
        action: "add_to_exercise_plan",
        label: "운동에 추가하시겠습니까?",
      },
    };

    const rows = getChatProposalPreviewItems(response);

    expect(rows).toHaveLength(1);
    expect(applyChatPlannerResponseToPlan(response, null, todayDate)?.items).toContainEqual(
      expect.objectContaining({ id: "walk" }),
    );
  });
});
