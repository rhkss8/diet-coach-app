import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { ApprovedPlanSnapshot } from "./approved-plan-snapshot";
import { parseApprovedPlanSnapshot, serializeApprovedPlanSnapshot } from "./approved-plan-snapshot";

const approvedPlanStorageKey = "diet-coach.approved-plan";

export type ApprovedPlanStorageTarget = {
  supabaseClient?: SupabaseClient | null;
  userId?: string;
};

export async function saveApprovedPlanSnapshot(
  snapshot: ApprovedPlanSnapshot,
  target: ApprovedPlanStorageTarget = {},
) {
  if (target.supabaseClient && target.userId) {
    await saveRemoteApprovedPlanSnapshot(snapshot, target.supabaseClient, target.userId);
    return;
  }

  await AsyncStorage.setItem(approvedPlanStorageKey, serializeApprovedPlanSnapshot(snapshot));
}

export async function loadApprovedPlanSnapshot(target: ApprovedPlanStorageTarget = {}) {
  if (target.supabaseClient && target.userId) {
    return loadRemoteApprovedPlanSnapshot(target.supabaseClient, target.userId);
  }

  return loadLocalApprovedPlanSnapshot();
}

export async function loadLocalApprovedPlanSnapshot() {
  const storedValue = await AsyncStorage.getItem(approvedPlanStorageKey);

  return storedValue ? parseApprovedPlanSnapshot(storedValue) : null;
}

async function saveRemoteApprovedPlanSnapshot(
  snapshot: ApprovedPlanSnapshot,
  supabaseClient: SupabaseClient,
  userId: string,
) {
  const { error } = await supabaseClient.from("approved_plan_snapshots").upsert({
    approved_at: snapshot.approvedAt,
    plan_snapshot: snapshot,
    updated_at: new Date().toISOString(),
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

async function loadRemoteApprovedPlanSnapshot(supabaseClient: SupabaseClient, userId: string) {
  const { data, error } = await supabaseClient
    .from("approved_plan_snapshots")
    .select("plan_snapshot")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data?.plan_snapshot ? parseApprovedPlanSnapshot(JSON.stringify(data.plan_snapshot)) : null;
}
