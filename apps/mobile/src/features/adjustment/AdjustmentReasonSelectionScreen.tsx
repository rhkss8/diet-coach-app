import type { AdjustmentReason } from "@diet-coach/core";
import { useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  Coffee,
  Dumbbell,
  Heart,
  HelpCircle,
  Moon,
  Plane,
  Utensils,
} from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { theme } from "../../shared/ui/design-system";
import { type PlannerIcon, ReasonTile, ScreenTitleBlock } from "../../shared/ui/planner-components";

type AdjustmentReasonSelectionScreenProps = {
  onBack: () => void;
  onSelectReason: (reason: AdjustmentReason) => void;
  onSubmitReason: () => void;
  selectedReason?: AdjustmentReason;
};

type RecoveryReasonOption = {
  icon: PlannerIcon;
  id: string;
  label: string;
  note: string;
  value: AdjustmentReason;
};

const recoveryReasonOptions = [
  {
    icon: Coffee,
    id: "dinner",
    label: "회식",
    note: "저녁 식사 변경",
    value: "meal_changed",
  },
  {
    icon: Moon,
    id: "overtime",
    label: "야근",
    note: "식사 시간 불규칙",
    value: "schedule_changed",
  },
  {
    icon: Utensils,
    id: "binge",
    label: "폭식",
    note: "조정이 필요해요",
    value: "meal_changed",
  },
  {
    icon: Dumbbell,
    id: "no-exercise",
    label: "운동 못했어요",
    note: "오늘 미실행",
    value: "missed_exercise",
  },
  {
    icon: Plane,
    id: "travel",
    label: "여행 / 외출",
    note: "환경이 달라요",
    value: "schedule_changed",
  },
  {
    icon: Heart,
    id: "condition",
    label: "몸 상태",
    note: "컨디션 조절",
    value: "want_replan",
  },
  {
    icon: HelpCircle,
    id: "other",
    label: "기타",
    note: "직접 말할게요",
    value: "want_replan",
  },
] as const satisfies RecoveryReasonOption[];

/**
 * Maps the adjustment entry route to the Figma Make recovery-reasons source screen.
 */
export function AdjustmentReasonSelectionScreen({
  onBack,
  onSelectReason,
  onSubmitReason,
  selectedReason,
}: AdjustmentReasonSelectionScreenProps) {
  const initialSelectedId =
    recoveryReasonOptions.find((option) => option.value === selectedReason)?.id ?? "";
  const [selectedReasonId, setSelectedReasonId] = useState(initialSelectedId);
  const canSubmit = selectedReasonId.length > 0;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} style={styles.scroller}>
        <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
          <ChevronLeft color={theme.colors.primary} size={18} strokeWidth={2} />
          <Text style={styles.backButtonText}>돌아가기</Text>
        </Pressable>

        <ScreenTitleBlock
          description={"괜찮아요. 지금 상황 기준으로\n오늘 플랜을 다시 맞춰볼게요."}
          title={"무슨 일이\n있으셨나요?"}
        />

        <View style={styles.reasonGrid}>
          {chunkPairs(recoveryReasonOptions).map((row) => (
            <View key={row.map((item) => item.id).join("-")} style={styles.reasonRow}>
              {row.map((option) => (
                <ReasonTile
                  icon={option.icon}
                  isSelected={option.id === selectedReasonId}
                  key={option.id}
                  label={option.label}
                  note={option.note}
                  onPress={() => {
                    setSelectedReasonId(option.id);
                    onSelectReason(option.value);
                  }}
                />
              ))}
              {row.length === 1 ? <View style={styles.reasonPlaceholder} /> : null}
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomPanel}>
        <Pressable
          accessibilityRole="button"
          disabled={!canSubmit}
          onPress={onSubmitReason}
          style={[styles.submitButton, !canSubmit && styles.disabledSubmitButton]}
        >
          <Text style={[styles.submitButtonText, !canSubmit && styles.disabledSubmitButtonText]}>
            AI에게 조정 요청하기
          </Text>
          <ArrowRight
            color={canSubmit ? theme.colors.surface : theme.colors.muted}
            size={15}
            strokeWidth={2}
          />
        </Pressable>
      </View>
    </View>
  );
}

function chunkPairs<T>(items: T[]) {
  const rows: T[][] = [];

  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2));
  }

  return rows;
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
  backButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    flexDirection: "row",
    gap: 2,
    minHeight: 32,
    justifyContent: "center",
  },
  backButtonText: {
    color: theme.colors.primary,
    fontSize: 13,
    lineHeight: 18,
  },
  reasonGrid: {
    gap: theme.space.xs,
  },
  reasonRow: {
    flexDirection: "row",
    gap: theme.space.xs,
  },
  reasonPlaceholder: {
    flex: 1,
  },
  bottomPanel: {
    backgroundColor: theme.colors.background,
    borderTopColor: "rgba(42, 61, 46, 0.07)",
    borderTopWidth: 1,
    paddingBottom: 40,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.sm,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.large,
    flexDirection: "row",
    gap: theme.space.xs,
    minHeight: 52,
    justifyContent: "center",
  },
  disabledSubmitButton: {
    backgroundColor: theme.colors.backgroundAlt,
  },
  submitButtonText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  disabledSubmitButtonText: {
    color: theme.colors.muted,
  },
});
