import { useEffect, useState } from "react";
import { Dumbbell, Utensils } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { AiPlan, AiPlanItem } from "@diet-coach/ai";
import type { PlanItemStatus } from "@diet-coach/core";

import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import { theme } from "../../shared/ui/design-system";
import {
  BottomActionPanel,
  CompactBrandMark,
  PlannerItemCard,
  PlannerProgress,
  SectionHeader,
} from "../../shared/ui/planner-components";
import {
  getPlanItemDetail,
  getPlanItemFoodLines,
  getPlanItemNutritionSummary,
} from "../plan/plan-item-display";
import {
  canUpdatePlanItemStatusForDate,
  getDailyProgressSummary,
  getDateMonthKey,
  getInitialSelectedPlanDate,
  getMonthCalendarDates,
  getPlanDateCursor,
  getPlanDateRelation,
  getPlanDateRelationLabel,
  getPlanDates,
  getPlanItemStatusEventName,
  getPlanItemsForDate,
  getWeekCalendarDates,
  groupTodayPlanItemsByType,
  shouldTrackPlanItemCompletedAfterRevision,
  updatePlanItemStatus as updatePlanItemStatusInPlan,
} from "./today-plan";

type TodayScreenProps = {
  onAdjustToday: () => void;
  onPlanChange: (plan: AiPlan) => Promise<void>;
  plan: AiPlan;
  revisionContext?: {
    revisedPlanItemIds: string[];
    revisionId: string;
  };
};

type PlanViewMode = "day" | "week" | "month";

const planViewModeOptions = [
  { label: "일간", value: "day" },
  { label: "주간", value: "week" },
  { label: "월간", value: "month" },
] satisfies Array<{ label: string; value: PlanViewMode }>;

/**
 * Renders the approved plan as the Figma Make continuation board for the current day.
 *
 * Business logic stays in the today-plan helpers; this component focuses on translating plan state
 * into reusable planner UI primitives.
 */
export function TodayScreen({
  onAdjustToday,
  onPlanChange,
  plan,
  revisionContext,
}: TodayScreenProps) {
  const [selectedDate, setSelectedDate] = useState(() => getInitialSelectedPlanDate(plan));
  const [viewMode, setViewMode] = useState<PlanViewMode>("day");
  const planDates = getPlanDates(plan);
  const selectedDateItems = sortTodayItems(getPlanItemsForDate(plan, selectedDate));
  const progressSummary = getDailyProgressSummary(selectedDateItems);
  const { exercises, meals } = groupTodayPlanItemsByType(selectedDateItems);
  const dateCursor = getPlanDateCursor(plan, selectedDate);
  const selectedDateRelation = getPlanDateRelation(selectedDate);
  const selectedDateRelationLabel = getPlanDateRelationLabel(selectedDate);
  const canAdjustSelectedDate = selectedDateRelation === "today";
  const canUpdateSelectedDate = canUpdatePlanItemStatusForDate(selectedDate);

  useEffect(() => {
    trackAnalyticsEvent("TODAY_SCREEN_VIEWED", {
      userId: "local-user",
      goalId: plan.goalId,
      planId: plan.id ?? "local-plan",
    });
  }, [plan.goalId, plan.id]);

  function updatePlanItemStatus(planItemId: string, status: PlanItemStatus) {
    if (!canUpdateSelectedDate) {
      return;
    }

    const planItem = selectedDateItems.find((currentItem) => currentItem.id === planItemId);
    const eventName = getPlanItemStatusEventName(status);

    if (planItem && eventName) {
      trackAnalyticsEvent(eventName, {
        userId: "local-user",
        goalId: plan.goalId,
        planId: plan.id ?? "local-plan",
        planItemId,
        type: planItem.type,
        date: planItem.date,
      });

      const completedAfterRevisionId = shouldTrackPlanItemCompletedAfterRevision(
        planItemId,
        status,
        revisionContext?.revisedPlanItemIds,
      )
        ? revisionContext?.revisionId
        : undefined;

      if (completedAfterRevisionId) {
        trackAnalyticsEvent("PLAN_ITEM_COMPLETED_AFTER_REVISION", {
          userId: "local-user",
          goalId: plan.goalId,
          planId: plan.id ?? "local-plan",
          planItemId,
          type: planItem.type,
          date: planItem.date,
          revisionId: completedAfterRevisionId,
        });
      }
    }

    void onPlanChange(updatePlanItemStatusInPlan(plan, planItemId, status));
  }

  function startAdjustment() {
    trackAnalyticsEvent("ADJUST_TODAY_CLICKED", {
      userId: "local-user",
      planId: plan.id ?? "local-plan",
      affectedDate: selectedDate,
    });
    onAdjustToday();
  }

  function goToPreviousDate() {
    if (dateCursor.previousDate) {
      setSelectedDate(dateCursor.previousDate);
    }
  }

  function goToNextDate() {
    if (dateCursor.nextDate) {
      setSelectedDate(dateCursor.nextDate);
    }
  }

  function selectDate(date: string) {
    setSelectedDate(date);
  }

  function openDateDetail(date: string) {
    setSelectedDate(date);

    if (viewMode !== "day") {
      setViewMode("day");
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} style={styles.scroller}>
        <View style={styles.headerBlock}>
          <View style={styles.compactHeader}>
            <Text style={styles.headerLabel}>플랜</Text>
            <CompactBrandMark />
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.dateText}>{formatTodayDate(selectedDate)}</Text>
            <Text style={styles.title}>{getPlanTitle(selectedDateRelation, viewMode)}</Text>
          </View>

          <PlanViewModeSwitch mode={viewMode} onChange={setViewMode} />

          {viewMode === "day" ? (
            <>
              <DateRail dates={planDates} onSelectDate={selectDate} selectedDate={selectedDate} />

              <View style={styles.dateSwitcher}>
                <Pressable
                  accessibilityRole="button"
                  disabled={!dateCursor.previousDate}
                  onPress={goToPreviousDate}
                  style={[styles.dateButton, !dateCursor.previousDate && styles.dateButtonDisabled]}
                >
                  <Text style={styles.dateButtonText}>이전</Text>
                </Pressable>
                <View style={styles.datePill}>
                  <Text style={styles.datePillLabel}>{selectedDateRelationLabel}</Text>
                  <Text style={styles.datePillCount}>
                    {dateCursor.selectedIndex + 1}/{dateCursor.totalCount}
                  </Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  disabled={!dateCursor.nextDate}
                  onPress={goToNextDate}
                  style={[styles.dateButton, !dateCursor.nextDate && styles.dateButtonDisabled]}
                >
                  <Text style={styles.dateButtonText}>다음</Text>
                </Pressable>
              </View>

              <PlannerProgress
                completedCount={progressSummary.completedCount}
                completionRate={progressSummary.completionRate}
                totalCount={selectedDateItems.length}
              />
            </>
          ) : null}
        </View>

        {viewMode === "day" ? (
          <>
            <TodayPlanSection
              canUpdateStatus={canUpdateSelectedDate}
              items={meals}
              onStatusChange={updatePlanItemStatus}
              statusLabel={selectedDateRelation === "future" ? "예정" : undefined}
              title="식단"
            />
            <TodayPlanSection
              canUpdateStatus={canUpdateSelectedDate}
              items={exercises}
              onStatusChange={updatePlanItemStatus}
              statusLabel={selectedDateRelation === "future" ? "예정" : undefined}
              title="운동"
            />
          </>
        ) : (
          <PlanCalendarView
            dates={planDates}
            mode={viewMode}
            onOpenDateDetail={openDateDetail}
            onSelectDate={selectDate}
            plan={plan}
            selectedDate={selectedDate}
          />
        )}
      </ScrollView>

      {canAdjustSelectedDate ? (
        <BottomActionPanel
          helperText="회식, 야근, 또는 다른 상황이 생겼나요?"
          label="오늘 계획 조정하기"
          onPress={startAdjustment}
        />
      ) : null}
    </View>
  );
}

function TodayPlanSection({
  canUpdateStatus,
  items,
  onStatusChange,
  statusLabel,
  title,
}: {
  canUpdateStatus: boolean;
  items: AiPlanItem[];
  onStatusChange: (planItemId: string, status: PlanItemStatus) => void;
  statusLabel?: string;
  title: string;
}) {
  const sectionIcon = title === "식단" ? Utensils : Dumbbell;

  return (
    <View style={styles.section}>
      <SectionHeader icon={sectionIcon} label={title} />
      <View style={styles.itemList}>
        {items.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>오늘 등록된 항목이 없어요.</Text>
          </View>
        ) : null}
        {items.map((planItem) => {
          const planItemId = planItem.id ?? `${planItem.date}-${planItem.slot}`;
          const isCompleted = planItem.status === "completed";
          const isSkipped = planItem.status === "skipped";

          return (
            <PlannerItemCard
              detail={getPlanItemDetail(planItem)}
              foodLines={getPlanItemFoodLines(planItem)}
              isActionable={canUpdateStatus}
              isCompleted={isCompleted}
              isSkipped={isSkipped}
              key={planItemId}
              nutritionSummary={getPlanItemNutritionSummary(planItem)}
              onComplete={() => onStatusChange(planItemId, isCompleted ? "pending" : "completed")}
              onSkip={() => onStatusChange(planItemId, "skipped")}
              statusLabel={statusLabel}
              title={`${getSlotLabel(planItem.slot)} · ${planItem.title}`}
            />
          );
        })}
      </View>
    </View>
  );
}

function PlanViewModeSwitch({
  mode,
  onChange,
}: {
  mode: PlanViewMode;
  onChange: (mode: PlanViewMode) => void;
}) {
  return (
    <View style={styles.viewModeSwitch}>
      {planViewModeOptions.map((option) => {
        const isSelected = option.value === mode;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.viewModeButton, isSelected && styles.selectedViewModeButton]}
          >
            <Text style={[styles.viewModeText, isSelected && styles.selectedViewModeText]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function DateRail({
  dates,
  onSelectDate,
  selectedDate,
}: {
  dates: string[];
  onSelectDate: (date: string) => void;
  selectedDate: string;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.dateRail}
      contentContainerStyle={styles.dateRailContent}
    >
      {dates.map((date) => {
        const isSelected = date === selectedDate;
        const relation = getPlanDateRelation(date);
        const label = getCompactDateLabel(date);

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={date}
            onPress={() => onSelectDate(date)}
            style={[styles.dateChip, isSelected && styles.selectedDateChip]}
          >
            <Text style={[styles.dateChipDay, isSelected && styles.selectedDateChipText]}>
              {label.day}
            </Text>
            <Text style={[styles.dateChipMeta, isSelected && styles.selectedDateChipText]}>
              {relation === "today" ? "오늘" : label.weekday}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function PlanCalendarView({
  dates,
  mode,
  onOpenDateDetail,
  onSelectDate,
  plan,
  selectedDate,
}: {
  dates: string[];
  mode: PlanViewMode;
  onOpenDateDetail: (date: string) => void;
  onSelectDate: (date: string) => void;
  plan: AiPlan;
  selectedDate: string;
}) {
  const planDateSet = new Set(dates);
  const visibleDates =
    mode === "week" ? getWeekCalendarDates(selectedDate) : getMonthCalendarDates(selectedDate);
  const selectedMonthKey = getDateMonthKey(selectedDate);
  const selectedItems = getPlanItemsForDate(plan, selectedDate);
  const selectedSummary = getDailyProgressSummary(selectedItems);
  const selectedMeals = selectedItems.filter((item) => item.type === "meal").length;
  const selectedExercises = selectedItems.filter((item) => item.type === "exercise").length;

  return (
    <View style={styles.section}>
      <SectionHeader label={mode === "week" ? "주간 플랜" : "월간 플랜"} />
      <View style={styles.calendarPanel}>
        <View style={styles.calendarHeader}>
          <View>
            <Text style={styles.calendarEyebrow}>
              {mode === "week" ? "이번 주 흐름" : "월간 흐름"}
            </Text>
            <Text style={styles.calendarTitle}>{formatCalendarTitle(selectedDate, mode)}</Text>
          </View>
          <Text style={styles.calendarCounter}>{dates.length}일 플랜</Text>
        </View>
        <View style={styles.weekdayHeader}>
          {["일", "월", "화", "수", "목", "금", "토"].map((weekday) => (
            <Text key={weekday} style={styles.weekdayText}>
              {weekday}
            </Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>
          {visibleDates.map((date) => {
            const hasPlan = planDateSet.has(date);
            const isSelected = date === selectedDate;
            const isCurrentMonth = getDateMonthKey(date) === selectedMonthKey;
            const relation = getPlanDateRelation(date);
            const items = hasPlan ? getPlanItemsForDate(plan, date) : [];
            const summary = getDailyProgressSummary(items);

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: !hasPlan, selected: isSelected }}
                disabled={!hasPlan}
                key={date}
                onPress={() => onSelectDate(date)}
                style={[
                  styles.calendarCell,
                  isSelected && styles.selectedCalendarCell,
                  !isCurrentMonth && styles.outsideMonthCalendarCell,
                  !hasPlan && styles.emptyCalendarCell,
                ]}
              >
                <Text
                  style={[
                    styles.calendarDay,
                    isSelected && styles.selectedCalendarDay,
                    !isCurrentMonth && styles.outsideMonthText,
                    !hasPlan && styles.emptyCalendarText,
                  ]}
                >
                  {getDayOfMonth(date)}
                </Text>
                {hasPlan ? (
                  <View style={styles.calendarCellBody}>
                    {relation === "today" ? (
                      <Text
                        style={[styles.todayDotLabel, isSelected && styles.selectedCalendarText]}
                      >
                        오늘
                      </Text>
                    ) : null}
                    <View style={styles.calendarDotRow}>
                      <View
                        style={[
                          styles.calendarStatusDot,
                          summary.completedCount > 0 && styles.completedStatusDot,
                          relation === "future" && styles.futureStatusDot,
                        ]}
                      />
                      <View
                        style={[
                          styles.calendarStatusDot,
                          summary.pendingCount > 0 && styles.pendingStatusDot,
                        ]}
                      />
                    </View>
                    <View style={styles.calendarProgressTrack}>
                      <View
                        style={[
                          styles.calendarProgressFill,
                          { width: `${summary.completionRate}%` },
                        ]}
                      />
                    </View>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={styles.selectedDayPreview}>
        <View style={styles.selectedDayCopy}>
          <Text style={styles.selectedDayDate}>{formatShortDate(selectedDate)}</Text>
          <Text style={styles.selectedDayMeta}>
            {getPlanDateRelationLabel(selectedDate)} · 식단 {selectedMeals} · 운동{" "}
            {selectedExercises}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => onOpenDateDetail(selectedDate)}
          style={styles.detailButton}
        >
          <Text style={styles.detailButtonText}>일간 보기</Text>
        </Pressable>
        <View style={styles.selectedDayProgress}>
          <Text style={styles.selectedDayProgressText}>
            {selectedSummary.completedCount}/{selectedSummary.totalCount}
          </Text>
          <View style={styles.selectedDayProgressTrack}>
            <View
              style={[
                styles.selectedDayProgressFill,
                { width: `${selectedSummary.completionRate}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function sortTodayItems(items: AiPlanItem[]) {
  return [...items].sort((left, right) => {
    return getTodayItemOrder(left) - getTodayItemOrder(right);
  });
}

function getTodayItemOrder(item: AiPlanItem) {
  if (item.type === "exercise") {
    return item.title.includes("스트레칭") ? 5 : 4;
  }

  const order: Record<string, number> = {
    breakfast: 0,
    lunch: 1,
    dinner: 2,
    snack: 3,
  };

  return order[item.slot] ?? 9;
}

function getSlotLabel(slot: string) {
  const labels: Record<string, string> = {
    breakfast: "아침",
    lunch: "점심",
    dinner: "저녁",
    snack: "간식",
    workout: "운동",
  };

  return labels[slot] ?? slot;
}

function getPlanTitle(relation: ReturnType<typeof getPlanDateRelation>, mode: PlanViewMode) {
  if (mode === "week") {
    return "이번 주 흐름을\n차분히 살펴봐요.";
  }

  if (mode === "month") {
    return "플랜의 흐름을\n월간으로 봐요.";
  }

  if (relation === "today") {
    return "오늘 플랜은\n아직 살아 있어요.";
  }

  if (relation === "past") {
    return "지난 플랜도\n기록으로 남아 있어요.";
  }

  return "다가올 플랜을\n미리 볼 수 있어요.";
}

function getCompactDateLabel(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );

  return {
    day: `${month}/${day}`,
    weekday,
  };
}

function formatShortDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );

  return `${month}월 ${day}일 ${weekday}`;
}

function formatCalendarTitle(date: string, mode: PlanViewMode) {
  const [year, month] = date.split("-").map(Number);

  if (mode === "month") {
    return `${year}년 ${month}월`;
  }

  const weekDates = getWeekCalendarDates(date);
  const firstDate = weekDates[0];
  const lastDate = weekDates[weekDates.length - 1];

  return `${formatCompactMonthDay(firstDate)} - ${formatCompactMonthDay(lastDate)}`;
}

function formatCompactMonthDay(date: string | undefined) {
  if (!date) {
    return "";
  }

  const [, month, day] = date.split("-").map(Number);

  return `${month}.${day}`;
}

function getDayOfMonth(date: string) {
  return String(Number(date.slice(8, 10)));
}

function formatTodayDate(date: string) {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Intl.DateTimeFormat("ko-KR", { weekday: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, day)),
  );

  return `${year}년 ${month}월 ${day}일 ${weekday}`;
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scroller: {
    flex: 1,
  },
  content: {
    gap: theme.space.lg,
    paddingBottom: theme.space.sm,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.sm,
  },
  headerBlock: {
    gap: theme.space.md,
  },
  compactHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 30,
  },
  headerLabel: {
    ...theme.type.eyebrow,
    color: theme.colors.muted,
  },
  heroCopy: {
    gap: 4,
    paddingTop: theme.space.sm,
  },
  viewModeSwitch: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    flexDirection: "row",
    gap: 4,
    padding: 4,
  },
  viewModeButton: {
    alignItems: "center",
    borderRadius: 6,
    flex: 1,
    minHeight: 34,
    justifyContent: "center",
  },
  selectedViewModeButton: {
    backgroundColor: theme.colors.primarySoft,
  },
  viewModeText: {
    color: theme.colors.muted,
    fontSize: 12,
    fontWeight: "800",
    lineHeight: 16,
  },
  selectedViewModeText: {
    color: theme.colors.primaryPressed,
  },
  dateRail: {
    marginHorizontal: -theme.space.xl,
  },
  dateRailContent: {
    gap: theme.space.xs,
    paddingHorizontal: theme.space.xl,
  },
  dateChip: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    minHeight: 46,
    minWidth: 58,
    justifyContent: "center",
    paddingHorizontal: theme.space.xs,
  },
  selectedDateChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dateChipDay: {
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 16,
  },
  dateChipMeta: {
    color: theme.colors.muted,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 14,
  },
  selectedDateChipText: {
    color: theme.colors.surface,
  },
  dateSwitcher: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space.xs,
  },
  dateButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: theme.space.sm,
  },
  dateButtonDisabled: {
    opacity: 0.4,
  },
  dateButtonText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  datePill: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderColor: "rgba(61, 97, 66, 0.15)",
    borderRadius: theme.radius.small,
    borderWidth: 1,
    flex: 1,
    gap: 2,
    minHeight: 38,
    justifyContent: "center",
  },
  datePillLabel: {
    color: theme.colors.primaryPressed,
    fontSize: 12,
    fontWeight: "900",
  },
  datePillCount: {
    color: theme.colors.muted,
    fontSize: 11,
    fontWeight: "700",
  },
  dateText: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: "serif",
    fontSize: 21,
    fontWeight: "400",
    lineHeight: 33,
  },
  section: {
    gap: theme.space.xs,
  },
  itemList: {
    gap: theme.space.xs,
  },
  emptyCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    padding: theme.space.md,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  calendarPanel: {
    backgroundColor: "rgba(254, 252, 248, 0.72)",
    borderColor: "rgba(42, 61, 46, 0.08)",
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: theme.space.sm,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.sm,
  },
  calendarHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.space.sm,
  },
  calendarEyebrow: {
    color: theme.colors.muted,
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 14,
  },
  calendarTitle: {
    color: theme.colors.ink,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 23,
  },
  calendarCounter: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 16,
    paddingTop: 3,
  },
  weekdayHeader: {
    flexDirection: "row",
  },
  weekdayText: {
    color: theme.colors.muted,
    flex: 1,
    fontSize: 10,
    fontWeight: "800",
    lineHeight: 14,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 6,
  },
  calendarCell: {
    alignItems: "center",
    backgroundColor: "transparent",
    gap: 2,
    minHeight: 58,
    paddingHorizontal: 2,
    paddingVertical: 3,
    width: "14.2857%",
  },
  selectedCalendarCell: {
    backgroundColor: "transparent",
  },
  outsideMonthCalendarCell: {
    opacity: 0.45,
  },
  emptyCalendarCell: {
    opacity: 0.34,
  },
  calendarDay: {
    alignItems: "center",
    borderRadius: 15,
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: "900",
    height: 30,
    lineHeight: 30,
    minWidth: 30,
    overflow: "hidden",
    textAlign: "center",
  },
  selectedCalendarText: {
    color: theme.colors.surface,
  },
  selectedCalendarDay: {
    backgroundColor: theme.colors.primary,
    color: theme.colors.surface,
  },
  outsideMonthText: {
    color: theme.colors.muted,
  },
  emptyCalendarText: {
    color: "rgba(129, 119, 104, 0.55)",
  },
  calendarCellBody: {
    alignItems: "center",
    gap: 3,
    minHeight: 19,
    width: "100%",
  },
  todayDotLabel: {
    color: theme.colors.primary,
    fontSize: 8,
    fontWeight: "900",
    lineHeight: 10,
  },
  calendarDotRow: {
    flexDirection: "row",
    gap: 3,
    minHeight: 5,
  },
  calendarStatusDot: {
    backgroundColor: "rgba(129, 119, 104, 0.24)",
    borderRadius: 3,
    height: 5,
    width: 5,
  },
  completedStatusDot: {
    backgroundColor: theme.colors.primary,
  },
  pendingStatusDot: {
    backgroundColor: "rgba(61, 97, 66, 0.34)",
  },
  futureStatusDot: {
    backgroundColor: "rgba(61, 97, 66, 0.18)",
  },
  calendarProgressTrack: {
    backgroundColor: "rgba(61, 97, 66, 0.08)",
    borderRadius: 999,
    height: 3,
    overflow: "hidden",
    width: 24,
  },
  calendarProgressFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    height: 3,
  },
  selectedDayPreview: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: "rgba(42, 61, 46, 0.08)",
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.space.sm,
    minHeight: 68,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  selectedDayCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  selectedDayDate: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "900",
    lineHeight: 18,
  },
  selectedDayMeta: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 15,
  },
  detailButton: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.small,
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: theme.space.sm,
  },
  detailButtonText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "900",
    lineHeight: 15,
  },
  selectedDayProgress: {
    alignItems: "flex-end",
    gap: 4,
    minWidth: 38,
  },
  selectedDayProgressText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: "900",
    lineHeight: 16,
  },
  selectedDayProgressTrack: {
    backgroundColor: "rgba(61, 97, 66, 0.1)",
    borderRadius: 999,
    height: 4,
    overflow: "hidden",
    width: 38,
  },
  selectedDayProgressFill: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    height: 4,
  },
});
