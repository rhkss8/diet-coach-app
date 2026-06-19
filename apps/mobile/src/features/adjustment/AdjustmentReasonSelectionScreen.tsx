import type { AdjustmentReason } from "@diet-coach/core";
import { useState } from "react";
import {
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

import { FormTextField } from "../../shared/ui/FormTextField";
import { theme } from "../../shared/ui/design-system";
import {
  BottomActionPanel,
  type PlannerIcon,
  ReasonTile,
  ScreenTitleBlock,
} from "../../shared/ui/planner-components";

type AdjustmentReasonSelectionScreenProps = {
  note: string;
  onChangeNote: (note: string) => void;
  onBack: () => void;
  onSelectReason: (reason: AdjustmentReason) => void;
  onSubmitNote: () => void;
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
  note,
  onChangeNote,
  onBack,
  onSelectReason,
  onSubmitNote,
  selectedReason,
}: AdjustmentReasonSelectionScreenProps) {
  const initialSelectedId =
    recoveryReasonOptions.find((option) => option.value === selectedReason)?.id ?? "overtime";
  const [selectedReasonId, setSelectedReasonId] = useState(initialSelectedId);

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

        <View style={styles.noteCard}>
          <FormTextField
            label="짧은 메모"
            multiline
            onChangeText={onChangeNote}
            placeholder="예: 점심을 많이 먹었어요. 오늘 운동은 어려울 것 같아요."
            value={note}
          />
        </View>
      </ScrollView>

      <BottomActionPanel
        helperText="메모는 선택 입력이에요. 비워도 다음 단계로 갈 수 있어요."
        label="조정안 만들기"
        onPress={onSubmitNote}
      />
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
  noteCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    borderWidth: 1,
    padding: theme.space.md,
  },
});
