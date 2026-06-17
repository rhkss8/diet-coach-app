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
  value,
}: FormTextFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        inputMode={inputMode}
        keyboardType={keyboardType}
        maxLength={maxLength}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.subtle}
        style={[styles.input, multiline && styles.multilineInput, error && styles.inputError]}
        value={value}
      />
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
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    color: theme.colors.ink,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: theme.space.md,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  multilineInput: {
    minHeight: 92,
    paddingTop: theme.space.sm,
    textAlignVertical: "top",
  },
  error: {
    color: theme.colors.danger,
    fontSize: 13,
    lineHeight: 18,
  },
});
