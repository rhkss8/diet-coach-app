import { useEffect, useState } from "react";

import type { AdjustTodayPlanOutput } from "@diet-coach/ai";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getMobileSupabaseClient } from "../../shared/lib/supabase";
import { type PlanRevisionSnapshot, createPlanRevisionSnapshot } from "./plan-revision-snapshot";
import { loadPlanRevisionSnapshots, savePlanRevisionSnapshot } from "./planRevisionStorage";

type PlanRevisionPersistenceOptions = {
  supabaseClient?: SupabaseClient | null;
  userId?: string;
};

export function usePlanRevisionPersistence({
  supabaseClient = getMobileSupabaseClient(),
  userId,
}: PlanRevisionPersistenceOptions = {}) {
  const [latestRevisionSnapshot, setLatestRevisionSnapshot] = useState<PlanRevisionSnapshot | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    loadPlanRevisionSnapshots({ supabaseClient, userId }).then((snapshots) => {
      if (isMounted) {
        setLatestRevisionSnapshot(snapshots[0] ?? null);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [supabaseClient, userId]);

  async function persistPlanRevision(revision: AdjustTodayPlanOutput["revision"]) {
    const snapshot = createPlanRevisionSnapshot(revision);

    await savePlanRevisionSnapshot(snapshot, { supabaseClient, userId });
    setLatestRevisionSnapshot(snapshot);
  }

  return {
    latestRevisionSnapshot,
    persistPlanRevision,
  };
}
