import { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { Sex } from "@diet-coach/core";

import { theme } from "../../shared/ui/design-system";
import { FormTextField } from "../../shared/ui/FormTextField";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { SegmentedChoice } from "../../shared/ui/SegmentedChoice";
import { CalendarDatePicker } from "../onboarding/CalendarDatePicker";
import { getTargetDateRange } from "../onboarding/goal-step";
import {
  canSavePlanBasisDraft,
  createPlanBasis,
  createPlanBasisDraft,
  normalizeDecimalPlanBasisInput,
  normalizeIntegerPlanBasisInput,
  type PlanBasis,
  type PlanBasisDraft,
  validatePlanBasisDraft,
} from "./plan-basis";
import { getBasicSettingsItems, getReleaseLinks } from "./settings-items";

type SettingsScreenProps = {
  authMode: "authenticated" | "guest";
  onSavePlanBasis: (planBasis: PlanBasis) => Promise<void>;
  planBasis: PlanBasis | null;
};

const sexOptions = [
  { label: "선택 안 함", value: "prefer_not_to_say" },
  { label: "여성", value: "female" },
  { label: "남성", value: "male" },
  { label: "기타", value: "other" },
] satisfies { label: string; value: Sex }[];

export function SettingsScreen({ authMode, onSavePlanBasis, planBasis }: SettingsScreenProps) {
  const settingsItems = getBasicSettingsItems(getReleaseLinks());
  const targetDateRange = getTargetDateRange();
  const [draft, setDraft] = useState<PlanBasisDraft>(() => createPlanBasisDraft(planBasis));
  const [isSavingPlanBasis, setIsSavingPlanBasis] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const fieldErrors = validatePlanBasisDraft(draft);
  const canSavePlanBasis = canSavePlanBasisDraft(draft) && !isSavingPlanBasis;
  const sessionLabel = authMode === "guest" ? "게스트 모드" : "로그인 세션";

  useEffect(() => {
    setDraft(createPlanBasisDraft(planBasis));
  }, [planBasis]);

  function updateDraft<Field extends keyof PlanBasisDraft>(
    field: Field,
    value: PlanBasisDraft[Field],
  ) {
    setSaveMessage(null);
    setDraft((currentDraft) => ({
      ...currentDraft,
      [field]: value,
    }));
  }

  async function submitPlanBasis() {
    if (!canSavePlanBasis) {
      return;
    }

    setIsSavingPlanBasis(true);

    try {
      await onSavePlanBasis(createPlanBasis(draft));
      setSaveMessage("플랜 계산 기준을 저장했어요.");
    } finally {
      setIsSavingPlanBasis(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>설정</Text>
        <Text style={styles.title}>플랜 기준 관리</Text>
        <Text style={styles.description}>플랜 계산에 쓰는 기본 정보와 앱 정보를 관리해요.</Text>
      </View>

      <View style={styles.list}>
        <Text style={styles.listTitle}>계정</Text>
        <View style={styles.listRows}>
          <View style={[styles.itemRow, styles.itemRowLast]}>
            <SettingsItemContent
              description="현재 앱을 사용하는 방식입니다."
              meta={sessionLabel}
              title="세션 상태"
            />
          </View>
        </View>
      </View>

      <View style={styles.planBasisSection}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.sectionKicker}>플랜 계산 기준</Text>
            <Text style={styles.sectionTitle}>첫 플랜에 필요한 기본 정보</Text>
          </View>
          <Text style={styles.requiredLabel}>필수</Text>
        </View>
        <Text style={styles.planBasisDescription}>
          칼로리와 단백질 기준을 너무 두루뭉실하게 만들지 않기 위한 값입니다. 저장해도 현재 승인된
          플랜은 자동으로 바뀌지 않습니다.
        </Text>

        <View style={styles.formGrid}>
          <FormTextField
            error={fieldErrors.age}
            keyboardType="number-pad"
            label="나이"
            onChangeText={(value) => updateDraft("age", normalizeIntegerPlanBasisInput(value))}
            placeholder="34"
            suffix="세"
            value={draft.age}
          />
          <FormTextField
            error={fieldErrors.heightCm}
            keyboardType="number-pad"
            label="키"
            onChangeText={(value) => updateDraft("heightCm", normalizeIntegerPlanBasisInput(value))}
            placeholder="164"
            suffix="cm"
            value={draft.heightCm}
          />
          <FormTextField
            error={fieldErrors.currentWeightKg}
            keyboardType="decimal-pad"
            label="현재 체중"
            onChangeText={(value) =>
              updateDraft("currentWeightKg", normalizeDecimalPlanBasisInput(value))
            }
            placeholder="72.5"
            suffix="kg"
            value={draft.currentWeightKg}
          />
          <FormTextField
            error={fieldErrors.targetWeightKg}
            keyboardType="decimal-pad"
            label="목표 체중"
            onChangeText={(value) =>
              updateDraft("targetWeightKg", normalizeDecimalPlanBasisInput(value))
            }
            placeholder="66"
            suffix="kg"
            value={draft.targetWeightKg}
          />
        </View>

        <View style={styles.optionalGroup}>
          <Text style={styles.optionalTitle}>선택 정보</Text>
          <FormTextField
            label="호칭"
            onChangeText={(value) => updateDraft("name", value)}
            placeholder="어떻게 불러드릴까요?"
            value={draft.name}
          />
          <CalendarDatePicker
            error={fieldErrors.targetDate}
            label="목표 날짜"
            maxDate={targetDateRange.maxDate}
            minDate={targetDateRange.minDate}
            onChange={(value) => updateDraft("targetDate", value ?? "")}
            value={draft.targetDate}
          />
          <SegmentedChoice
            label="성별"
            onChange={(value) => updateDraft("sex", value)}
            options={sexOptions}
            value={draft.sex}
          />
        </View>

        {saveMessage ? <Text style={styles.saveMessage}>{saveMessage}</Text> : null}
        <PrimaryButton
          disabled={!canSavePlanBasis}
          fullWidth
          label={isSavingPlanBasis ? "저장 중" : "플랜 계산 기준 저장"}
          onPress={submitPlanBasis}
        />
      </View>

      <View style={styles.list}>
        <Text style={styles.listTitle}>지원 및 정보</Text>
        <View style={styles.listRows}>
          {settingsItems.map((item, index) => {
            const itemUrl = item.url;
            const isLastItem = index === settingsItems.length - 1;

            return itemUrl ? (
              <Pressable
                accessibilityRole="link"
                key={item.id}
                onPress={() => {
                  void Linking.openURL(itemUrl);
                }}
                style={[styles.itemRow, isLastItem && styles.itemRowLast]}
              >
                <SettingsItemContent
                  description={item.description}
                  meta="열기"
                  title={item.title}
                />
              </Pressable>
            ) : (
              <View
                accessibilityRole="text"
                key={item.id}
                style={[styles.itemRow, isLastItem && styles.itemRowLast, styles.itemRowReadOnly]}
              >
                <SettingsItemContent
                  description={item.description}
                  meta="정보"
                  title={item.title}
                />
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

type SettingsItemContentProps = {
  description: string;
  meta: string;
  title: string;
};

function SettingsItemContent({ description, meta, title }: SettingsItemContentProps) {
  return (
    <>
      <View style={styles.itemCopy}>
        <Text style={styles.itemTitle}>{title}</Text>
        <Text style={styles.itemDescription}>{description}</Text>
      </View>
      <Text style={styles.itemMeta}>{meta}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: theme.space.lg,
    padding: theme.space.xl,
    paddingBottom: 36,
  },
  eyebrow: {
    ...theme.type.eyebrow,
    color: theme.colors.muted,
  },
  header: {
    gap: theme.space.xs,
  },
  title: {
    ...theme.type.title,
    color: theme.colors.ink,
  },
  description: {
    ...theme.type.body,
    color: theme.colors.inkSoft,
  },
  list: {
    gap: theme.space.sm,
  },
  listTitle: {
    ...theme.type.eyebrow,
    color: theme.colors.muted,
  },
  listRows: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    overflow: "hidden",
  },
  planBasisSection: {
    borderTopColor: theme.colors.borderStrong,
    borderTopWidth: 1,
    gap: theme.space.md,
    paddingTop: theme.space.lg,
  },
  cardHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.space.md,
  },
  sectionKicker: {
    ...theme.type.eyebrow,
    color: theme.colors.primary,
    marginBottom: theme.space.xxs,
  },
  sectionTitle: {
    ...theme.type.sectionTitle,
    color: theme.colors.ink,
  },
  requiredLabel: {
    ...theme.type.caption,
    color: theme.colors.muted,
    fontWeight: "800",
  },
  planBasisDescription: {
    ...theme.type.supporting,
    color: theme.colors.inkSoft,
  },
  formGrid: {
    gap: theme.space.sm,
  },
  optionalGroup: {
    gap: theme.space.sm,
  },
  optionalTitle: {
    ...theme.type.eyebrow,
    color: theme.colors.muted,
  },
  saveMessage: {
    ...theme.type.caption,
    color: theme.colors.success,
    fontWeight: "800",
  },
  itemRow: {
    alignItems: "center",
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: theme.space.md,
    justifyContent: "space-between",
    minHeight: 74,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
  },
  itemRowReadOnly: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemCopy: {
    flex: 1,
    gap: theme.space.xxs,
  },
  itemTitle: {
    ...theme.type.body,
    color: theme.colors.ink,
    fontWeight: "900",
  },
  itemDescription: {
    ...theme.type.supporting,
    color: theme.colors.muted,
  },
  itemMeta: {
    ...theme.type.caption,
    color: theme.colors.primary,
    fontWeight: "800",
  },
});
