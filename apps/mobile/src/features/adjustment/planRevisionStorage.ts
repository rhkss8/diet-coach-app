import AsyncStorage from "@react-native-async-storage/async-storage";

import type { PlanRevisionSnapshot } from "./plan-revision-snapshot";
import {
  parsePlanRevisionSnapshots,
  serializePlanRevisionSnapshots,
} from "./plan-revision-snapshot";

const planRevisionStorageKey = "diet-coach.plan-revisions";

export async function savePlanRevisionSnapshot(snapshot: PlanRevisionSnapshot) {
  const snapshots = await loadPlanRevisionSnapshots();

  await AsyncStorage.setItem(
    planRevisionStorageKey,
    serializePlanRevisionSnapshots([...snapshots, snapshot]),
  );
}

export async function loadPlanRevisionSnapshots() {
  const storedValue = await AsyncStorage.getItem(planRevisionStorageKey);

  return storedValue ? parsePlanRevisionSnapshots(storedValue) : [];
}
