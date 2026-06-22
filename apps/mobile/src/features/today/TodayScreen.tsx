import { useEffect, useState } from "react";
import { Dumbbell, Utensils } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

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
  const [todayItems, setTodayItems] = useState(() =>
    ensureReferenceTodayBoardItems(getTodayPlanItems(plan), todayPlanDate),
  );
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
          <View style={styles.compactHeader}>
            <BackButton onLongPress={onOpenSettings} onPress={onOpenConsultation} />
            <CompactBrandMark />
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.dateText}>{formatTodayDate(todayPlanDate)}</Text>
            <Text style={styles.title}>오늘 플랜은{"\n"}아직 살아 있어요.</Text>
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

/**
 * Backfills sparse legacy/demo plans so the main board keeps the Figma Make six-item structure.
 */
function ensureReferenceTodayBoardItems(items: AiPlanItem[], todayDate: string) {
  if (items.length >= 6) {
    return sortTodayItems(items);
  }

  if (items.length < 4) {
    return createReferenceTodayItems(todayDate);
  }

  const itemBySlot = new Map(items.map((item) => [getReferenceMergeKey(item), item]));
  const referenceItems = createReferenceTodayItems(todayDate).map((referenceItem) => {
    return itemBySlot.get(getReferenceMergeKey(referenceItem)) ?? referenceItem;
  });
  const referenceIds = new Set(referenceItems.map((item) => item.id));
  const extraItems = items.filter((item) => item.id && !referenceIds.has(item.id));

  return sortTodayItems([...referenceItems, ...extraItems]);
}

function createReferenceTodayItems(todayDate: string): AiPlanItem[] {
  return [
    {
      id: `reference-${todayDate}-breakfast`,
      date: todayDate,
      type: "meal",
      slot: "breakfast",
      title: "귀리볼 + 삶은 계란",
      description: "오전 8시 · 약 380kcal",
      status: "completed",
    },
    {
      id: `reference-${todayDate}-lunch`,
      date: todayDate,
      type: "meal",
      slot: "lunch",
      title: "닭가슴살 샐러드",
      description: "오후 12시 30분 · 약 420kcal",
      status: "completed",
    },
    {
      id: `reference-${todayDate}-dinner`,
      date: todayDate,
      type: "meal",
      slot: "dinner",
      title: "현미밥 + 두부구이",
      description: "오후 7시 · 약 510kcal",
      status: "pending",
    },
    {
      id: `reference-${todayDate}-snack`,
      date: todayDate,
      type: "meal",
      slot: "snack",
      title: "삼각김밥 + 두유",
      description: "야근 대비 · 약 470kcal",
      status: "pending",
    },
    {
      id: `reference-${todayDate}-walk`,
      date: todayDate,
      type: "exercise",
      slot: "workout",
      title: "저녁 산책",
      description: "30분 · 약 120kcal 소모",
      intensity: "light",
      status: "pending",
    },
    {
      id: `reference-${todayDate}-stretch`,
      date: todayDate,
      type: "exercise",
      slot: "workout",
      title: "스트레칭 루틴",
      description: "10분 · 취침 전",
      intensity: "light",
      status: "pending",
    },
  ];
}

function getReferenceMergeKey(item: AiPlanItem) {
  if (item.type === "exercise") {
    return item.title.includes("스트레칭") ? "exercise-stretch" : "exercise-walk";
  }

  return `${item.type}-${item.slot}`;
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

function getPlanItemDetail(planItem: AiPlanItem) {
  return planItem.description;
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
