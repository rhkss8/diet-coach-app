import { useEffect, useState } from "react";
import { Dumbbell, Utensils } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { AiPlan, AiPlanItem } from "@diet-coach/ai";
import type { PlanItemStatus } from "@diet-coach/core";

import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import { theme } from "../../shared/ui/design-system";
import {
  BackButton,
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
  getDailyProgressSummary,
  getInitialSelectedPlanDate,
  getPlanDateCursor,
  getPlanDateRelation,
  getPlanDateRelationLabel,
  getPlanItemStatusEventName,
  getPlanItemsForDate,
  groupTodayPlanItemsByType,
  shouldTrackPlanItemCompletedAfterRevision,
  updatePlanItemStatus as updatePlanItemStatusInPlan,
} from "./today-plan";

type TodayScreenProps = {
  onAdjustToday: () => void;
  onOpenConsultation: () => void;
  onOpenSettings: () => void;
  onPlanChange: (plan: AiPlan) => Promise<void>;
  plan: AiPlan;
  revisionContext?: {
    revisedPlanItemIds: string[];
    revisionId: string;
  };
};

/**
 * Renders the approved plan as the Figma Make continuation board for the current day.
 *
 * Business logic stays in the today-plan helpers; this component focuses on translating plan state
 * into reusable planner UI primitives.
 */
export function TodayScreen({
  onAdjustToday,
  onOpenConsultation,
  onOpenSettings,
  onPlanChange,
  plan,
  revisionContext,
}: TodayScreenProps) {
  const [selectedDate, setSelectedDate] = useState(() => getInitialSelectedPlanDate(plan));
  const selectedDateItems = sortTodayItems(getPlanItemsForDate(plan, selectedDate));
  const progressSummary = getDailyProgressSummary(selectedDateItems);
  const { exercises, meals } = groupTodayPlanItemsByType(selectedDateItems);
  const dateCursor = getPlanDateCursor(plan, selectedDate);
  const selectedDateRelation = getPlanDateRelation(selectedDate);
  const selectedDateRelationLabel = getPlanDateRelationLabel(selectedDate);
  const canAdjustSelectedDate = selectedDateRelation === "today";

  useEffect(() => {
    trackAnalyticsEvent("TODAY_SCREEN_VIEWED", {
      userId: "local-user",
      goalId: plan.goalId,
      planId: plan.id ?? "local-plan",
    });
  }, [plan.goalId, plan.id]);

  function updatePlanItemStatus(planItemId: string, status: PlanItemStatus) {
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

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} style={styles.scroller}>
        <View style={styles.headerBlock}>
          <View style={styles.compactHeader}>
            <BackButton onLongPress={onOpenSettings} onPress={onOpenConsultation} />
            <CompactBrandMark />
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.dateText}>{formatTodayDate(selectedDate)}</Text>
            <Text style={styles.title}>{getPlanTitle(selectedDateRelation)}</Text>
          </View>

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
        </View>

        <TodayPlanSection items={meals} onStatusChange={updatePlanItemStatus} title="식단" />
        <TodayPlanSection items={exercises} onStatusChange={updatePlanItemStatus} title="운동" />
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
  items,
  onStatusChange,
  title,
}: {
  items: AiPlanItem[];
  onStatusChange: (planItemId: string, status: PlanItemStatus) => void;
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
              isCompleted={isCompleted}
              isSkipped={isSkipped}
              key={planItemId}
              nutritionSummary={getPlanItemNutritionSummary(planItem)}
              onComplete={() => onStatusChange(planItemId, isCompleted ? "pending" : "completed")}
              onSkip={() => onStatusChange(planItemId, "skipped")}
              title={`${getSlotLabel(planItem.slot)} · ${planItem.title}`}
            />
          );
        })}
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

function getPlanTitle(relation: ReturnType<typeof getPlanDateRelation>) {
  if (relation === "today") {
    return "오늘 플랜은\n아직 살아 있어요.";
  }

  if (relation === "past") {
    return "지난 플랜도\n기록으로 남아 있어요.";
  }

  return "다가올 플랜을\n미리 볼 수 있어요.";
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
  heroCopy: {
    gap: 4,
    paddingTop: theme.space.sm,
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
});
