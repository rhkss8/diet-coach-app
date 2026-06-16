import { describe, expect, it } from "vitest";

import {
  validateAdjustTodayPlanOutput,
  validateGenerateInitialPlanOutput,
  validateSummarizeProgressOutput,
} from "./validators";

const planItem = {
  id: "item-breakfast-1",
  date: "2026-06-16",
  type: "meal",
  slot: "breakfast",
  title: "단백질 중심 아침",
  description: "계란과 과일로 가볍게 시작해요.",
  intensity: "light",
  status: "pending",
};

describe("AI contract validators", () => {
  it("accepts a renderable initial plan output", () => {
    const result = validateGenerateInitialPlanOutput({
      plan: {
        goalId: "goal-1",
        startDate: "2026-06-16",
        endDate: "2026-06-22",
        summary: "이번 주는 회복 가능한 루틴을 우선합니다.",
        items: [planItem],
      },
      rationale: "아침을 건너뛰지 않는 흐름부터 만듭니다.",
      userMessage: "좋아요. 이번 주는 무리하지 않고 이어갈 수 있게 맞춰볼게요.",
      adjustmentNotes: ["회식이 있으면 저녁과 다음 아침을 조정합니다."],
    });

    expect(result.ok).toBe(true);
  });

  it("rejects initial plan output that the app cannot render", () => {
    const result = validateGenerateInitialPlanOutput({
      plan: {
        goalId: "goal-1",
        startDate: "2026-06-16",
        endDate: "2026-06-22",
        summary: "이번 주 계획",
        items: [{ ...planItem, slot: "midnight" }],
      },
      rationale: "",
      userMessage: "이번엔 실패하지 마세요.",
      adjustmentNotes: [],
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("Expected invalid initial plan output");
    }
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "plan.items.0.slot must be one of: breakfast, lunch, dinner, snack, workout",
        "rationale must be a non-empty string",
        "userMessage contains banned coaching copy: 실패",
      ]),
    );
  });

  it("requires adjustment output to name changed items and reviewed today items", () => {
    const result = validateAdjustTodayPlanOutput({
      revision: {
        planId: "plan-1",
        affectedDate: "2026-06-16",
        reason: "meal_changed",
        summary: "점심이 무거웠으니 저녁을 가볍게 조정합니다.",
        userMessage: "괜찮아요. 남은 하루 기준으로 저녁을 다시 맞춰볼게요.",
        changedItemIds: ["item-dinner-1"],
        updatedTodayItems: [
          {
            ...planItem,
            id: "item-dinner-1",
            slot: "dinner",
            title: "가벼운 저녁",
            status: "adjusted",
          },
        ],
      },
    });

    expect(result.ok).toBe(true);
  });

  it("rejects adjustment output without changed item ids", () => {
    const result = validateAdjustTodayPlanOutput({
      revision: {
        planId: "plan-1",
        affectedDate: "2026-06-16",
        reason: "meal_changed",
        summary: "저녁 조정",
        userMessage: "남은 하루 기준으로 다시 맞춰볼게요.",
        changedItemIds: [],
        updatedTodayItems: [],
      },
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      throw new Error("Expected invalid adjustment output");
    }
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "revision.changedItemIds must include at least 1 item(s)",
        "revision.updatedTodayItems must include at least 1 item(s)",
      ]),
    );
  });

  it("keeps progress summary copy out of shame and diagnosis", () => {
    const result = validateSummarizeProgressOutput({
      summary: "이번 주는 일정 변경 뒤에도 다시 들어온 날이 있었어요.",
      suggestion: "다음 주는 저녁 후보를 두 가지로 준비해두면 이어가기 쉬워요.",
    });

    expect(result.ok).toBe(true);
  });
});
