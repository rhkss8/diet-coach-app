import type { EntityId, ISODate, ISODateTime } from "./common";

export type GoalStatus = "draft" | "active" | "paused" | "completed" | "archived";

export type Goal = {
  id: EntityId;
  userId: EntityId;
  title: string;
  startDate: ISODate;
  targetDate: ISODate;
  targetWeightKg: number;
  status: GoalStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type GoalInput = Pick<Goal, "targetDate" | "targetWeightKg">;

export function isActiveGoal(goal: Goal) {
  return goal.status === "active";
}
