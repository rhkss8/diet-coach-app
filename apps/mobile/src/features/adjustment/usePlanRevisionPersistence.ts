import { useState } from "react";

import type { AdjustTodayPlanOutput } from "@diet-coach/ai";

import { type PlanRevisionSnapshot, createPlanRevisionSnapshot } from "./plan-revision-snapshot";
import { savePlanRevisionSnapshot } from "./planRevisionStorage";

export function usePlanRevisionPersistence() {
  const [latestRevisionSnapshot, setLatestRevisionSnapshot] = useState<PlanRevisionSnapshot | null>(
    null,
  );

  async function persistPlanRevision(revision: AdjustTodayPlanOutput["revision"]) {
    const snapshot = createPlanRevisionSnapshot(revision);

    await savePlanRevisionSnapshot(snapshot);
    setLatestRevisionSnapshot(snapshot);
  }

  return {
    latestRevisionSnapshot,
    persistPlanRevision,
  };
}
