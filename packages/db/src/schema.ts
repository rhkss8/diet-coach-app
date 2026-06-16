export const dbTableNames = [
  "users",
  "goals",
  "plans",
  "plan_items",
  "adjustment_requests",
  "plan_revisions",
  "daily_check_ins",
  "analytics_events",
] as const;

export const dbEnumNames = [
  "sex",
  "goal_status",
  "plan_status",
  "plan_item_type",
  "plan_item_slot",
  "plan_item_status",
  "plan_item_intensity",
  "adjustment_reason",
  "plan_revision_status",
  "daily_check_in_status",
] as const;

export type DbTableName = (typeof dbTableNames)[number];
export type DbEnumName = (typeof dbEnumNames)[number];
