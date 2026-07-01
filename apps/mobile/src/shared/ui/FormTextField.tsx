import type { KeyboardTypeOptions } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "./design-system";

type FormTextFieldProps = {
  error?: string;
  inputMode?: "email" | "text" | "numeric";
  keyboardType?: KeyboardTypeOptions;
  label: string;
  maxLength?: number;
  multiline?: boolean;
  onChangeText: (value: string) => void;
  placeholder: string;
  suffix?: string;
  value: string;
};

export function FormTextField({
  error,
  inputMode = "text",
  keyboardType,
  label,
  maxLength,
  multiline = false,
  onChangeText,
  placeholder,
  suffix,
  value,
}: FormTextFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[styles.inputShell, multiline && styles.multilineShell, error && styles.inputError]}
      >
        <TextInput
          inputMode={inputMode}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.subtle}
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  inputShell: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 48,
    paddingHorizontal: theme.space.md,
  },
  multilineShell: {
    alignItems: "flex-start",
    minHeight: 92,
    paddingTop: theme.space.sm,
  },
  input: {
    color: theme.colors.ink,
    flex: 1,
    fontSize: 16,
    minHeight: 44,
    outlineStyle: "none" as never,
    paddingVertical: theme.space.xs,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  multilineInput: {
    minHeight: 78,
    paddingTop: 0,
    textAlignVertical: "top",
  },
  suffix: {
    color: theme.colors.muted,
    fontSize: 14,
    fontWeight: "800",
    lineHeight: 20,
  },
  error: {
    color: theme.colors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
});
