import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { AiPlan } from "@diet-coach/ai";

import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import {
  countPendingTodayItems,
  getTodayPlanDate,
  getTodayPlanItems,
  groupTodayPlanItemsByType,
} from "./today-plan";

type TodayScreenProps = {
  plan: AiPlan;
};

export function TodayScreen({ plan }: TodayScreenProps) {
  const todayPlanDate = getTodayPlanDate(plan);
  const todayItems = getTodayPlanItems(plan);
  const pendingItemCount = countPendingTodayItems(todayItems);
  const { exercises, meals } = groupTodayPlanItemsByType(todayItems);

  useEffect(() => {
    trackAnalyticsEvent("TODAY_SCREEN_VIEWED", {
      userId: "local-user",
      goalId: plan.goalId,
      planId: plan.id ?? "local-plan",
    });
  }, [plan.goalId, plan.id]);

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

      <TodayPlanSection items={meals} title="오늘 식사" />
      <TodayPlanSection items={exercises} title="오늘 운동" />
    </ScrollView>
  );
}

function TodayPlanSection({
  items,
  title,
}: {
  items: ReturnType<typeof groupTodayPlanItemsByType>["meals"];
  title: string;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((planItem) => (
        <View key={planItem.id ?? `${planItem.date}-${planItem.slot}`} style={styles.planItem}>
          <Text style={styles.planItemSlot}>{getSlotLabel(planItem.slot)}</Text>
          <Text style={styles.planItemTitle}>{planItem.title}</Text>
          <Text style={styles.planItemDescription}>{planItem.description}</Text>
        </View>
      ))}
    </View>
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
});
