import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { FormTextField } from "../../shared/ui/FormTextField";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";
import { commonStyles, theme } from "../../shared/ui/design-system";

type AuthScreenProps = {
  error: string | null;
  isConfigured: boolean;
  isSubmitting: boolean;
  message: string | null;
  onContinueAsGuest: () => void;
  onRequestMagicLink: (email: string) => void;
};

export function AuthScreen({
  error,
  isConfigured,
  isSubmitting,
  message,
  onContinueAsGuest,
  onRequestMagicLink,
}: AuthScreenProps) {
  const [email, setEmail] = useState("");

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>로그인</Text>
        <Text style={styles.title}>플랜을 이어갈 계정을 준비할게요</Text>
        <Text style={styles.description}>
          테스트 중에는 게스트로 바로 시작할 수 있고, Supabase 설정 후에는 이메일 링크로 로그인할 수
          있어요.
        </Text>
      </View>

      <View style={styles.form}>
        <FormTextField
          error={error ?? undefined}
          inputMode="email"
          label="이메일"
          onChangeText={setEmail}
          placeholder="you@example.com"
          value={email}
        />
        {message ? <Text style={styles.message}>{message}</Text> : null}
        {!isConfigured ? (
          <Text style={styles.helperText}>
            아직 Supabase 환경 변수가 없어 게스트로 진행할 수 있어요.
          </Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          disabled={isSubmitting}
          label={isSubmitting ? "링크 보내는 중" : "이메일 링크 받기"}
          onPress={() => onRequestMagicLink(email)}
        />
        <Pressable accessibilityRole="button" onPress={onContinueAsGuest} style={styles.secondary}>
          <Text style={styles.secondaryLabel}>게스트로 시작</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
  },
  content: {
    gap: theme.space.xl,
    padding: theme.space.xl,
  },
  header: {
    backgroundColor: theme.colors.ink,
    borderRadius: theme.radius.large,
    gap: theme.space.sm,
    padding: theme.space.lg,
  },
  eyebrow: {
    ...theme.type.eyebrow,
    color: "#B8CFC2",
  },
  title: {
    ...theme.type.title,
    color: theme.colors.white,
  },
  description: {
    ...theme.type.body,
    color: "#D8E0DA",
  },
  form: {
    ...commonStyles.card,
    gap: theme.space.sm,
    padding: theme.space.md,
  },
  helperText: {
    ...theme.type.caption,
    color: theme.colors.muted,
  },
  message: {
    ...theme.type.caption,
    color: theme.colors.primary,
    fontWeight: "800",
  },
  footer: {
    alignItems: "flex-start",
    gap: theme.space.sm,
  },
  secondary: {
    minHeight: 44,
    justifyContent: "center",
  },
  secondaryLabel: {
    ...theme.type.button,
    color: theme.colors.primary,
  },
});
