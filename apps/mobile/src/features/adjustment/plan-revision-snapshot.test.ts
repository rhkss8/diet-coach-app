import { describe, expect, it } from "vitest";
import type { AdjustTodayPlanOutput } from "@diet-coach/ai";

import {
  createPlanRevisionSnapshot,
  parsePlanRevisionSnapshots,
  serializePlanRevisionSnapshots,
} from "./plan-revision-snapshot";

const revision = {
  planId: "plan-1",
  affectedDate: "2026-06-16",
  reason: "meal_changed",
  summary: "저녁 조정",
  userMessage: "남은 하루 기준으로 다시 맞춰볼게요.",
  changedItemIds: ["dinner-1"],
  updatedTodayItems: [],
} satisfies AdjustTodayPlanOutput["revision"];

describe("plan revision snapshot", () => {
  it("creates a persisted revision snapshot", () => {
    expect(createPlanRevisionSnapshot(revision, "2026-06-16T00:00:00.000Z")).toEqual({
      revision,
      persistedAt: "2026-06-16T00:00:00.000Z",
    });
  });

  it("serializes and parses revision snapshots", () => {
    const snapshots = [createPlanRevisionSnapshot(revision, "2026-06-16T00:00:00.000Z")];

    expect(parsePlanRevisionSnapshots(serializePlanRevisionSnapshots(snapshots))).toEqual(
      snapshots,
    );
  });

  it("returns an empty list for invalid data", () => {
    expect(parsePlanRevisionSnapshots("not json")).toEqual([]);
    expect(parsePlanRevisionSnapshots("{}")).toEqual([]);
  });
});
