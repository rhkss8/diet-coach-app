import type { AdjustTodayPlanOutput } from "@diet-coach/ai";
import { ArrowRight, Check } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { BackButton, ChatBubble } from "../../shared/ui/planner-components";
import { theme } from "../../shared/ui/design-system";
import { getChangeBadgeLabel, getChangedTodayItems } from "./revised-plan-review";

type RevisedPlanReviewScreenProps = {
  output: AdjustTodayPlanOutput;
  onApprove: () => void;
  onBack: () => void;
  onDismiss: () => void;
};

/**
 * Maps generated revisions to the Figma Make plan-approval comparison layout.
 */
export function RevisedPlanReviewScreen({
  onApprove,
  onBack,
  onDismiss,
  output,
}: RevisedPlanReviewScreenProps) {
  const changedItems = getChangedTodayItems(output.revision);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} style={styles.scroller}>
        <BackButton onPress={onBack} />

        <Text style={styles.title}>수정안이{"\n"}준비됐어요.</Text>

        <ChatBubble role="assistant">{output.revision.userMessage}</ChatBubble>

        <Text style={styles.sectionKicker}>변경 내용</Text>

        <View style={styles.compareCard}>
          <View style={styles.beforePanel}>
            <Text style={styles.beforeKicker}>변경 전</Text>
            <View style={styles.changeList}>
              {changedItems.map((item) => (
                <View key={`before-${item.id ?? item.slot}`} style={styles.changeItem}>
                  <View style={styles.beforeRail} />
                  <View style={styles.changeCopy}>
                    <Text style={styles.beforeTitle}>
                      {getSlotLabel(item.slot)} · 기존 플랜 항목
                    </Text>
                    <Text style={styles.beforeText}>오늘 상황이 바뀌기 전 계획</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.dividerPanel}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerCopy}>
              <ArrowRight color={theme.colors.subtle} size={12} strokeWidth={2} />
              <Text style={styles.dividerText}>수정</Text>
            </View>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.afterPanel}>
            <Text style={styles.afterKicker}>변경 후</Text>
            <View style={styles.changeList}>
              {changedItems.map((item) => (
                <View key={item.id ?? `${item.date}-${item.slot}`} style={styles.changeItem}>
                  <View style={styles.afterRail} />
                  <View style={styles.changeCopy}>
                    <View style={styles.afterTitleRow}>
                      <Text style={styles.afterTitle}>
                        {getSlotLabel(item.slot)} · {item.title}
                      </Text>
                      <Text style={styles.badge}>{getChangeBadgeLabel(item)}</Text>
                    </View>
                    <Text style={styles.afterText}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.reassurance}>
          <View style={styles.infoMark}>
            <Text style={styles.infoMarkText}>i</Text>
          </View>
          <Text style={styles.reassuranceText}>승인 전까지 현재 플랜은 바뀌지 않아요.</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomPanel}>
        <PrimaryButton
          fullWidth
          iconRight={<Check color={theme.colors.surface} size={15} strokeWidth={2.5} />}
          label="이 수정안 승인하기"
          onPress={onApprove}
        />
        <PrimaryButton fullWidth label="다시 제안받기" onPress={onDismiss} variant="ghost" />
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
    paddingTop: theme.space.sm,
  },
  title: {
    color: theme.colors.ink,
    fontFamily: "serif",
    fontSize: 22,
    fontWeight: "400",
    lineHeight: 34,
    marginTop: -theme.space.xs,
  },
  sectionKicker: {
    ...theme.type.eyebrow,
    color: theme.colors.muted,
  },
  compareCard: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    borderWidth: 1,
    overflow: "hidden",
  },
  beforePanel: {
    backgroundColor: "#FDF8F5",
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  afterPanel: {
    backgroundColor: theme.colors.primarySoft,
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  beforeKicker: {
    ...theme.type.eyebrow,
    color: theme.colors.muted,
  },
  afterKicker: {
    ...theme.type.eyebrow,
    color: theme.colors.primary,
  },
  changeList: {
    gap: theme.space.sm,
  },
  changeItem: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space.sm,
  },
  beforeRail: {
    backgroundColor: "rgba(168, 100, 80, 0.25)",
    borderRadius: 2,
    height: 40,
    width: 3,
  },
  afterRail: {
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
    height: 40,
    width: 3,
  },
  changeCopy: {
    flex: 1,
    gap: 2,
  },
  beforeTitle: {
    color: "rgba(150, 130, 120, 0.8)",
    fontSize: 13,
    lineHeight: 18,
    textDecorationLine: "line-through",
  },
  beforeText: {
    color: "rgba(150, 130, 120, 0.6)",
    fontSize: 11,
    lineHeight: 16,
  },
  afterTitleRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.xs,
  },
  afterTitle: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  badge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    color: theme.colors.surface,
    fontSize: 9,
    fontWeight: "700",
    lineHeight: 13,
    overflow: "hidden",
    paddingHorizontal: theme.space.xs,
    paddingVertical: 1,
  },
  afterText: {
    color: theme.colors.subtle,
    fontSize: 11,
    lineHeight: 16,
  },
  dividerPanel: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    flexDirection: "row",
    gap: theme.space.sm,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  dividerLine: {
    backgroundColor: theme.colors.border,
    flex: 1,
    height: 1,
  },
  dividerCopy: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },
  dividerText: {
    color: theme.colors.subtle,
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 14,
  },
  reassurance: {
    alignItems: "center",
    backgroundColor: theme.colors.backgroundAlt,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    flexDirection: "row",
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  infoMark: {
    alignItems: "center",
    backgroundColor: theme.colors.muted,
    borderRadius: 8,
    height: 16,
    justifyContent: "center",
    width: 16,
  },
  infoMarkText: {
    color: theme.colors.surface,
    fontSize: 9,
    fontWeight: "800",
    lineHeight: 12,
  },
  reassuranceText: {
    color: theme.colors.muted,
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
  },
  bottomPanel: {
    backgroundColor: theme.colors.background,
    borderTopColor: "rgba(42, 61, 46, 0.07)",
    borderTopWidth: 1,
    gap: theme.space.xs,
    paddingBottom: 40,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.sm,
  },
});
