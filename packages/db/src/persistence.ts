import type { DailyCheckIn, Goal, Plan, PlanRevision, User } from "@diet-coach/core";

export type SupabaseWriteClient = {
  from: (tableName: string) => SupabaseTableWriter;
};

export type SupabaseTableWriter = {
  insert: (row: unknown) => PromiseLike<SupabaseWriteResult>;
  upsert: (row: unknown) => PromiseLike<SupabaseWriteResult>;
};

export type SupabaseWriteResult = {
  error: { message: string } | null;
};

export type CoreFlowPersistenceInput = {
  checkIn?: DailyCheckIn;
  goal: Goal;
  plan: Plan;
  revisions?: PlanRevision[];
  user: User;
};

export async function persistCoreFlowSnapshot(
  client: SupabaseWriteClient,
  input: CoreFlowPersistenceInput,
) {
  await writeOrThrow(client, "users", "upsert", toUserRow(input.user));
  await writeOrThrow(client, "goals", "upsert", toGoalRow(input.goal));
  await writeOrThrow(client, "plans", "upsert", toPlanRow(input.plan));

  for (const planItem of input.plan.items) {
    await writeOrThrow(client, "plan_items", "upsert", toPlanItemRow(planItem));
  }

  for (const revision of input.revisions ?? []) {
    await writeOrThrow(client, "plan_revisions", "upsert", toPlanRevisionRow(revision));
  }

  if (input.checkIn) {
    await writeOrThrow(client, "daily_check_ins", "upsert", toDailyCheckInRow(input.checkIn));
  }
}

async function writeOrThrow(
  client: SupabaseWriteClient,
  tableName: string,
  operation: "insert" | "upsert",
  row: unknown,
) {
  const { error } = await client.from(tableName)[operation](row);

  if (error) {
    throw new Error(`${tableName} ${operation} failed: ${error.message}`);
  }
}

function toUserRow(user: User) {
  return {
    id: user.id,
    name: user.name ?? null,
    birth_date: user.birthDate ?? null,
    age: user.age ?? null,
    sex: user.sex,
    height_cm: user.heightCm,
    current_weight_kg: user.currentWeightKg,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
  };
}

function toGoalRow(goal: Goal) {
  return {
    id: goal.id,
    user_id: goal.userId,
    title: goal.title,
    start_date: goal.startDate,
    target_date: goal.targetDate,
    target_weight_kg: goal.targetWeightKg,
    status: goal.status,
    created_at: goal.createdAt,
    updated_at: goal.updatedAt,
  };
}

function toPlanRow(plan: Plan) {
  return {
    id: plan.id,
    goal_id: plan.goalId,
    start_date: plan.startDate,
    end_date: plan.endDate,
    summary: plan.summary,
    status: plan.status,
    created_at: plan.createdAt,
    updated_at: plan.updatedAt,
  };
}

function toPlanItemRow(planItem: Plan["items"][number]) {
  return {
    id: planItem.id,
    plan_id: planItem.planId,
    date: planItem.date,
    type: planItem.type,
    slot: planItem.slot,
    title: planItem.title,
    description: planItem.description,
    intensity: planItem.intensity ?? null,
    status: planItem.status,
  };
}

function toPlanRevisionRow(planRevision: PlanRevision) {
  return {
    id: planRevision.id,
    plan_id: planRevision.planId,
    request_id: planRevision.requestId ?? null,
    affected_date: planRevision.affectedDate,
    reason: planRevision.reason,
    status: planRevision.status,
    summary: planRevision.summary,
    user_message: planRevision.userMessage,
    changed_item_ids: planRevision.changedItemIds,
    updated_today_items: planRevision.updatedTodayItems,
    updated_future_items: planRevision.updatedFutureItems ?? [],
    created_at: planRevision.createdAt,
    approved_at: planRevision.approvedAt ?? null,
    dismissed_at: planRevision.dismissedAt ?? null,
  };
}

function toDailyCheckInRow(dailyCheckIn: DailyCheckIn) {
  return {
    id: dailyCheckIn.id,
    user_id: dailyCheckIn.userId,
    goal_id: dailyCheckIn.goalId,
    plan_id: dailyCheckIn.planId,
    date: dailyCheckIn.date,
    status: dailyCheckIn.status,
    completed_plan_item_ids: dailyCheckIn.completedPlanItemIds,
    skipped_plan_item_ids: dailyCheckIn.skippedPlanItemIds,
    revision_ids: dailyCheckIn.revisionIds,
    created_at: dailyCheckIn.createdAt,
    updated_at: dailyCheckIn.updatedAt,
  };
}
