import type { AdjustTodayPlanOutput } from "@diet-coach/ai";

export type PlanRevisionSnapshot = {
  revisionId: string;
  revision: AdjustTodayPlanOutput["revision"];
  persistedAt: string;
};

export function createPlanRevisionSnapshot(
  revision: AdjustTodayPlanOutput["revision"],
  persistedAt: string = new Date().toISOString(),
): PlanRevisionSnapshot {
  return {
    revisionId: createPlanRevisionId(revision),
    revision,
    persistedAt,
  };
}

export function createPlanRevisionId(revision: AdjustTodayPlanOutput["revision"]) {
  return `${revision.planId}:${revision.affectedDate}:${revision.reason}`;
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

    return parsed.filter(
      (snapshot) => snapshot.revisionId && snapshot.revision && snapshot.persistedAt,
    );
  } catch {
    return [];
  }
}
