import type { GenerateInitialPlanOutput } from "@diet-coach/ai";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { countPlanItemsByType, getPlanItemsForFirstDay } from "./plan-approval";

type PlanApprovalScreenProps = {
  output: GenerateInitialPlanOutput;
  onApprove: () => void;
};

export function PlanApprovalScreen({ onApprove, output }: PlanApprovalScreenProps) {
  const firstDayItems = getPlanItemsForFirstDay(output.plan);
  const itemCounts = countPlanItemsByType(output.plan.items);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>첫 7일 플랜</Text>
        <Text style={styles.title}>이 플랜으로 시작해볼까요?</Text>
        <Text style={styles.description}>{output.userMessage}</Text>
      </View>

      <View style={styles.summaryBand}>
        <Text style={styles.summaryTitle}>{output.plan.summary}</Text>
        <Text style={styles.summaryText}>
          식사 {itemCounts.meal}개, 운동 {itemCounts.exercise}개가 7일 동안 배치됐어요.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>오늘 먼저 할 일</Text>
        {firstDayItems.map((planItem) => (
          <View key={planItem.id ?? `${planItem.date}-${planItem.slot}`} style={styles.planItem}>
            <Text style={styles.planItemSlot}>{getSlotLabel(planItem.slot)}</Text>
            <Text style={styles.planItemTitle}>{planItem.title}</Text>
            <Text style={styles.planItemDescription}>{planItem.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>조정 가능 포인트</Text>
        {output.adjustmentNotes.map((note) => (
          <Text key={note} style={styles.note}>
            {note}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.helperText}>
          승인 후에도 회식, 야근, 운동 미실행이 생기면 오늘 기준으로 다시 맞출 수 있어요.
        </Text>
        <PrimaryButton label="이 플랜으로 시작" onPress={onApprove} />
      </View>
    </ScrollView>
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
  note: {
    color: "#526057",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    gap: 14,
  },
  helperText: {
    color: "#657269",
    fontSize: 14,
    lineHeight: 20,
  },
});
