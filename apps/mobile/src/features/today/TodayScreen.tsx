import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import type { AiPlan, AiPlanItem } from "@diet-coach/ai";
import type { PlanItemStatus } from "@diet-coach/core";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import {
  countPendingTodayItems,
  getTodayPlanDate,
  getTodayPlanItems,
  getDailyProgressSummary,
  getPlanItemStatusEventName,
  groupTodayPlanItemsByType,
  updateTodayPlanItemStatus,
} from "./today-plan";

type TodayScreenProps = {
  onAdjustToday: () => void;
  plan: AiPlan;
};

export function TodayScreen({ onAdjustToday, plan }: TodayScreenProps) {
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
      <View style={styles.header}>
        <Text style={styles.eyebrow}>{todayPlanDate}</Text>
        <Text style={styles.title}>오늘 플랜을 이어갈게요</Text>
        <Text style={styles.description}>
          남은 항목 {pendingItemCount}개만 확인하면 돼요. 계획이 달라지면 오늘 기준으로 다시 맞출 수
          있어요.
        </Text>
      </View>

      <View style={styles.summaryBand}>
        <Text style={styles.summaryTitle}>{plan.summary}</Text>
        <Text style={styles.summaryText}>
          오늘은 식사와 운동을 합쳐 {todayItems.length}개 항목으로 시작합니다.
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

      <TodayPlanSection items={meals} onStatusChange={updatePlanItemStatus} title="오늘 식사" />
      <TodayPlanSection items={exercises} onStatusChange={updatePlanItemStatus} title="오늘 운동" />

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
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((planItem) => {
        const planItemId = planItem.id ?? `${planItem.date}-${planItem.slot}`;

        return (
          <View key={planItemId} style={styles.planItem}>
            <Text style={styles.planItemSlot}>{getSlotLabel(planItem.slot)}</Text>
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

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#F8F7F4",
    flex: 1,
  },
  content: {
    gap: 22,
    padding: 24,
    paddingBottom: 36,
  },
  header: {
    gap: 10,
    paddingTop: 12,
  },
  eyebrow: {
    color: "#5E7664",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  title: {
    color: "#1F2A24",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 36,
  },
  description: {
    color: "#53645A",
    fontSize: 16,
    lineHeight: 24,
  },
  summaryBand: {
    backgroundColor: "#EAF1EC",
    borderRadius: 8,
    gap: 8,
    padding: 16,
  },
  summaryTitle: {
    color: "#24342B",
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 24,
  },
  summaryText: {
    color: "#526057",
    fontSize: 14,
    lineHeight: 20,
  },
  progressBand: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DFE5E0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  progressHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressTitle: {
    color: "#26342C",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
  progressRate: {
    color: "#2F6B4F",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0,
  },
  progressTrack: {
    backgroundColor: "#E4EAE5",
    borderRadius: 8,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: "#2F6B4F",
    height: 8,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: "#26342C",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
  planItem: {
    backgroundColor: "#FFFFFF",
    borderColor: "#DFE5E0",
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
    padding: 14,
  },
  planItemSlot: {
    color: "#5E7664",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0,
  },
  planItemTitle: {
    color: "#1F2A24",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
  planItemDescription: {
    color: "#53645A",
    fontSize: 14,
    lineHeight: 20,
  },
  controls: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 6,
  },
  statusButton: {
    alignItems: "center",
    borderColor: "#D9E0DA",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 38,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  statusButtonLabel: {
    color: "#526057",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  selectedStatusButton: {
    backgroundColor: "#E6F0EA",
    borderColor: "#2F6B4F",
  },
  selectedStatusButtonLabel: {
    color: "#245A42",
  },
  adjustBand: {
    backgroundColor: "#F1EEE7",
    borderColor: "#E1D9CC",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  adjustTitle: {
    color: "#26342C",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0,
  },
});
