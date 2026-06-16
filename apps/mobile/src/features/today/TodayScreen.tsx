import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import type { AiPlan } from "@diet-coach/ai";

import { trackAnalyticsEvent } from "../../shared/lib/analytics";
import { countPendingTodayItems, getTodayPlanDate, getTodayPlanItems } from "./today-plan";

type TodayScreenProps = {
  plan: AiPlan;
};

export function TodayScreen({ plan }: TodayScreenProps) {
  const todayPlanDate = getTodayPlanDate(plan);
  const todayItems = getTodayPlanItems(plan);
  const pendingItemCount = countPendingTodayItems(todayItems);

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
    </ScrollView>
  );
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
});
