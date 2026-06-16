import type { EntityId, ISODate, ISODateTime } from "./common";

export type DailyCheckInStatus = "not_started" | "in_progress" | "completed" | "adjusted";

export type DailyCheckIn = {
  id: EntityId;
  userId: EntityId;
  goalId: EntityId;
  planId: EntityId;
  date: ISODate;
  status: DailyCheckInStatus;
  completedPlanItemIds: EntityId[];
  skippedPlanItemIds: EntityId[];
  revisionIds: EntityId[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export function hasApprovedRevisionForDay(dailyCheckIn: DailyCheckIn) {
  return dailyCheckIn.revisionIds.length > 0;
}
