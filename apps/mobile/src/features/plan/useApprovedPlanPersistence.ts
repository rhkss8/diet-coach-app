import { useEffect, useState } from "react";

import type { AiPlan } from "@diet-coach/ai";

import { trackAnalyticsEvent } from "../../shared/lib/analytics";
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
    const snapshot = createApprovedPlanSnapshot(plan);

    await saveApprovedPlanSnapshot(snapshot);
    trackAnalyticsEvent("PLAN_APPROVED", {
      userId: "local-user",
      goalId: plan.goalId,
      planId: plan.id ?? "local-plan",
    });
    setApprovedPlanSnapshot(snapshot);
  }

  return {
    approvedPlanSnapshot,
    approvePlan,
    isHydratingApprovedPlan,
  };
}
