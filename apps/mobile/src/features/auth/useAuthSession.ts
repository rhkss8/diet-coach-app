import { useEffect, useMemo, useState } from "react";

import type { Session, SupabaseClient } from "@supabase/supabase-js";

import { getMobileSupabaseClient } from "../../shared/lib/supabase";
import { getAuthGateState, isValidAuthEmail } from "./auth-session";

export function useAuthSession(supabaseClient: SupabaseClient | null = getMobileSupabaseClient()) {
  const [session, setSession] = useState<Session | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isHydratingAuth, setIsHydratingAuth] = useState(true);
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
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

    setIsSubmittingAuth(true);

    const { error } = await supabaseClient.auth.signInWithOtp({
      email: normalizedEmail,
    });

    setIsSubmittingAuth(false);

    if (error) {
      setAuthError(error.message);
      return;
    }

    setAuthMessage("이메일로 로그인 링크를 보냈어요.");
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
    returnToLogin,
    session,
  };
}
