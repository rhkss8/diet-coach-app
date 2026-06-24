import { useEffect, useState } from "react";

import type { SupabaseClient } from "@supabase/supabase-js";

import { getMobileSupabaseClient } from "../../shared/lib/supabase";
import type { PlanBasis } from "./plan-basis";
import { loadLocalPlanBasis, loadPlanBasis, savePlanBasis } from "./plan-basis-storage";

type PlanBasisPersistenceOptions = {
  supabaseClient?: SupabaseClient | null;
  userId?: string;
};

export function usePlanBasisPersistence({
  supabaseClient = getMobileSupabaseClient(),
  userId,
}: PlanBasisPersistenceOptions = {}) {
  const [planBasis, setPlanBasis] = useState<PlanBasis | null>(null);
  const [isHydratingPlanBasis, setIsHydratingPlanBasis] = useState(true);

  useEffect(() => {
    let isMounted = true;

    loadPlanBasisForUser(supabaseClient, userId)
      .then((loadedPlanBasis) => {
        if (isMounted) {
          setPlanBasis(loadedPlanBasis);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsHydratingPlanBasis(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [supabaseClient, userId]);

  async function persistPlanBasis(nextPlanBasis: PlanBasis) {
    await savePlanBasis(nextPlanBasis, { supabaseClient, userId });
    setPlanBasis(nextPlanBasis);
  }

  return {
    isHydratingPlanBasis,
    persistPlanBasis,
    planBasis,
  };
}

async function loadPlanBasisForUser(
  supabaseClient: SupabaseClient | null,
  userId: string | undefined,
) {
  if (!supabaseClient || !userId) {
    return loadPlanBasis();
  }

  const remotePlanBasis = await loadPlanBasis({ supabaseClient, userId });

  if (remotePlanBasis) {
    return remotePlanBasis;
  }

  const localPlanBasis = await loadLocalPlanBasis();

  if (localPlanBasis) {
    await savePlanBasis(localPlanBasis, { supabaseClient, userId });
  }

  return localPlanBasis;
}
