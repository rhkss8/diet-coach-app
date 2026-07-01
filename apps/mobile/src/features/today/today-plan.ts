import type { AiPlan, AiPlanItem } from "@diet-coach/ai";
import type { AnalyticsEventName, PlanItemStatus } from "@diet-coach/core";

export function getTodayPlanDate(plan: AiPlan) {
  return plan.items[0]?.date ?? plan.startDate;
}

export function getPlanDates(plan: AiPlan) {
  const dates = plan.items.map((planItem) => planItem.date);
  const uniqueDates = Array.from(new Set(dates.length > 0 ? dates : [plan.startDate]));

  return uniqueDates.sort();
}

export function getWeekCalendarDates(selectedDate: string) {
  const date = parseDateKey(selectedDate);
  const weekStart = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  weekStart.setUTCDate(weekStart.getUTCDate() - weekStart.getUTCDay());

  return Array.from({ length: 7 }, (_, index) => addDaysToDateKey(formatDateKey(weekStart), index));
}

export function getMonthCalendarDates(selectedDate: string) {
  const date = parseDateKey(selectedDate);
  const monthStart = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
  const calendarStart = new Date(monthStart);
  calendarStart.setUTCDate(calendarStart.getUTCDate() - calendarStart.getUTCDay());

  const monthEnd = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
  const calendarEnd = new Date(monthEnd);
  calendarEnd.setUTCDate(calendarEnd.getUTCDate() + (6 - calendarEnd.getUTCDay()));

  const dates: string[] = [];
  const cursor = new Date(calendarStart);

  while (cursor <= calendarEnd) {
    dates.push(formatDateKey(cursor));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

export function getDateMonthKey(date: string) {
  return date.slice(0, 7);
}

export function getInitialSelectedPlanDate(plan: AiPlan, todayDate = getSystemTodayDate()) {
  const planDates = getPlanDates(plan);

  return planDates.includes(todayDate) ? todayDate : getTodayPlanDate(plan);
}

export function getPlanItemsForDate(plan: AiPlan, date: string) {
  return plan.items.filter((planItem) => planItem.date === date);
}

export function getTodayPlanItems(plan: AiPlan) {
  const todayPlanDate = getTodayPlanDate(plan);

  return getPlanItemsForDate(plan, todayPlanDate);
}

export function updatePlanItemStatus(
  plan: AiPlan,
  planItemId: string,
  status: PlanItemStatus,
): AiPlan {
  return {
    ...plan,
    items: plan.items.map((planItem) =>
      planItem.id === planItemId
        ? {
            ...planItem,
            status,
          }
        : planItem,
    ),
  };
}

export function getPlanDateCursor(plan: AiPlan, selectedDate: string) {
  const planDates = getPlanDates(plan);
  const selectedIndex = Math.max(0, planDates.indexOf(selectedDate));

  return {
    nextDate: planDates[selectedIndex + 1],
    previousDate: planDates[selectedIndex - 1],
    selectedIndex,
    totalCount: planDates.length,
  };
}

export function getPlanDateRelation(date: string, todayDate = getSystemTodayDate()) {
  if (date === todayDate) {
    return "today";
  }

  return date < todayDate ? "past" : "future";
}

export function getPlanDateRelationLabel(date: string, todayDate = getSystemTodayDate()) {
  const relation = getPlanDateRelation(date, todayDate);

  if (relation === "today") {
    return "오늘";
  }

  return relation === "past" ? "지난 플랜" : "예정 플랜";
}

export function canUpdatePlanItemStatusForDate(date: string, todayDate = getSystemTodayDate()) {
  return getPlanDateRelation(date, todayDate) !== "future";
}

export function countPendingTodayItems(planItems: AiPlanItem[]) {
  return planItems.filter((planItem) => planItem.status !== "completed").length;
}

export function groupTodayPlanItemsByType(planItems: AiPlanItem[]) {
  return {
    exercises: planItems.filter((planItem) => planItem.type === "exercise"),
    meals: planItems.filter((planItem) => planItem.type === "meal"),
  };
}

export function updateTodayPlanItemStatus(
  planItems: AiPlanItem[],
  planItemId: string,
  status: PlanItemStatus,
) {
  return planItems.map((planItem) =>
    planItem.id === planItemId
      ? {
          ...planItem,
          status,
        }
      : planItem,
  );
}

export function getDailyProgressSummary(planItems: AiPlanItem[]) {
  const totalCount = planItems.length;
  const completedCount = planItems.filter((planItem) => planItem.status === "completed").length;
  const skippedCount = planItems.filter((planItem) => planItem.status === "skipped").length;
  const pendingCount = totalCount - completedCount - skippedCount;

  return {
    completedCount,
    completionRate: totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100),
    pendingCount,
    skippedCount,
    totalCount,
  };
}

export function getPlanItemStatusEventName(status: PlanItemStatus): AnalyticsEventName | null {
  if (status === "completed") {
    return "PLAN_ITEM_COMPLETED";
  }

  if (status === "skipped") {
    return "PLAN_ITEM_SKIPPED";
  }

  return null;
}

export function shouldTrackPlanItemCompletedAfterRevision(
  planItemId: string,
  status: PlanItemStatus,
  revisedPlanItemIds: string[] | undefined,
) {
  return status === "completed" && Boolean(revisedPlanItemIds?.includes(planItemId));
}

function getSystemTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function addDaysToDateKey(date: string, days: number) {
  const parsedDate = parseDateKey(date);
  parsedDate.setUTCDate(parsedDate.getUTCDate() + days);

  return formatDateKey(parsedDate);
}

function parseDateKey(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day));
}

function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}
