import type { AdjustmentReason } from "@diet-coach/core";
import { useState } from "react";
import {
  ArrowRight,
  Coffee,
  Dumbbell,
  Heart,
  HelpCircle,
  Moon,
  Plane,
  Utensils,
} from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { theme } from "../../shared/ui/design-system";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import {
  BackButton,
  type PlannerIcon,
  ReasonTile,
  ScreenTitleBlock,
} from "../../shared/ui/planner-components";

type AdjustmentReasonSelectionScreenProps = {
  errorMessage?: string;
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
  errorMessage,
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
        <BackButton onPress={onBack} />

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
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <PrimaryButton
          disabled={!canSubmit}
          fullWidth
          iconRight={
            <ArrowRight
              color={canSubmit ? theme.colors.surface : theme.colors.subtle}
              size={15}
              strokeWidth={2}
            />
          }
          label="AI에게 조정 요청하기"
          onPress={onSubmitReason}
        />
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
    gap: theme.space.sm,
    paddingBottom: 40,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.sm,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 17,
    textAlign: "center",
  },
});
