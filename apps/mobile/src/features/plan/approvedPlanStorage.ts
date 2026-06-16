import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ApprovedPlanSnapshot } from "./approved-plan-snapshot";
import { parseApprovedPlanSnapshot, serializeApprovedPlanSnapshot } from "./approved-plan-snapshot";

const approvedPlanStorageKey = "diet-coach.approved-plan";

export async function saveApprovedPlanSnapshot(snapshot: ApprovedPlanSnapshot) {
  await AsyncStorage.setItem(approvedPlanStorageKey, serializeApprovedPlanSnapshot(snapshot));
}

export async function loadApprovedPlanSnapshot() {
  const storedValue = await AsyncStorage.getItem(approvedPlanStorageKey);

  return storedValue ? parseApprovedPlanSnapshot(storedValue) : null;
}
