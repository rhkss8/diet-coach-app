import type { AdjustmentReason } from "@diet-coach/core";

import { getAdjustmentReasonLabel } from "@diet-coach/core";

export const adjustmentReasonOptions = [
  "meal_changed",
  "missed_exercise",
  "schedule_changed",
  "want_replan",
] as const satisfies AdjustmentReason[];

export function getAdjustmentReasonOptions() {
  return adjustmentReasonOptions.map((reason) => ({
    label: getAdjustmentReasonLabel(reason),
    value: reason,
  }));
}
