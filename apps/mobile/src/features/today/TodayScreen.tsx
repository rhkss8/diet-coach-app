import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { AiPlan, AiPlanItem } from "@diet-coach/ai";
import type { PlanItemStatus } from "@diet-coach/core";

import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import { theme } from "../../shared/ui/design-system";
import {
  AppHeader,
  BottomActionPanel,
  HeaderAction,
  PlannerItemCard,
  PlannerProgress,
  SectionHeader,
} from "../../shared/ui/planner-components";
import {
  getDailyProgressSummary,
  getPlanItemStatusEventName,
  getTodayPlanDate,
  getTodayPlanItems,
  groupTodayPlanItemsByType,
  shouldTrackPlanItemCompletedAfterRevision,
  updateTodayPlanItemStatus,
} from "./today-plan";

type TodayScreenProps = {
  onAdjustToday: () => void;
  onOpenConsultation: () => void;
  onOpenSettings: () => void;
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
  plan,
  revisionContext,
}: TodayScreenProps) {
  const todayPlanDate = getTodayPlanDate(plan);
  const [todayItems, setTodayItems] = useState(() => getTodayPlanItems(plan));
  const progressSummary = getDailyProgressSummary(todayItems);
  const { exercises, meals } = groupTodayPlanItemsByType(todayItems);

  useEffect(() => {
    trackAnalyticsEvent("TODAY_SCREEN_VIEWED", {
      userId: "local-user",
      goalId: plan.goalId,
      planId: plan.id ?? "local-plan",
    });
  }, [plan.goalId, plan.id]);

  function updatePlanItemStatus(planItemId: string, status: PlanItemStatus) {
    const planItem = todayItems.find((currentItem) => currentItem.id === planItemId);
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

    setTodayItems((currentItems) => updateTodayPlanItemStatus(currentItems, planItemId, status));
  }

  function startAdjustment() {
    trackAnalyticsEvent("ADJUST_TODAY_CLICKED", {
      userId: "local-user",
      planId: plan.id ?? "local-plan",
      affectedDate: todayPlanDate,
    });
    onAdjustToday();
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} style={styles.scroller}>
        <View style={styles.headerBlock}>
          <AppHeader
            actions={
              <>
                <HeaderAction label="AI 상담" onPress={onOpenConsultation} />
                <HeaderAction label="설정" onPress={onOpenSettings} />
              </>
            }
            kicker="TARS"
          />

          <View style={styles.heroCopy}>
            <Text style={styles.dateText}>{formatTodayDate(todayPlanDate)}</Text>
            <Text style={styles.title}>오늘 플랜은{"\n"}아직 살아 있어요.</Text>
            <Text style={styles.summaryText}>{plan.summary}</Text>
          </View>

          <PlannerProgress
            completedCount={progressSummary.completedCount}
            completionRate={progressSummary.completionRate}
            totalCount={todayItems.length}
          />
        </View>

        <TodayPlanSection items={meals} onStatusChange={updatePlanItemStatus} title="식단" />
        <TodayPlanSection items={exercises} onStatusChange={updatePlanItemStatus} title="운동" />
      </ScrollView>

      <BottomActionPanel
        helperText="회식, 야근, 또는 다른 상황이 생겼나요?"
        label="오늘 계획 조정하기"
        onPress={startAdjustment}
      />
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
  return (
    <View style={styles.section}>
      <SectionHeader label={title} />
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
              isCompleted={isCompleted}
              isSkipped={isSkipped}
              key={planItemId}
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

function getPlanItemDetail(planItem: AiPlanItem) {
  const intensityLabel = planItem.intensity ? ` · ${getIntensityLabel(planItem.intensity)}` : "";

  return `${planItem.description}${intensityLabel}`;
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

function getIntensityLabel(intensity: string) {
  const labels: Record<string, string> = {
    light: "가볍게",
    moderate: "보통",
    hard: "강하게",
  };

  return labels[intensity] ?? intensity;
}

function formatTodayDate(date: string) {
  return date.replaceAll("-", ".");
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
    gap: theme.space.xl,
    paddingBottom: theme.space.xl,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.lg,
  },
  headerBlock: {
    gap: theme.space.lg,
  },
  heroCopy: {
    gap: theme.space.xs,
    paddingTop: theme.space.xs,
  },
  dateText: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
  },
  title: {
    ...theme.type.title,
    color: theme.colors.ink,
  },
  summaryText: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "300",
    lineHeight: 20,
    maxWidth: 310,
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
