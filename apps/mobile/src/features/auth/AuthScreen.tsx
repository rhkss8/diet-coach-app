import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { FormTextField } from "../../shared/ui/FormTextField";
import { PrimaryButton } from "../../shared/ui/PrimaryButton";

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
    backgroundColor: "#F8F7F4",
  },
  content: {
    gap: 28,
    padding: 24,
  },
  header: {
    gap: 12,
    paddingTop: 24,
  },
  eyebrow: {
    color: "#5E7664",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0,
  },
  title: {
    color: "#1F2A24",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 38,
  },
  description: {
    color: "#526056",
    fontSize: 16,
    lineHeight: 23,
  },
  form: {
    gap: 12,
  },
  helperText: {
    color: "#6E7B72",
    fontSize: 13,
    lineHeight: 19,
  },
  message: {
    color: "#2F6B4F",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
  },
  footer: {
    alignItems: "flex-start",
    gap: 14,
  },
  secondary: {
    minHeight: 44,
    justifyContent: "center",
  },
  secondaryLabel: {
    color: "#2F6B4F",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0,
  },
});
