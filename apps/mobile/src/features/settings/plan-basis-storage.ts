import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getMobileSupabaseClient } from "../../shared/lib/supabase";
import type { PlanBasis } from "./plan-basis";

const planBasisStorageKey = "diet-coach.plan-basis";

type PlanBasisStorageTarget = {
  supabaseClient?: SupabaseClient | null;
  userId?: string;
};

export async function savePlanBasis(planBasis: PlanBasis, target: PlanBasisStorageTarget = {}) {
  if (target.supabaseClient && target.userId) {
    await saveRemotePlanBasis(planBasis, target.supabaseClient, target.userId);
    return;
  }

  await AsyncStorage.setItem(planBasisStorageKey, JSON.stringify(planBasis));
}

export async function loadPlanBasis(target: PlanBasisStorageTarget = {}) {
  if (target.supabaseClient && target.userId) {
    return loadRemotePlanBasis(target.supabaseClient, target.userId);
  }

  return loadLocalPlanBasis();
}

export async function loadLocalPlanBasis() {
  const storedValue = await AsyncStorage.getItem(planBasisStorageKey);

  return storedValue ? parsePlanBasis(storedValue) : null;
}

async function saveRemotePlanBasis(
  planBasis: PlanBasis,
  supabaseClient: SupabaseClient,
  userId: string,
) {
  const now = new Date().toISOString();

  const { error: userError } = await supabaseClient.from("users").upsert({
    age: planBasis.profile.age,
    current_weight_kg: planBasis.profile.currentWeightKg,
    height_cm: planBasis.profile.heightCm,
    id: userId,
    name: planBasis.profile.name,
    sex: planBasis.profile.sex,
    updated_at: now,
  });

  if (userError) {
    throw userError;
  }

  const { data: existingGoal, error: goalLookupError } = await supabaseClient
    .from("goals")
    .select("id")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (goalLookupError) {
    throw goalLookupError;
  }

  const goalRow = {
    start_date: getTodayDate(),
    status: "active",
    target_date: planBasis.goal.targetDate,
    target_weight_kg: planBasis.goal.targetWeightKg,
    title: "첫 플랜 목표",
    updated_at: now,
    user_id: userId,
  };

  const { error: goalSaveError } = existingGoal?.id
    ? await supabaseClient.from("goals").update(goalRow).eq("id", existingGoal.id)
    : await supabaseClient.from("goals").insert(goalRow);

  if (goalSaveError) {
    throw goalSaveError;
  }
}

async function loadRemotePlanBasis(supabaseClient: SupabaseClient, userId: string) {
  const { data: userRow, error: userError } = await supabaseClient
    .from("users")
    .select("age,current_weight_kg,height_cm,name,sex")
    .eq("id", userId)
    .maybeSingle();

  if (userError) {
    throw userError;
  }

  const { data: goalRow, error: goalError } = await supabaseClient
    .from("goals")
    .select("target_date,target_weight_kg")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (goalError) {
    throw goalError;
  }

  if (!userRow || !goalRow) {
    return null;
  }

  return parsePlanBasis(
    JSON.stringify({
      goal: {
        targetDate: goalRow.target_date ?? undefined,
        targetWeightKg: Number(goalRow.target_weight_kg),
      },
      profile: {
        age: Number(userRow.age),
        currentWeightKg: Number(userRow.current_weight_kg),
        heightCm: Number(userRow.height_cm),
        name: userRow.name ?? undefined,
        sex: userRow.sex,
      },
    }),
  );
}

function parsePlanBasis(value: string): PlanBasis | null {
  try {
    const parsed = JSON.parse(value) as PlanBasis;

    if (
      typeof parsed?.profile?.age !== "number" ||
      typeof parsed.profile.heightCm !== "number" ||
      typeof parsed.profile.currentWeightKg !== "number" ||
      typeof parsed.goal?.targetWeightKg !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function getPlanBasisSupabaseClient() {
  return getMobileSupabaseClient();
}
