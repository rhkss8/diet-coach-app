import { Pressable, StyleSheet, Text } from "react-native";

import { theme } from "./design-system";

type PrimaryButtonProps = {
  label: string;
  variant?: "ghost" | "primary" | "secondary";
  disabled?: boolean;
  onPress: () => void;
};

export function PrimaryButton({
  disabled = false,
  label,
  onPress,
  variant = "primary",
}: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        variant === "secondary" && styles.secondaryButton,
        variant === "ghost" && styles.ghostButton,
        disabled && styles.disabledButton,
      ]}
    >
      <Text
        style={[
          styles.label,
          variant === "secondary" && styles.secondaryLabel,
          variant === "ghost" && styles.ghostLabel,
          disabled && styles.disabledLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.small,
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: theme.space.lg,
  },
  label: {
    ...theme.type.button,
    color: theme.colors.white,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondarySoft,
  },
  secondaryLabel: {
    color: theme.colors.secondary,
  },
  ghostButton: {
    backgroundColor: "transparent",
    borderColor: theme.colors.borderStrong,
    borderWidth: 1,
  },
  ghostLabel: {
    color: theme.colors.inkSoft,
  },
  disabledButton: {
    backgroundColor: theme.colors.border,
  },
  disabledLabel: {
    color: theme.colors.subtle,
  },
});
