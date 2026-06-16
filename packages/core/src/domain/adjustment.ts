import type { EntityId, ISODate, ISODateTime } from "./common";

export type AdjustmentReason =
  | "meal_changed"
  | "missed_exercise"
  | "schedule_changed"
  | "want_replan";

export type AdjustmentRequest = {
  id: EntityId;
  planId: EntityId;
  affectedDate: ISODate;
  reason: AdjustmentReason;
  note?: string;
  createdAt: ISODateTime;
};

export const adjustmentReasonLabels: Record<AdjustmentReason, string> = {
  meal_changed: "식사를 다르게 했어요",
  missed_exercise: "운동을 못 했어요",
  schedule_changed: "일정이 바뀌었어요",
  want_replan: "그냥 다시 맞추고 싶어요",
};

export function getAdjustmentReasonLabel(reason: AdjustmentReason) {
  return adjustmentReasonLabels[reason];
}
