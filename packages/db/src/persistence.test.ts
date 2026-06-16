import { describe, expect, it } from "vitest";

import type { CoreFlowPersistenceInput, SupabaseWriteClient } from "./persistence";
import { persistCoreFlowSnapshot } from "./persistence";

const now = "2026-06-16T00:00:00.000Z";

const input = {
  user: {
    id: "11111111-1111-1111-1111-111111111111",
    age: 34,
    sex: "female",
    heightCm: 164,
    currentWeightKg: 72,
    createdAt: now,
    updatedAt: now,
  },
  goal: {
    id: "22222222-2222-2222-2222-222222222222",
    userId: "11111111-1111-1111-1111-111111111111",
    title: "6kg 감량",
    startDate: "2026-06-16",
    targetDate: "2026-09-16",
    targetWeightKg: 66,
    status: "active",
    createdAt: now,
    updatedAt: now,
  },
  plan: {
    id: "33333333-3333-3333-3333-333333333333",
    goalId: "22222222-2222-2222-2222-222222222222",
    startDate: "2026-06-16",
    endDate: "2026-06-22",
    summary: "이어갈 수 있는 7일 플랜",
    status: "active",
    createdAt: now,
    updatedAt: now,
    items: [
      {
        id: "44444444-4444-4444-4444-444444444444",
        planId: "33333333-3333-3333-3333-333333333333",
        date: "2026-06-16",
        type: "meal",
        slot: "dinner",
        title: "균형 저녁",
        description: "단백질과 채소 중심",
        status: "pending",
      },
    ],
  },
  revisions: [
    {
      id: "55555555-5555-5555-5555-555555555555",
      planId: "33333333-3333-3333-3333-333333333333",
      affectedDate: "2026-06-16",
      reason: "meal_changed",
      status: "approved",
      summary: "저녁 조정",
      userMessage: "남은 하루 기준으로 다시 맞춰볼게요.",
      changedItemIds: ["44444444-4444-4444-4444-444444444444"],
      updatedTodayItems: [],
      createdAt: now,
      approvedAt: now,
    },
  ],
  checkIn: {
    id: "66666666-6666-6666-6666-666666666666",
    userId: "11111111-1111-1111-1111-111111111111",
    goalId: "22222222-2222-2222-2222-222222222222",
    planId: "33333333-3333-3333-3333-333333333333",
    date: "2026-06-16",
    status: "adjusted",
    completedPlanItemIds: [],
    skippedPlanItemIds: [],
    revisionIds: ["55555555-5555-5555-5555-555555555555"],
    createdAt: now,
    updatedAt: now,
  },
} satisfies CoreFlowPersistenceInput;

describe("persistCoreFlowSnapshot", () => {
  it("writes the core flow records in dependency order", async () => {
    const writes: Array<{ operation: string; row: unknown; tableName: string }> = [];
    const client = createRecordingClient(writes);

    await persistCoreFlowSnapshot(client, input);

    expect(writes.map((write) => write.tableName)).toEqual([
      "users",
      "goals",
      "plans",
      "plan_items",
      "plan_revisions",
      "daily_check_ins",
    ]);
    expect(writes[0]?.row).toEqual(
      expect.objectContaining({
        current_weight_kg: 72,
        height_cm: 164,
      }),
    );
    expect(writes[3]?.row).toEqual(
      expect.objectContaining({
        plan_id: "33333333-3333-3333-3333-333333333333",
        status: "pending",
      }),
    );
  });

  it("throws when Supabase returns a write error", async () => {
    const client = createRecordingClient([], "plans");

    await expect(persistCoreFlowSnapshot(client, input)).rejects.toThrow(
      "plans upsert failed: no write",
    );
  });
});

function createRecordingClient(
  writes: Array<{ operation: string; row: unknown; tableName: string }>,
  failingTableName?: string,
): SupabaseWriteClient {
  return {
    from: (tableName) => ({
      insert: async (row) => {
        writes.push({ operation: "insert", row, tableName });
        return { error: tableName === failingTableName ? { message: "no write" } : null };
      },
      upsert: async (row) => {
        writes.push({ operation: "upsert", row, tableName });
        return { error: tableName === failingTableName ? { message: "no write" } : null };
      },
    }),
  };
}
