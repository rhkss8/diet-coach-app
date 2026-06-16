import type {
  AdjustmentReason,
  AdjustmentRequest,
  EntityId,
  GoalInput,
  ISODate,
  PlanItemIntensity,
  PlanItemSlot,
  PlanItemStatus,
  PlanItemType,
  UserProfileInput,
} from "@diet-coach/core";

export type LifestylePace = "fast_3_months" | "steady_6_months" | "consistency_first";
export type LifestyleHardestPart = "meal" | "exercise" | "both";
export type LifestyleExerciseExperience = "none" | "some" | "consistent";

export type LifestyleAnswers = {
  pace: LifestylePace;
  hardestPart: LifestyleHardestPart;
  exerciseExperience: LifestyleExerciseExperience;
};

export type AiPlanItem = {
  id?: EntityId;
  planId?: EntityId;
  date: ISODate;
  type: PlanItemType;
  slot: PlanItemSlot;
  title: string;
  description: string;
  intensity?: PlanItemIntensity;
  status?: PlanItemStatus;
};

export type AiPlan = {
  id?: EntityId;
  goalId: EntityId;
  startDate: ISODate;
  endDate: ISODate;
  summary: string;
  items: AiPlanItem[];
};

export type GenerateInitialPlanInput = {
  profile: UserProfileInput;
  goal: GoalInput;
  lifestyleAnswers: LifestyleAnswers;
};

export type GenerateInitialPlanOutput = {
  plan: AiPlan;
  rationale: string;
  userMessage: string;
  adjustmentNotes: string[];
};

export type AdjustTodayPlanInput = {
  currentPlan: AiPlan;
  todayItems: AiPlanItem[];
  completedItemIds: EntityId[];
  request: Omit<AdjustmentRequest, "id" | "createdAt">;
  foodContext?: {
    text?: string;
    interpretedFoodName?: string;
    interpretedPortion?: string;
  };
};

export type AdjustTodayPlanOutput = {
  revision: {
    planId: EntityId;
    affectedDate: ISODate;
    reason: AdjustmentReason;
    summary: string;
    userMessage: string;
    changedItemIds: EntityId[];
    updatedTodayItems: AiPlanItem[];
    updatedFutureItems?: AiPlanItem[];
  };
};

export type SummarizeProgressInput = {
  weekStartDate: ISODate;
  completedItemCount: number;
  skippedItemCount: number;
  revisionCount: number;
  recentCheckInNotes: string[];
};

export type SummarizeProgressOutput = {
  summary: string;
  suggestion: string;
};

export type AiValidationResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      errors: string[];
    };
