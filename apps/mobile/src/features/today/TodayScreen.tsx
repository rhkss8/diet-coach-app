import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { AiPlan, AiPlanItem } from "@diet-coach/ai";
import type { PlanItemStatus } from "@diet-coach/core";

import { NotificationRecommendation } from "../notifications";
import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { commonStyles, theme } from "../../shared/ui/design-system";
import {
  countPendingTodayItems,
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
 * Renders the approved plan as a continuation board for the current day.
 *
 * This screen avoids direct planning decisions; it shows progress, lets users mark execution, and
 * sends recovery events into the adjustment flow when reality changes.
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
  const pendingItemCount = countPendingTodayItems(todayItems);
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
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.headerTop}>
          <View style={styles.datePill}>
            <Text style={styles.datePillText}>{todayPlanDate}</Text>
          </View>
          <View style={styles.headerActions}>
            <HeaderActionButton label="AI 상담" onPress={onOpenConsultation} />
            <HeaderActionButton label="설정" onPress={onOpenSettings} />
          </View>
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.eyebrow}>TODAY BOARD</Text>
          <Text style={styles.title}>오늘 플랜은 아직 살아 있어요</Text>
          <Text style={styles.description}>
            남은 항목 {pendingItemCount}개. 회식, 야근, 운동 실패가 생겨도 남은 하루 기준으로 다시
            맞추면 됩니다.
          </Text>
        </View>
        <View style={styles.recoveryStrip}>
          <Text style={styles.recoveryStripLabel}>복구 원칙</Text>
          <Text style={styles.recoveryStripText}>
            완벽하게 지키는 것보다, 끊기지 않게 이어가는 것
          </Text>
        </View>
      </View>

      <View style={styles.statusGrid}>
        <View style={styles.statusTile}>
          <Text style={styles.statusValue}>{progressSummary.completionRate}%</Text>
          <Text style={styles.statusLabel}>진행률</Text>
        </View>
        <View style={styles.statusTileWarm}>
          <Text style={styles.statusValue}>{pendingItemCount}</Text>
          <Text style={styles.statusLabel}>남은 항목</Text>
        </View>
      </View>

      <View style={styles.summaryBand}>
        <Text style={styles.summaryEyebrow}>APPROVED PLAN</Text>
        <Text style={styles.summaryTitle}>{plan.summary}</Text>
        <Text style={styles.summaryTextOnDark}>
          오늘은 식사와 운동을 합쳐 {todayItems.length}개 항목으로 이어갑니다.
        </Text>
      </View>

      <View style={styles.progressBand}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>오늘 진행률</Text>
          <Text style={styles.progressRate}>{progressSummary.completionRate}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressSummary.completionRate}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.summaryText}>
          완료 {progressSummary.completedCount}개, 건너뜀 {progressSummary.skippedCount}개, 남은
          항목 {progressSummary.pendingCount}개
        </Text>
      </View>

      <NotificationRecommendation />

      <TodayPlanSection
        accent="warm"
        items={meals}
        onStatusChange={updatePlanItemStatus}
        title="오늘 식사"
      />
      <TodayPlanSection
        accent="secondary"
        items={exercises}
        onStatusChange={updatePlanItemStatus}
        title="오늘 운동"
      />

      <View style={styles.adjustBand}>
        <Text style={styles.adjustTitle}>오늘 계획이 달라졌나요?</Text>
        <Text style={styles.summaryText}>
          회식, 야근, 운동 미실행이 생기면 남은 하루 기준으로 다시 맞출 수 있어요.
        </Text>
        <PrimaryButton label="오늘 계획 조정" onPress={startAdjustment} />
      </View>
    </ScrollView>
  );
}

function HeaderActionButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.headerActionButton}>
      <Text style={styles.headerActionButtonLabel}>{label}</Text>
    </Pressable>
  );
}

function TodayPlanSection({
  accent,
  items,
  onStatusChange,
  title,
}: {
  accent: "secondary" | "warm";
  items: AiPlanItem[];
  onStatusChange: (planItemId: string, status: PlanItemStatus) => void;
  title: string;
}) {
  const sectionAccentStyle =
    accent === "warm" ? styles.sectionTitleWarmAccent : styles.sectionTitleSecondaryAccent;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionAccent, sectionAccentStyle]} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {items.length === 0 ? (
        <View style={styles.emptySection}>
          <Text style={styles.emptySectionText}>오늘 등록된 항목이 없어요.</Text>
        </View>
      ) : null}
      {items.map((planItem) => {
        const planItemId = planItem.id ?? `${planItem.date}-${planItem.slot}`;

        return (
          <View key={planItemId} style={styles.planItem}>
            <View style={styles.planItemMetaRow}>
              <Text style={styles.planItemSlot}>{getSlotLabel(planItem.slot)}</Text>
              <Text style={styles.planItemState}>{getStatusLabel(planItem.status)}</Text>
            </View>
            <Text style={styles.planItemTitle}>{planItem.title}</Text>
            <Text style={styles.planItemDescription}>{planItem.description}</Text>
            <View style={styles.controls}>
              <StatusButton
                isSelected={planItem.status === "completed"}
                label="완료"
                onPress={() => onStatusChange(planItemId, "completed")}
              />
              <StatusButton
                isSelected={planItem.status === "skipped"}
                label="건너뜀"
                onPress={() => onStatusChange(planItemId, "skipped")}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}

function StatusButton({
  isSelected,
  label,
  onPress,
}: {
  isSelected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.statusButton, isSelected && styles.selectedStatusButton]}
    >
      <Text style={[styles.statusButtonLabel, isSelected && styles.selectedStatusButtonLabel]}>
        {label}
      </Text>
    </Pressable>
  );
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

function getStatusLabel(status?: PlanItemStatus) {
  if (status === "completed") {
    return "완료됨";
  }

  if (status === "skipped") {
    return "건너뜀";
  }

  return "대기";
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: theme.space.lg,
    padding: theme.space.xl,
    paddingBottom: 36,
  },
  hero: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderLeftColor: theme.colors.warm,
    borderLeftWidth: 5,
    borderRadius: theme.radius.large,
    borderWidth: 1,
    gap: theme.space.xl,
    padding: theme.space.lg,
  },
  headerTop: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerActions: {
    flexDirection: "row",
    gap: theme.space.xs,
  },
  datePill: {
    backgroundColor: theme.colors.warmSoft,
    borderColor: "#E3C7B8",
    borderRadius: theme.radius.small,
    borderWidth: 1,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.xs,
  },
  datePillText: {
    ...theme.type.caption,
    color: theme.colors.warm,
    fontWeight: "800",
  },
  headerActionButton: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 36,
    paddingHorizontal: theme.space.sm,
  },
  headerActionButtonLabel: {
    ...theme.type.caption,
    color: theme.colors.primary,
    fontWeight: "900",
  },
  heroCopy: {
    gap: theme.space.sm,
  },
  eyebrow: {
    ...theme.type.eyebrow,
    color: theme.colors.primary,
  },
  title: {
    ...theme.type.title,
    color: theme.colors.ink,
  },
  description: {
    ...theme.type.body,
    color: theme.colors.muted,
  },
  recoveryStrip: {
    backgroundColor: theme.colors.surfaceTint,
    borderColor: "#CADCD0",
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: theme.space.xxs,
    padding: theme.space.md,
  },
  recoveryStripLabel: {
    ...theme.type.caption,
    color: theme.colors.primary,
    fontWeight: "900",
  },
  recoveryStripText: {
    ...theme.type.supporting,
    color: theme.colors.inkSoft,
    fontWeight: "800",
  },
  statusGrid: {
    flexDirection: "row",
    gap: theme.space.sm,
  },
  statusTile: {
    ...commonStyles.card,
    flex: 1,
    gap: theme.space.xs,
    padding: theme.space.md,
  },
  statusTileWarm: {
    ...commonStyles.card,
    backgroundColor: theme.colors.warmSoft,
    borderColor: "#E3C7B8",
    flex: 1,
    gap: theme.space.xs,
    padding: theme.space.md,
  },
  statusValue: {
    color: theme.colors.ink,
    fontSize: 30,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 36,
  },
  statusLabel: {
    ...theme.type.caption,
    color: theme.colors.muted,
    fontWeight: "800",
  },
  summaryBand: {
    backgroundColor: theme.colors.ink,
    borderColor: theme.colors.ink,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: theme.space.xs,
    padding: theme.space.md,
  },
  summaryEyebrow: {
    ...theme.type.eyebrow,
    color: "#B8CFC2",
  },
  summaryTitle: {
    ...theme.type.sectionTitle,
    color: theme.colors.white,
  },
  summaryText: {
    ...theme.type.supporting,
    color: theme.colors.muted,
  },
  summaryTextOnDark: {
    ...theme.type.supporting,
    color: "#D8E0DA",
  },
  progressBand: {
    ...commonStyles.card,
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  progressHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressTitle: {
    ...theme.type.sectionTitle,
    color: theme.colors.ink,
  },
  progressRate: {
    color: theme.colors.primary,
    fontSize: 20,
    fontVariant: ["tabular-nums"],
    fontWeight: "900",
    letterSpacing: 0,
  },
  progressTrack: {
    backgroundColor: theme.colors.backgroundAlt,
    borderRadius: theme.radius.small,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: theme.colors.primary,
    height: 8,
  },
  section: {
    gap: theme.space.sm,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space.xs,
  },
  sectionAccent: {
    borderRadius: theme.radius.small,
    height: 18,
    width: 5,
  },
  sectionTitleWarmAccent: {
    backgroundColor: theme.colors.warm,
  },
  sectionTitleSecondaryAccent: {
    backgroundColor: theme.colors.secondary,
  },
  sectionTitle: {
    ...theme.type.sectionTitle,
    color: theme.colors.ink,
  },
  planItem: {
    ...commonStyles.card,
    gap: theme.space.xs,
    padding: theme.space.md,
  },
  planItemMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  planItemSlot: {
    ...theme.type.caption,
    color: theme.colors.primary,
    fontWeight: "900",
  },
  planItemState: {
    ...theme.type.caption,
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    color: theme.colors.subtle,
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: theme.space.xs,
    paddingVertical: theme.space.xxs,
  },
  planItemTitle: {
    ...theme.type.body,
    color: theme.colors.ink,
    fontWeight: "900",
  },
  planItemDescription: {
    ...theme.type.supporting,
    color: theme.colors.muted,
  },
  controls: {
    flexDirection: "row",
    gap: theme.space.xs,
    paddingTop: theme.space.xs,
  },
  emptySection: {
    ...commonStyles.insetCard,
    padding: theme.space.md,
  },
  emptySectionText: {
    ...theme.type.supporting,
    color: theme.colors.muted,
  },
  statusButton: {
    alignItems: "center",
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    justifyContent: "center",
    minHeight: 38,
    paddingHorizontal: theme.space.sm,
  },
  statusButtonLabel: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  selectedStatusButton: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  selectedStatusButtonLabel: {
    color: theme.colors.primaryPressed,
  },
  adjustBand: {
    backgroundColor: theme.colors.warmSoft,
    borderColor: "#E3C7B8",
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  adjustTitle: {
    ...theme.type.sectionTitle,
    color: theme.colors.ink,
  },
});
