import type { PlanningContext } from "@diet-coach/ai";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getMobileSupabaseClient } from "../../shared/lib/supabase";
import { toPlanningContextRow } from "./planning-context-row";

type SavePlanningContextInput = {
  context: PlanningContext;
  supabaseClient?: SupabaseClient | null;
  userId?: string;
};

export async function savePlanningContext({
  context,
  supabaseClient = getMobileSupabaseClient(),
  userId,
}: SavePlanningContextInput) {
  if (!supabaseClient || !userId) {
    return false;
  }

  const { error } = await supabaseClient
    .from("planning_contexts")
    .upsert(toPlanningContextRow(context, userId));

  return !error;
}
