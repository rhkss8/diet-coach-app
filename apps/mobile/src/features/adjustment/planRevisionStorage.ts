import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SupabaseClient } from "@supabase/supabase-js";

import type { PlanRevisionSnapshot } from "./plan-revision-snapshot";
import {
  parsePlanRevisionSnapshots,
  serializePlanRevisionSnapshots,
} from "./plan-revision-snapshot";

const planRevisionStorageKey = "diet-coach.plan-revisions";

export type PlanRevisionStorageTarget = {
  supabaseClient?: SupabaseClient | null;
  userId?: string;
};

export async function savePlanRevisionSnapshot(
  snapshot: PlanRevisionSnapshot,
  target: PlanRevisionStorageTarget = {},
) {
  if (target.supabaseClient && target.userId) {
    await saveRemotePlanRevisionSnapshot(snapshot, target.supabaseClient, target.userId);
    return;
  }

  const snapshots = await loadPlanRevisionSnapshots();

  await AsyncStorage.setItem(
    planRevisionStorageKey,
    serializePlanRevisionSnapshots([...snapshots, snapshot]),
  );
}

export async function loadPlanRevisionSnapshots(target: PlanRevisionStorageTarget = {}) {
  if (target.supabaseClient && target.userId) {
    return loadRemotePlanRevisionSnapshots(target.supabaseClient, target.userId);
  }

  const storedValue = await AsyncStorage.getItem(planRevisionStorageKey);

  return storedValue ? parsePlanRevisionSnapshots(storedValue) : [];
}

async function saveRemotePlanRevisionSnapshot(
  snapshot: PlanRevisionSnapshot,
  supabaseClient: SupabaseClient,
  userId: string,
) {
  const { error } = await supabaseClient.from("plan_revision_snapshots").upsert({
    persisted_at: snapshot.persistedAt,
    revision_id: snapshot.revisionId,
    revision_snapshot: snapshot,
    user_id: userId,
  });

  if (error) {
    throw error;
  }
}

async function loadRemotePlanRevisionSnapshots(supabaseClient: SupabaseClient, userId: string) {
  const { data, error } = await supabaseClient
    .from("plan_revision_snapshots")
    .select("revision_snapshot")
    .eq("user_id", userId)
    .order("persisted_at", { ascending: false });

  if (error) {
    throw error;
  }

  return parsePlanRevisionSnapshots(
    JSON.stringify((data ?? []).map((row) => row.revision_snapshot)),
  );
}
