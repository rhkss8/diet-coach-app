import { useEffect, useState } from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import type { Sex } from "@diet-coach/core";

import { commonStyles, theme } from "../../shared/ui/design-system";
import { BackButton } from "../../shared/ui/planner-components";
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
  onClose: () => void;
  onSavePlanBasis: (planBasis: PlanBasis) => Promise<void>;
  planBasis: PlanBasis | null;
};

const sexOptions = [
  { label: "선택 안 함", value: "prefer_not_to_say" },
  { label: "여성", value: "female" },
  { label: "남성", value: "male" },
  { label: "기타", value: "other" },
] satisfies { label: string; value: Sex }[];

export function SettingsScreen({
  authMode,
  onClose,
  onSavePlanBasis,
  planBasis,
}: SettingsScreenProps) {
  const settingsItems = getBasicSettingsItems(getReleaseLinks());
  const [draft, setDraft] = useState<PlanBasisDraft>(() => createPlanBasisDraft(planBasis));
  const [isSavingPlanBasis, setIsSavingPlanBasis] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const fieldErrors = validatePlanBasisDraft(draft);
  const canSavePlanBasis = canSavePlanBasisDraft(draft) && !isSavingPlanBasis;

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
      <View style={styles.topBar}>
        <BackButton onPress={onClose} />
        <Text style={styles.eyebrow}>설정</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>테스트 준비를 확인해요</Text>
        <Text style={styles.description}>
          현재는 {authMode === "guest" ? "게스트 모드" : "로그인 세션"}로 진행 중입니다.
        </Text>
      </View>

      <View style={styles.planBasisCard}>
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
          <PlanBasisInput
            error={fieldErrors.age}
            keyboardType="number-pad"
            label="나이"
            onChangeText={(value) => updateDraft("age", normalizeIntegerPlanBasisInput(value))}
            placeholder="34"
            suffix="세"
            value={draft.age}
          />
          <PlanBasisInput
            error={fieldErrors.heightCm}
            keyboardType="number-pad"
            label="키"
            onChangeText={(value) => updateDraft("heightCm", normalizeIntegerPlanBasisInput(value))}
            placeholder="164"
            suffix="cm"
            value={draft.heightCm}
          />
          <PlanBasisInput
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
          <PlanBasisInput
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
          <PlanBasisInput
            label="호칭"
            onChangeText={(value) => updateDraft("name", value)}
            placeholder="어떻게 불러드릴까요?"
            value={draft.name}
          />
          <PlanBasisInput
            error={fieldErrors.targetDate}
            label="목표 날짜"
            onChangeText={(value) => updateDraft("targetDate", value)}
            placeholder="2026-09-24"
            value={draft.targetDate}
          />
          <View style={styles.sexOptions}>
            {sexOptions.map((option) => {
              const isSelected = draft.sex === option.value;

              return (
                <Pressable
                  accessibilityRole="button"
                  key={option.value}
                  onPress={() => updateDraft("sex", option.value)}
                  style={[styles.sexChip, isSelected && styles.sexChipActive]}
                >
                  <Text style={[styles.sexChipText, isSelected && styles.sexChipTextActive]}>
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {saveMessage ? <Text style={styles.saveMessage}>{saveMessage}</Text> : null}
        <Pressable
          accessibilityRole="button"
          disabled={!canSavePlanBasis}
          onPress={submitPlanBasis}
          style={[styles.saveButton, !canSavePlanBasis && styles.saveButtonDisabled]}
        >
          <Text style={styles.saveButtonText}>
            {isSavingPlanBasis ? "저장 중" : "플랜 계산 기준 저장"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.list}>
        {settingsItems.map((item) => (
          <Pressable
            accessibilityRole={item.url ? "link" : undefined}
            disabled={!item.url}
            key={item.id}
            onPress={() => {
              if (item.url) {
                void Linking.openURL(item.url);
              }
            }}
            style={styles.item}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

type PlanBasisInputProps = {
  error?: string;
  keyboardType?: "decimal-pad" | "number-pad";
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  suffix?: string;
  value: string;
};

function PlanBasisInput({
  error,
  keyboardType,
  label,
  onChangeText,
  placeholder,
  suffix,
  value,
}: PlanBasisInputProps) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputShell, error && styles.inputShellError]}>
        <TextInput
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          style={styles.input}
          value={value}
        />
        {suffix ? <Text style={styles.inputSuffix}>{suffix}</Text> : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  content: {
    gap: theme.space.xl,
    padding: theme.space.xl,
    paddingBottom: 36,
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eyebrow: {
    ...theme.type.eyebrow,
    color: theme.colors.primary,
  },
  header: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radius.large,
    gap: theme.space.sm,
    padding: theme.space.lg,
  },
  title: {
    ...theme.type.title,
    color: theme.colors.white,
  },
  description: {
    ...theme.type.body,
    color: "#D8E0DA",
  },
  list: {
    gap: theme.space.sm,
  },
  planBasisCard: {
    ...commonStyles.card,
    gap: theme.space.md,
    padding: theme.space.lg,
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
  inputGroup: {
    gap: theme.space.xs,
  },
  inputLabel: {
    ...theme.type.caption,
    color: theme.colors.inkSoft,
    fontWeight: "800",
  },
  inputShell: {
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 48,
    paddingHorizontal: theme.space.sm,
  },
  inputShellError: {
    borderColor: theme.colors.danger,
  },
  input: {
    ...theme.type.body,
    color: theme.colors.ink,
    flex: 1,
    minHeight: 44,
    outlineStyle: "none" as never,
    paddingVertical: theme.space.xs,
  },
  inputSuffix: {
    ...theme.type.supporting,
    color: theme.colors.muted,
    fontWeight: "800",
  },
  errorText: {
    ...theme.type.caption,
    color: theme.colors.danger,
  },
  sexOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.xs,
  },
  sexChip: {
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    paddingHorizontal: theme.space.sm,
    paddingVertical: theme.space.xs,
  },
  sexChipActive: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  sexChipText: {
    ...theme.type.caption,
    color: theme.colors.muted,
    fontWeight: "800",
  },
  sexChipTextActive: {
    color: theme.colors.primaryPressed,
  },
  saveMessage: {
    ...theme.type.caption,
    color: theme.colors.success,
    fontWeight: "800",
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.small,
    minHeight: 50,
    justifyContent: "center",
    paddingHorizontal: theme.space.md,
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.surfaceMuted,
  },
  saveButtonText: {
    ...theme.type.button,
    color: theme.colors.white,
  },
  item: {
    ...commonStyles.card,
    gap: theme.space.xs,
    padding: theme.space.md,
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
});
