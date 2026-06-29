import { Pressable, StyleSheet, Text, View } from "react-native";

import { theme } from "./design-system";

export type SegmentedChoiceOption<TValue extends string> = {
  label: string;
  value: TValue;
};

type SegmentedChoiceProps<TValue extends string> = {
  label: string;
  onChange: (value: TValue) => void;
  options: readonly SegmentedChoiceOption<TValue>[];
  value: TValue;
};

export function SegmentedChoice<TValue extends string>({
  label,
  onChange,
  options,
  value,
}: SegmentedChoiceProps<TValue>) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.option, isSelected && styles.selectedOption]}
            >
              <Text style={[styles.optionLabel, isSelected && styles.selectedOptionLabel]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: theme.space.xs,
  },
  label: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.space.xs,
  },
  option: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: theme.space.sm,
  },
  optionLabel: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0,
  },
  selectedOption: {
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.primary,
  },
  selectedOptionLabel: {
    color: theme.colors.primaryPressed,
  },
});
