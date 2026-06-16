import { Pressable, StyleSheet, Text, View } from "react-native";

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
    gap: 8,
  },
  label: {
    color: "#26342C",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9E0DA",
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 42,
    justifyContent: "center",
    paddingHorizontal: 12,
  },
  optionLabel: {
    color: "#526057",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
  selectedOption: {
    backgroundColor: "#E6F0EA",
    borderColor: "#2F6B4F",
  },
  selectedOptionLabel: {
    color: "#245A42",
  },
});
