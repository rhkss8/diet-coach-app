import type { AdjustmentReason } from "@diet-coach/core";
import { ScrollView, StyleSheet, View } from "react-native";

import { FormTextField } from "../../shared/ui/FormTextField";
import { theme } from "../../shared/ui/design-system";
import {
  BottomActionPanel,
  ReasonTile,
  ScreenTitleBlock,
} from "../../shared/ui/planner-components";
import { getAdjustmentReasonOptions } from "./adjustment-reason";

type AdjustmentReasonSelectionScreenProps = {
  note: string;
  onChangeNote: (note: string) => void;
  onSelectReason: (reason: AdjustmentReason) => void;
  onSubmitNote: () => void;
  selectedReason?: AdjustmentReason;
};

/**
 * Maps the adjustment entry route to the Figma Make recovery-reasons source screen.
 */
export function AdjustmentReasonSelectionScreen({
  note,
  onChangeNote,
  onSelectReason,
  onSubmitNote,
  selectedReason = "meal_changed",
}: AdjustmentReasonSelectionScreenProps) {
  const reasonOptions = getAdjustmentReasonOptions();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} style={styles.scroller}>
        <ScreenTitleBlock
          description={"괜찮아요. 지금 상황 기준으로\n오늘 플랜을 다시 맞춰볼게요."}
          title={"무슨 일이\n있으셨나요?"}
        />

        <View style={styles.reasonGrid}>
          {chunkPairs(reasonOptions).map((row) => (
            <View key={row.map((item) => item.value).join("-")} style={styles.reasonRow}>
              {row.map((option) => (
                <ReasonTile
                  isSelected={option.value === selectedReason}
                  key={option.value}
                  label={option.label}
                  note={getReasonNote(option.value)}
                  onPress={() => onSelectReason(option.value)}
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
        label="AI에게 조정 요청하기"
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

function getReasonNote(reason: AdjustmentReason) {
  const notes: Record<AdjustmentReason, string> = {
    meal_changed: "식사 변경",
    missed_exercise: "오늘 미실행",
    schedule_changed: "시간이 달라요",
    want_replan: "다시 맞출래요",
  };

  return notes[reason];
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
    gap: theme.space.xl,
    paddingBottom: theme.space.xl,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.lg,
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
