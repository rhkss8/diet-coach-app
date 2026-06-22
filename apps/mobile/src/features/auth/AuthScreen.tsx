import { useState } from "react";
import { ArrowRight } from "lucide-react-native";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { theme } from "../../shared/ui/design-system";
import { PlannerBrandRow } from "../../shared/ui/planner-components";

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
  const canRequestLink = email.trim().length > 0 && !isSubmitting;

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <PlannerBrandRow />

      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>로그인</Text>
        <Text style={styles.title}>플랜을 이어갈{"\n"}계정을 준비할게요.</Text>
        <Text style={styles.description}>
          테스트 중에는 게스트로 바로 시작할 수 있고,{"\n"}Supabase 설정 후에는 이메일 링크로{"\n"}
          로그인할 수 있어요.
        </Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.fieldLabel}>이메일</Text>
        {message ? (
          <View style={styles.sentCard}>
            <Text style={styles.sentTitle}>링크를 보냈어요</Text>
            <Text style={styles.sentDescription}>{email} 메일함을 확인해 주세요.</Text>
          </View>
        ) : (
          <>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              inputMode="email"
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.subtle}
              style={[styles.emailInput, email.trim().length > 0 && styles.emailInputActive]}
              value={email}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {!isConfigured ? (
              <Text style={styles.helperText}>
                아직 Supabase 환경 변수가 없어 게스트로 진행할 수 있어요.
              </Text>
            ) : null}
          </>
        )}
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          disabled={!canRequestLink}
          onPress={() => onRequestMagicLink(email)}
          style={[styles.primaryAction, !canRequestLink && styles.disabledPrimaryAction]}
        >
          <Text style={[styles.primaryActionText, !canRequestLink && styles.disabledActionText]}>
            {isSubmitting ? "링크 보내는 중" : "이메일 링크 받기"}
          </Text>
          {!isSubmitting ? (
            <ArrowRight
              color={canRequestLink ? theme.colors.surface : theme.colors.muted}
              size={15}
              strokeWidth={2}
            />
          ) : null}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={onContinueAsGuest}
          style={styles.guestAction}
        >
          <Text style={styles.guestActionText}>게스트로 시작</Text>
        </Pressable>
      </View>

      <View style={styles.footerNote}>
        <Text style={styles.footerNoteText}>"오늘 플랜은 아직 살아 있어요."</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: theme.colors.background,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: theme.space.xl,
    paddingTop: theme.space.xl,
  },
  heroCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    gap: theme.space.sm,
    marginTop: theme.space.xl,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.xl,
  },
  eyebrow: {
    ...theme.type.eyebrow,
    color: "rgba(230, 239, 230, 0.65)",
    fontSize: 10,
    lineHeight: 14,
  },
  title: {
    color: theme.colors.surface,
    fontFamily: "serif",
    fontSize: 22,
    fontWeight: "400",
    lineHeight: 34,
  },
  description: {
    color: "rgba(230, 239, 230, 0.75)",
    fontSize: 12,
    lineHeight: 20,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: theme.space.md,
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.lg,
  },
  fieldLabel: {
    color: theme.colors.subtle,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0,
    lineHeight: 14,
    marginBottom: theme.space.xs,
    textTransform: "uppercase",
  },
  emailInput: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    color: theme.colors.ink,
    fontSize: 13,
    minHeight: 46,
    paddingHorizontal: theme.space.md,
  },
  emailInputActive: {
    borderColor: theme.colors.primary,
  },
  helperText: {
    color: theme.colors.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 11,
    lineHeight: 16,
    marginTop: theme.space.xs,
  },
  sentCard: {
    alignItems: "center",
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.medium,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.md,
  },
  sentTitle: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    marginBottom: 2,
  },
  sentDescription: {
    color: theme.colors.subtle,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
  },
  actions: {
    gap: theme.space.sm,
    marginTop: theme.space.lg,
  },
  primaryAction: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.large,
    flexDirection: "row",
    gap: theme.space.xs,
    minHeight: 52,
    justifyContent: "center",
  },
  disabledPrimaryAction: {
    backgroundColor: theme.colors.backgroundAlt,
  },
  primaryActionText: {
    color: theme.colors.surface,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  disabledActionText: {
    color: theme.colors.muted,
  },
  guestAction: {
    alignItems: "center",
    minHeight: 42,
    justifyContent: "center",
  },
  guestActionText: {
    color: theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  footerNote: {
    flex: 1,
    justifyContent: "flex-end",
    minHeight: 120,
  },
  footerNoteText: {
    color: theme.colors.muted,
    fontSize: 11,
    fontStyle: "italic",
    lineHeight: 16,
    textAlign: "center",
  },
});
