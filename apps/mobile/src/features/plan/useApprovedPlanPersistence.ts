import { useEffect, useState } from "react";

import type { AdjustTodayPlanOutput, AiPlan } from "@diet-coach/ai";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getMobileSupabaseClient } from "../../shared/lib/supabase";
import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import { applyPlanRevisionToPlan } from "./apply-plan-revision";
import { type ApprovedPlanSnapshot, createApprovedPlanSnapshot } from "./approved-plan-snapshot";
import {
  loadApprovedPlanSnapshot,
  loadLocalApprovedPlanSnapshot,
  saveApprovedPlanSnapshot,
} from "./approvedPlanStorage";

type ApprovedPlanPersistenceOptions = {
  supabaseClient?: SupabaseClient | null;
  userId?: string;
};

export function useApprovedPlanPersistence({
  supabaseClient = getMobileSupabaseClient(),
  userId,
}: ApprovedPlanPersistenceOptions = {}) {
  const [approvedPlanSnapshot, setApprovedPlanSnapshot] = useState<ApprovedPlanSnapshot | null>(
    null,
  );
  const [isHydratingApprovedPlan, setIsHydratingApprovedPlan] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadApprovedPlanSnapshotForUser(supabaseClient, userId)
      .then((snapshot) => {
        if (isMounted) {
          setApprovedPlanSnapshot(snapshot);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsHydratingApprovedPlan(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabaseClient, userId]);

  async function approvePlan(plan: AiPlan) {
    await saveApprovedPlan(plan);

    trackAnalyticsEvent("PLAN_APPROVED", {
      userId: "local-user",
      goalId: plan.goalId,
      planId: plan.id ?? "local-plan",
    });
  }

  async function saveApprovedPlan(plan: AiPlan) {
    const snapshot = createApprovedPlanSnapshot(plan);

    await persistApprovedPlanSnapshot(snapshot);
  }

  async function applyApprovedRevision(revision: AdjustTodayPlanOutput["revision"]) {
    if (!approvedPlanSnapshot) {
      return null;
    }

    const revisedPlan = applyPlanRevisionToPlan(approvedPlanSnapshot.plan, revision);
    const snapshot = createApprovedPlanSnapshot(revisedPlan, approvedPlanSnapshot.approvedAt);

    await persistApprovedPlanSnapshot(snapshot);

    return snapshot;
  }

  async function persistApprovedPlanSnapshot(snapshot: ApprovedPlanSnapshot) {
    await saveApprovedPlanSnapshot(snapshot, { supabaseClient, userId });
    setApprovedPlanSnapshot(snapshot);
  }

  return {
    applyApprovedRevision,
    approvedPlanSnapshot,
    approvePlan,
    saveApprovedPlan,
    isHydratingApprovedPlan,
  };
}

async function loadApprovedPlanSnapshotForUser(
  supabaseClient: SupabaseClient | null,
  userId: string | undefined,
) {
  if (!supabaseClient || !userId) {
    return loadApprovedPlanSnapshot();
  }

  const remoteSnapshot = await loadApprovedPlanSnapshot({ supabaseClient, userId });

  if (remoteSnapshot) {
    return remoteSnapshot;
  }

  const localSnapshot = await loadLocalApprovedPlanSnapshot();

  if (localSnapshot) {
    await saveApprovedPlanSnapshot(localSnapshot, { supabaseClient, userId });
  }

  return localSnapshot;
}
