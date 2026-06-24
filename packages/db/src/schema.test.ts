import { describe, expect, it } from "vitest";

import { dbEnumNames, dbTableNames } from "./schema";

describe("database schema contract", () => {
  it("keeps the MVP persistence tables explicit", () => {
    expect(dbTableNames).toEqual([
      "users",
      "goals",
      "plans",
      "plan_items",
      "plan_item_foods",
      "adjustment_requests",
      "plan_revisions",
      "daily_check_ins",
      "planning_contexts",
      "chat_messages",
      "attachments",
      "approved_plan_snapshots",
      "plan_revision_snapshots",
      "analytics_events",
    ]);
  });

  it("keeps domain enum names explicit", () => {
    expect(dbEnumNames).toEqual(
      expect.arrayContaining([
        "sex",
        "goal_status",
        "plan_status",
        "plan_item_status",
        "adjustment_reason",
        "plan_revision_status",
        "daily_check_in_status",
      ]),
    );
  });
});
