import { useEffect, useMemo, useState } from "react";
import { Linking } from "react-native";

import type { Session, SupabaseClient } from "@supabase/supabase-js";

import { getMobileSupabaseClient } from "../../shared/lib/supabase";
import {
  authRedirectUrl,
  getAuthGateState,
  getSocialAuthProviderLabel,
  isValidAuthEmail,
  parseAuthCallbackUrl,
  type SocialAuthProvider,
} from "./auth-session";

export function useAuthSession(supabaseClient: SupabaseClient | null = getMobileSupabaseClient()) {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isHydratingAuth, setIsHydratingAuth] = useState(true);
  const [submittingAuthMethod, setSubmittingAuthMethod] = useState<
    "email" | SocialAuthProvider | null
  >(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const isSubmittingAuth = submittingAuthMethod !== null;
  const authGateState = useMemo(
    () => getAuthGateState({ hasSession: Boolean(session), isGuest }),
    [isGuest, session],
  );

  useEffect(() => {
    if (!supabaseClient) {
      setIsHydratingAuth(false);
      return;
    }

    let isMounted = true;

    supabaseClient.auth.getSession().then(({ data }) => {
      if (isMounted) {
        setSession(data.session);
        setIsHydratingAuth(false);
      }
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsGuest(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabaseClient]);

  useEffect(() => {
    if (!supabaseClient) {
      return;
    }

    const client = supabaseClient;

    function handleUrl(url: string) {
      void completeOAuthRedirect(url, client, {
        setAuthError,
        setAuthMessage,
      });
    }

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleUrl(url);
      }
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    return () => {
      subscription.remove();
    };
  }, [supabaseClient]);

  async function requestMagicLink(email: string) {
    const normalizedEmail = email.trim();

    setAuthError(null);
    setAuthMessage(null);

    if (!isValidAuthEmail(normalizedEmail)) {
      setAuthError("이메일 형식을 확인해주세요.");
      return;
    }

    if (!supabaseClient) {
      setAuthError("Supabase 환경 변수가 아직 설정되지 않았어요.");
      return;
    }

    setSubmittingAuthMethod("email");

    const { error } = await supabaseClient.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        emailRedirectTo: authRedirectUrl,
      },
    });

    setSubmittingAuthMethod(null);

    if (error) {
      setAuthError(error.message);
      return;
    }

    setAuthMessage("이메일로 로그인 링크를 보냈어요.");
  }

  async function requestSocialLogin(provider: SocialAuthProvider) {
    setAuthError(null);
    setAuthMessage(null);

    if (!supabaseClient) {
      setAuthError("Supabase 환경 변수가 아직 설정되지 않았어요.");
      return;
    }

    setSubmittingAuthMethod(provider);

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      options: {
        redirectTo: authRedirectUrl,
        skipBrowserRedirect: true,
      },
      provider,
    });

    if (error) {
      setSubmittingAuthMethod(null);
      setAuthError(error.message);
      return;
    }

    if (!data.url) {
      setSubmittingAuthMethod(null);
      setAuthError(`${getSocialAuthProviderLabel(provider)} 로그인 URL을 만들지 못했어요.`);
      return;
    }

    const canOpenUrl = await Linking.canOpenURL(data.url);

    if (!canOpenUrl) {
      setSubmittingAuthMethod(null);
      setAuthError(`${getSocialAuthProviderLabel(provider)} 로그인 창을 열 수 없어요.`);
      return;
    }

    await Linking.openURL(data.url);
    setSubmittingAuthMethod(null);
  }

  function continueAsGuest() {
    setAuthError(null);
    setAuthMessage(null);
    setIsGuest(true);
  }

  async function returnToLogin() {
    setAuthError(null);
    setAuthMessage(null);
    setIsGuest(false);

    if (!session || !supabaseClient) {
      setSession(null);
      return;
    }

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      setAuthError(error.message);
      return;
    }

    setSession(null);
  }

  return {
    authError,
    authGateState,
    authMessage,
    continueAsGuest,
    isAuthConfigured: Boolean(supabaseClient),
    isHydratingAuth,
    isSubmittingAuth,
    requestMagicLink,
    requestSocialLogin,
    returnToLogin,
    session,
    submittingAuthMethod,
  };
}

type OAuthRedirectActions = {
  setAuthError: (message: string | null) => void;
  setAuthMessage: (message: string | null) => void;
};

async function completeOAuthRedirect(
  url: string,
  supabaseClient: SupabaseClient,
  actions: OAuthRedirectActions,
) {
  const callback = parseAuthCallbackUrl(url);

  if (!callback) {
    return;
  }

  const { error } =
    callback.type === "code"
      ? await supabaseClient.auth.exchangeCodeForSession(callback.code)
      : await supabaseClient.auth.setSession({
          access_token: callback.accessToken,
          refresh_token: callback.refreshToken,
        });

  if (error) {
    actions.setAuthError(error.message);
    return;
  }

  actions.setAuthError(null);
  actions.setAuthMessage("로그인되었어요.");
}
