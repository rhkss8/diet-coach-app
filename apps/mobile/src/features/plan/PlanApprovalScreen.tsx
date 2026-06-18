import type { GenerateInitialPlanOutput } from "@diet-coach/ai";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import {
  ChatBubble,
  PlannerItemCard,
  ScreenTitleBlock,
  SectionHeader,
} from "../../shared/ui/planner-components";
import { theme } from "../../shared/ui/design-system";
import { countPlanItemsByType, getPlanItemsForFirstDay } from "./plan-approval";

type PlanApprovalScreenProps = {
  output: GenerateInitialPlanOutput;
  onApprove: () => void;
};

/**
 * Maps the initial plan review route to the Figma Make approval layout.
 */
export function PlanApprovalScreen({ onApprove, output }: PlanApprovalScreenProps) {
  const firstDayItems = getPlanItemsForFirstDay(output.plan);
  const itemCounts = countPlanItemsByType(output.plan.items);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} style={styles.scroller}>
        <ScreenTitleBlock title={"플랜이\n준비됐어요."} />
        <ChatBubble role="assistant">{output.userMessage}</ChatBubble>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{output.plan.summary}</Text>
          <Text style={styles.summaryText}>
            식사 {itemCounts.meal}개, 운동 {itemCounts.exercise}개가 첫 플랜에 배치됐어요.
          </Text>
        </View>

        <View style={styles.section}>
          <SectionHeader label="오늘 먼저 할 일" />
          <View style={styles.itemList}>
            {firstDayItems.map((planItem) => (
              <PlannerItemCard
                detail={planItem.description}
                isCompleted={false}
                isSkipped={false}
                key={planItem.id ?? `${planItem.date}-${planItem.slot}`}
                onComplete={() => undefined}
                onSkip={() => undefined}
                title={`${getSlotLabel(planItem.slot)} · ${planItem.title}`}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader label="조정 가능 포인트" />
          <View style={styles.noteList}>
            {output.adjustmentNotes.map((note) => (
              <Text key={note} style={styles.note}>
                {note}
              </Text>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomPanel}>
        <Pressable accessibilityRole="button" onPress={onApprove} style={styles.approveButton}>
          <Text style={styles.approveButtonText}>이 플랜으로 시작하기</Text>
        </Pressable>
        <Text style={styles.helperText}>
          승인 후에도 회식, 야근, 운동 미실행이 생기면 오늘 기준으로 다시 맞출 수 있어요.
        </Text>
      </View>
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
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scroller: {
    flex: 1,
  },
  content: {
    gap: theme.space.lg,
    paddingBottom: theme.space.xl,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.lg,
  },
  summaryCard: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: "rgba(61, 97, 66, 0.15)",
    borderRadius: theme.radius.large,
    borderWidth: 1,
    gap: theme.space.xs,
    padding: theme.space.md,
  },
  summaryTitle: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
  summaryText: {
    color: theme.colors.inkSoft,
    fontSize: 12,
    lineHeight: 18,
  },
  section: {
    gap: theme.space.xs,
  },
  itemList: {
    gap: theme.space.xs,
  },
  noteList: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    borderWidth: 1,
    gap: theme.space.xs,
    padding: theme.space.md,
  },
  note: {
    color: theme.colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  bottomPanel: {
    backgroundColor: theme.colors.background,
    borderTopColor: "rgba(42, 61, 46, 0.07)",
    borderTopWidth: 1,
    gap: theme.space.xs,
    paddingBottom: 34,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.sm,
  },
  approveButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.large,
    minHeight: 52,
    justifyContent: "center",
  },
  approveButtonText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  helperText: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
});
