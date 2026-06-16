import type { AdjustmentReason, AdjustmentRequest } from "./adjustment";
import type { EntityId, ISODate, ISODateTime } from "./common";

export type PlanStatus = "draft" | "active" | "completed" | "archived";
export type PlanItemType = "meal" | "exercise";
export type PlanItemSlot = "breakfast" | "lunch" | "dinner" | "snack" | "workout";
export type PlanItemStatus = "pending" | "completed" | "skipped" | "adjusted";
export type PlanItemIntensity = "light" | "moderate" | "challenging";
export type PlanRevisionStatus = "proposed" | "approved" | "dismissed";

export type PlanItem = {
  id: EntityId;
  planId: EntityId;
  date: ISODate;
  type: PlanItemType;
  slot: PlanItemSlot;
  title: string;
  description: string;
  intensity?: PlanItemIntensity;
  status: PlanItemStatus;
};

export type Plan = {
  id: EntityId;
  goalId: EntityId;
  startDate: ISODate;
  endDate: ISODate;
  summary: string;
  status: PlanStatus;
  items: PlanItem[];
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type PlanRevision = {
  id: EntityId;
  planId: EntityId;
  affectedDate: ISODate;
  reason: AdjustmentReason;
  status: PlanRevisionStatus;
  summary: string;
  userMessage: string;
  changedItemIds: EntityId[];
  updatedTodayItems: PlanItem[];
  updatedFutureItems?: PlanItem[];
  requestId?: AdjustmentRequest["id"];
  createdAt: ISODateTime;
  approvedAt?: ISODateTime;
  dismissedAt?: ISODateTime;
};

export function isPlanItemAdjustable(planItem: PlanItem) {
  return planItem.status === "pending" || planItem.status === "skipped";
}

export function getPlanItemsForDate(plan: Plan, date: ISODate) {
  return plan.items.filter((planItem) => planItem.date === date);
}

export function isPlanRevisionApproved(planRevision: PlanRevision) {
  return planRevision.status === "approved";
}
