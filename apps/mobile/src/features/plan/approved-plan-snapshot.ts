import type { AiPlan } from "@diet-coach/ai";
import type { PlanBasis } from "../settings/plan-basis";

export type ApprovedPlanSnapshot = {
  plan: AiPlan;
  approvedAt: string;
  planBasis?: PlanBasis;
};

export function createApprovedPlanSnapshot(
  plan: AiPlan,
  approvedAt: string = new Date().toISOString(),
  planBasis?: PlanBasis,
): ApprovedPlanSnapshot {
  return {
    plan,
    approvedAt,
    ...(planBasis ? { planBasis } : {}),
  };
}

export function serializeApprovedPlanSnapshot(snapshot: ApprovedPlanSnapshot) {
  return JSON.stringify(snapshot);
}

export function parseApprovedPlanSnapshot(value: string): ApprovedPlanSnapshot | null {
  try {
    const parsed = JSON.parse(value) as ApprovedPlanSnapshot;

    if (!parsed.plan || !parsed.approvedAt) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}
