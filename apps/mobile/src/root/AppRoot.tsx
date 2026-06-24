import { StatusBar } from "expo-status-bar";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import type {
  AdjustTodayPlanOutput,
  AiPlan,
  ChatPlannerAttachment,
  ChatPlannerMessage,
  ChatPlannerResponse,
  PlanningContext,
} from "@diet-coach/ai";
import type { AdjustmentReason } from "@diet-coach/core";

import {
  AdjustmentReasonSelectionScreen,
  createPlanRevisionId,
  RevisedPlanReviewScreen,
  usePlanRevisionPersistence,
} from "../features/adjustment";
import { AuthScreen, useAuthSession } from "../features/auth";
import {
  applyChatPlannerResponseToPlan,
  ConsultationChatScreen,
  createInitialConsultationMessages,
  saveChatMessage,
  savePlanningContext,
} from "../features/consultation";
import { useApprovedPlanPersistence } from "../features/plan";
import { SettingsScreen } from "../features/settings";
import { TodayScreen } from "../features/today";
import { getTodayPlanDate, getTodayPlanItems } from "../features/today";
import {
  adjustTodayPlanWithAiFunction,
  generateChatPlannerResponseWithAiFunction,
} from "../shared/lib/ai-plan-function";
import { trackAnalyticsEvent } from "../shared/lib/analytics";
import {
  canPopAppRoute,
  type AppRoute,
  initialAppRouteHistory,
  popAppRoute,
  pushAppRoute,
} from "./app-route-history";

export function AppRoot() {
  const {
    authError,
    authGateState,
    authMessage,
    continueAsGuest,
    isAuthConfigured,
    isHydratingAuth,
    isSubmittingAuth,
    requestMagicLink,
    requestSocialLogin,
    returnToLogin,
    session,
    submittingAuthMethod,
  } = useAuthSession();
  const [routeHistory, setRouteHistory] = useState<AppRoute[]>(initialAppRouteHistory);
  const currentRoute = routeHistory.at(-1) ?? "consultation";
  const [consultationMessages, setConsultationMessages] = useState<ChatPlannerMessage[]>(
    createInitialConsultationMessages,
  );
  const [planningContext, setPlanningContext] = useState<PlanningContext | undefined>();
  const [pendingChatResponse, setPendingChatResponse] = useState<ChatPlannerResponse | null>(null);
  const [selectedAdjustmentReason, setSelectedAdjustmentReason] = useState<
    AdjustmentReason | undefined
  >();
  const [adjustedPlanOutput, setAdjustedPlanOutput] = useState<AdjustTodayPlanOutput | null>(null);
  const [adjustmentGenerationError, setAdjustmentGenerationError] = useState<string | undefined>();
  const [isGeneratingAdjustedPlan, setIsGeneratingAdjustedPlan] = useState(false);
  const [isGeneratingChatResponse, setIsGeneratingChatResponse] = useState(false);
  const [isApprovingAdjustedPlan, setIsApprovingAdjustedPlan] = useState(false);
  const { latestRevisionSnapshot, persistPlanRevision } = usePlanRevisionPersistence({
    userId: session?.user.id,
  });
  const { applyApprovedRevision, approvedPlanSnapshot, isHydratingApprovedPlan, saveApprovedPlan } =
    useApprovedPlanPersistence({ userId: session?.user.id });

  useEffect(() => {
    trackAnalyticsEvent("CHAT_CONSULTATION_STARTED", {
      userId: "local-user",
    });
  }, []);

  function navigateTo(route: AppRoute) {
    setRouteHistory((history) => pushAppRoute(history, route));
  }

  function goBack() {
    if (canPopAppRoute(routeHistory)) {
      navigateBack(setRouteHistory);
      return;
    }

    setRouteHistory(initialAppRouteHistory);
    void returnToLogin();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      {isHydratingAuth ? (
        <LoadingAuth />
      ) : authGateState === "requires_auth" ? (
        <AuthScreen
          error={authError}
          isConfigured={isAuthConfigured}
          isSubmitting={isSubmittingAuth}
          message={authMessage}
          onContinueAsGuest={continueAsGuest}
          onRequestMagicLink={(email) => {
            void requestMagicLink(email);
          }}
          onRequestSocialLogin={(provider) => {
            void requestSocialLogin(provider);
          }}
          submittingAuthMethod={submittingAuthMethod}
        />
      ) : isHydratingApprovedPlan ? (
        <LoadingPlan />
      ) : currentRoute === "settings" ? (
        <SettingsScreen
          authMode={authGateState === "guest" ? "guest" : "authenticated"}
          onClose={goBack}
        />
      ) : currentRoute === "adjustment" ? (
        isGeneratingAdjustedPlan ? (
          <GeneratingAdjustedPlan />
        ) : isApprovingAdjustedPlan ? (
          <ApprovingAdjustedPlan />
        ) : adjustedPlanOutput ? (
          <RevisedPlanReviewScreen
            onApprove={() => {
              void approveAdjustedPlan(adjustedPlanOutput.revision, {
                applyApprovedRevision,
                persistPlanRevision,
                trackRevisionApproved: (revisionId) => {
                  const revision = adjustedPlanOutput.revision;

                  trackAnalyticsEvent("PLAN_REVISION_APPROVED", {
                    userId: "local-user",
                    planId: revision.planId,
                    affectedDate: revision.affectedDate,
                    revisionId,
                    reason: revision.reason,
                  });
                },
                resetAdjustmentFlow: () => {
                  setAdjustedPlanOutput(null);
                  setSelectedAdjustmentReason(undefined);
                  navigateTo("today");
                },
                setIsApprovingAdjustedPlan,
              });
            }}
            onBack={() => {
              setAdjustedPlanOutput(null);
            }}
            onDismiss={() => {
              const revision = adjustedPlanOutput.revision;

              trackAnalyticsEvent("PLAN_REVISION_DISMISSED", {
                userId: "local-user",
                planId: revision.planId,
                affectedDate: revision.affectedDate,
                revisionId: createPlanRevisionId(revision),
                reason: revision.reason,
              });
              goBack();
            }}
            output={adjustedPlanOutput}
          />
        ) : (
          <AdjustmentReasonSelectionScreen
            errorMessage={adjustmentGenerationError}
            onBack={goBack}
            onSelectReason={(reason) => {
              setAdjustmentGenerationError(undefined);
              setSelectedAdjustmentReason(reason);
              trackAnalyticsEvent("ADJUSTMENT_REASON_SELECTED", {
                userId: "local-user",
                planId: approvedPlanSnapshot?.plan.id ?? "local-plan",
                affectedDate: approvedPlanSnapshot?.plan.startDate ?? "local-date",
                reason,
              });
            }}
            onSubmitReason={() => {
              if (!selectedAdjustmentReason) {
                return;
              }

              const reason = selectedAdjustmentReason;
              trackAnalyticsEvent("ADJUSTMENT_NOTE_SUBMITTED", {
                userId: "local-user",
                planId: approvedPlanSnapshot?.plan.id ?? "local-plan",
                affectedDate: approvedPlanSnapshot?.plan.startDate ?? "local-date",
                hasNote: false,
                reason,
              });
              trackAnalyticsEvent("PLAN_ADJUSTMENT_GENERATION_STARTED", {
                userId: "local-user",
                planId: approvedPlanSnapshot?.plan.id ?? "local-plan",
                affectedDate: approvedPlanSnapshot?.plan.startDate ?? "local-date",
                reason,
              });
              void generateAdjustedPlan(reason, {
                approvedPlan: approvedPlanSnapshot?.plan ?? null,
                setAdjustedPlanOutput,
                setAdjustmentGenerationError,
                setConsultationMessages,
                setIsGeneratingAdjustedPlan,
              });
            }}
            selectedReason={selectedAdjustmentReason}
          />
        )
      ) : currentRoute === "today" && approvedPlanSnapshot ? (
        <TodayScreen
          onAdjustToday={() => {
            navigateTo("adjustment");
          }}
          onOpenConsultation={goBack}
          onOpenSettings={() => navigateTo("settings")}
          plan={approvedPlanSnapshot.plan}
          revisionContext={
            latestRevisionSnapshot
              ? {
                  revisedPlanItemIds: latestRevisionSnapshot.revision.changedItemIds,
                  revisionId: latestRevisionSnapshot.revisionId,
                }
              : undefined
          }
        />
      ) : (
        <ConsultationChatScreen
          messages={consultationMessages}
          onApproveResponse={(response) => {
            void approveChatPlannerResponse(response, {
              currentPlan: approvedPlanSnapshot?.plan ?? null,
              persistPlanRevision,
              saveApprovedPlan,
              saveChatMessage: (message) => saveChatMessage({ message, userId: session?.user.id }),
              setConsultationMessages,
              setPendingChatResponse,
              todayDate: getActivePlanDate(approvedPlanSnapshot?.plan),
              navigateToToday: () => navigateTo("today"),
            });
          }}
          onBack={goBack}
          onDismissPendingResponse={() => {
            setPendingChatResponse(null);
          }}
          onOpenPlan={() => {
            if (approvedPlanSnapshot) {
              navigateTo("today");
            }
          }}
          onSendMessage={(message, attachments, submittedPlanningContext) => {
            const userMessage = createChatMessage("user", message, attachments);
            const nextMessages = [...consultationMessages, userMessage];
            const nextPlanningContext = submittedPlanningContext ?? planningContext;

            if (submittedPlanningContext) {
              setPlanningContext(submittedPlanningContext);
              void savePlanningContext({
                context: submittedPlanningContext,
                userId: session?.user.id,
              });
            }

            setConsultationMessages(nextMessages);
            void saveChatMessage({ message: userMessage, userId: session?.user.id });
            void generateChatResponse({
              currentPlan: approvedPlanSnapshot?.plan,
              messages: nextMessages,
              planningContext: nextPlanningContext,
              saveChatMessage: (chatMessage) =>
                saveChatMessage({ message: chatMessage, userId: session?.user.id }),
              setConsultationMessages,
              setIsGeneratingChatResponse,
              setPendingChatResponse,
              todayDate: getActivePlanDate(approvedPlanSnapshot?.plan),
            });
          }}
          isGeneratingResponse={isGeneratingChatResponse}
          pendingResponse={pendingChatResponse}
          showPlanAction={Boolean(approvedPlanSnapshot)}
        />
      )}
    </SafeAreaView>
  );
}

type GenerateAdjustedPlanActions = {
  approvedPlan: AiPlan | null;
  setAdjustedPlanOutput: (output: AdjustTodayPlanOutput | null) => void;
  setAdjustmentGenerationError: (message: string | undefined) => void;
  setConsultationMessages: Dispatch<SetStateAction<ChatPlannerMessage[]>>;
  setIsGeneratingAdjustedPlan: (isGenerating: boolean) => void;
};

async function generateAdjustedPlan(
  reason: AdjustmentReason,
  actions: GenerateAdjustedPlanActions,
) {
  const approvedPlan = actions.approvedPlan;

  if (!approvedPlan) {
    trackAnalyticsEvent("PLAN_ADJUSTMENT_GENERATION_FAILED", {
      userId: "local-user",
      planId: "local-plan",
      affectedDate: "local-date",
      reason,
      errorCode: "plan_not_available",
    });
    actions.setAdjustmentGenerationError(
      "승인된 플랜을 찾지 못했어요. 플랜을 먼저 만든 뒤 다시 시도해 주세요.",
    );
    return;
  }

  actions.setAdjustmentGenerationError(undefined);
  actions.setIsGeneratingAdjustedPlan(true);

  const result = await adjustTodayPlanWithAiFunction({
    completedItemIds: [],
    currentPlan: approvedPlan,
    request: {
      affectedDate: getTodayPlanDate(approvedPlan),
      planId: approvedPlan.id ?? "local-plan",
      reason,
    },
    todayItems: getTodayPlanItems(approvedPlan),
  });

  actions.setIsGeneratingAdjustedPlan(false);

  if (!result.ok) {
    trackAnalyticsEvent("PLAN_ADJUSTMENT_GENERATION_FAILED", {
      userId: "local-user",
      planId: approvedPlan.id ?? "local-plan",
      affectedDate: getTodayPlanDate(approvedPlan),
      reason,
      errorCode: result.errorCode,
    });
    actions.setConsultationMessages((messages) => [
      ...messages,
      createChatMessage("assistant", getAiFailureMessage(result.errorCode)),
    ]);
    actions.setAdjustmentGenerationError(getAiFailureMessage(result.errorCode));
    return;
  }

  trackAnalyticsEvent("PLAN_ADJUSTMENT_GENERATION_SUCCEEDED", {
    userId: "local-user",
    planId: result.output.revision.planId,
    affectedDate: result.output.revision.affectedDate,
    revisionId: createPlanRevisionId(result.output.revision),
    reason,
  });
  actions.setAdjustedPlanOutput(result.output);
}

type GenerateChatResponseActions = {
  currentPlan?: AiPlan;
  messages: ChatPlannerMessage[];
  planningContext?: PlanningContext;
  saveChatMessage: (message: ChatPlannerMessage) => Promise<boolean>;
  setConsultationMessages: Dispatch<SetStateAction<ChatPlannerMessage[]>>;
  setIsGeneratingChatResponse: (isGenerating: boolean) => void;
  setPendingChatResponse: (response: ChatPlannerResponse | null) => void;
  todayDate: string;
};

async function generateChatResponse(actions: GenerateChatResponseActions) {
  actions.setIsGeneratingChatResponse(true);
  actions.setPendingChatResponse(null);

  const result = await generateChatPlannerResponseWithAiFunction({
    currentPlan: actions.currentPlan,
    messages: actions.messages,
    planningContext: actions.planningContext,
    todayDate: actions.todayDate,
  });

  actions.setIsGeneratingChatResponse(false);

  if (!result.ok) {
    const assistantMessage = createChatMessage("assistant", getAiFailureMessage(result.errorCode));

    actions.setConsultationMessages((messages) => [...messages, assistantMessage]);
    void actions.saveChatMessage(assistantMessage);
    return;
  }

  const assistantMessage = createChatMessage("assistant", result.output.message);

  actions.setConsultationMessages((messages) => [...messages, assistantMessage]);
  void actions.saveChatMessage(assistantMessage);
  actions.setPendingChatResponse(result.output);
  trackAnalyticsEvent("CHAT_PLANNER_RESPONSE_GENERATED", {
    userId: "local-user",
    responseType: result.output.type,
  });
}

type ApproveAdjustedPlanActions = {
  applyApprovedRevision: (revision: AdjustTodayPlanOutput["revision"]) => Promise<unknown>;
  persistPlanRevision: (revision: AdjustTodayPlanOutput["revision"]) => Promise<void>;
  resetAdjustmentFlow: () => void;
  setIsApprovingAdjustedPlan: (isApproving: boolean) => void;
  trackRevisionApproved: (revisionId: string) => void;
};

async function approveAdjustedPlan(
  revision: AdjustTodayPlanOutput["revision"],
  actions: ApproveAdjustedPlanActions,
) {
  actions.setIsApprovingAdjustedPlan(true);

  try {
    await actions.persistPlanRevision(revision);
    await actions.applyApprovedRevision(revision);
    actions.trackRevisionApproved(createPlanRevisionId(revision));
    actions.resetAdjustmentFlow();
  } finally {
    actions.setIsApprovingAdjustedPlan(false);
  }
}

type ApproveChatPlannerResponseActions = {
  currentPlan: AiPlan | null;
  navigateToToday: () => void;
  persistPlanRevision: (revision: AdjustTodayPlanOutput["revision"]) => Promise<void>;
  saveApprovedPlan: (plan: AiPlan) => Promise<void>;
  saveChatMessage: (message: ChatPlannerMessage) => Promise<boolean>;
  setConsultationMessages: Dispatch<SetStateAction<ChatPlannerMessage[]>>;
  setPendingChatResponse: (response: ChatPlannerResponse | null) => void;
  todayDate: string;
};

async function approveChatPlannerResponse(
  response: ChatPlannerResponse,
  actions: ApproveChatPlannerResponseActions,
) {
  const nextPlan = applyChatPlannerResponseToPlan(response, actions.currentPlan, actions.todayDate);

  if (!nextPlan || response.type === "clarification_question") {
    return;
  }

  if (response.type === "plan_revision_suggestion") {
    await actions.persistPlanRevision(response.revision);
    trackAnalyticsEvent("PLAN_REVISION_APPROVED", {
      userId: "local-user",
      planId: response.revision.planId,
      affectedDate: response.revision.affectedDate,
      revisionId: createPlanRevisionId(response.revision),
      reason: response.revision.reason,
    });
  }

  await actions.saveApprovedPlan(nextPlan);
  actions.setPendingChatResponse(null);
  const assistantMessage = createChatMessage(
    "assistant",
    "좋아요. 승인한 내용을 플랜에 반영했어요.",
  );

  actions.setConsultationMessages((messages) => [...messages, assistantMessage]);
  void actions.saveChatMessage(assistantMessage);
  trackAnalyticsEvent("CHAT_PLANNER_ACTION_APPROVED", {
    userId: "local-user",
    action: response.confirmation.action,
    responseType: response.type,
    planId: nextPlan.id ?? "chat-plan",
  });
  actions.navigateToToday();
}

function createChatMessage(
  role: ChatPlannerMessage["role"],
  content: string,
  attachments?: ChatPlannerAttachment[],
): ChatPlannerMessage {
  return {
    attachments: attachments?.length ? attachments : undefined,
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  };
}

function navigateBack(setRouteHistory: Dispatch<SetStateAction<AppRoute[]>>) {
  setRouteHistory((history) => popAppRoute(history));
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getActivePlanDate(plan: AiPlan | undefined) {
  return plan ? getTodayPlanDate(plan) : getTodayDate();
}

function getAiFailureMessage(errorCode: string) {
  if (errorCode === "ai_not_configured") {
    return "실제 플랜 생성 연결이 아직 설정되지 않았어요. OpenAI 실행 환경을 확인한 뒤 다시 시도해 주세요.";
  }

  return "지금은 플랜 제안을 만들지 못했어요. 잠시 후 다시 시도해 주세요.";
}

function GeneratingAdjustedPlan() {
  return (
    <View style={styles.completedContent}>
      <Text style={styles.eyebrow}>조정안 생성 중</Text>
      <Text style={styles.title}>오늘 플랜을 다시 맞추고 있어요</Text>
    </View>
  );
}

function ApprovingAdjustedPlan() {
  return (
    <View style={styles.completedContent}>
      <Text style={styles.eyebrow}>조정안 저장됨</Text>
      <Text style={styles.title}>오늘 플랜에 반영하고 있어요</Text>
    </View>
  );
}

function LoadingPlan() {
  return (
    <View style={styles.completedContent}>
      <Text style={styles.eyebrow}>불러오는 중</Text>
      <Text style={styles.title}>저장된 플랜을 확인하고 있어요</Text>
    </View>
  );
}

function LoadingAuth() {
  return (
    <View style={styles.completedContent}>
      <Text style={styles.eyebrow}>로그인 확인 중</Text>
      <Text style={styles.title}>저장된 세션을 확인하고 있어요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F7F4",
  },
  completedContent: {
    flex: 1,
    justifyContent: "center",
    gap: 18,
    paddingHorizontal: 24,
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
});
