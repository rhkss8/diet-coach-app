import type { AdjustTodayPlanOutput } from "@diet-coach/ai";

export type PlanRevisionSnapshot = {
  revision: AdjustTodayPlanOutput["revision"];
  persistedAt: string;
};

export function createPlanRevisionSnapshot(
  revision: AdjustTodayPlanOutput["revision"],
  persistedAt: string = new Date().toISOString(),
): PlanRevisionSnapshot {
  return {
    revision,
    persistedAt,
  };
}

export function serializePlanRevisionSnapshots(snapshots: PlanRevisionSnapshot[]) {
  return JSON.stringify(snapshots);
}

export function parsePlanRevisionSnapshots(value: string): PlanRevisionSnapshot[] {
  try {
    const parsed = JSON.parse(value) as PlanRevisionSnapshot[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((snapshot) => snapshot.revision && snapshot.persistedAt);
  } catch {
    return [];
  }
}
