import type { KeyboardTypeOptions } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

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
        placeholderTextColor="#9AA49D"
        style={[styles.input, multiline && styles.multilineInput, error && styles.inputError]}
        value={value}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D9E0DA",
    borderRadius: 8,
    borderWidth: 1,
    color: "#1F2A24",
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: "#B95E4E",
  },
  multilineInput: {
    minHeight: 92,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  error: {
    color: "#9A4B40",
    fontSize: 13,
    lineHeight: 18,
  },
});
