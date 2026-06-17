import { useEffect, useState } from "react";

import type { AdjustTodayPlanOutput, AiPlan } from "@diet-coach/ai";

import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import { applyPlanRevisionToPlan } from "./apply-plan-revision";
import { type ApprovedPlanSnapshot, createApprovedPlanSnapshot } from "./approved-plan-snapshot";
import { loadApprovedPlanSnapshot, saveApprovedPlanSnapshot } from "./approvedPlanStorage";

export function useApprovedPlanPersistence() {
  const [approvedPlanSnapshot, setApprovedPlanSnapshot] = useState<ApprovedPlanSnapshot | null>(
    null,
  );
  const [isHydratingApprovedPlan, setIsHydratingApprovedPlan] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadApprovedPlanSnapshot()
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
  }, []);

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
    await saveApprovedPlanSnapshot(snapshot);
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
