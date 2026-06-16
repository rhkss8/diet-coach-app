import type { AiPlan } from "@diet-coach/ai";

export type ApprovedPlanSnapshot = {
  plan: AiPlan;
  approvedAt: string;
};

export function createApprovedPlanSnapshot(
  plan: AiPlan,
  approvedAt: string = new Date().toISOString(),
): ApprovedPlanSnapshot {
  return {
    plan,
    approvedAt,
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
