import { StatusBar } from "expo-status-bar";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import type {
  AdjustTodayPlanOutput,
  AiPlan,
  ChatPlannerMessage,
  ChatPlannerResponse,
} from "@diet-coach/ai";
import type { AdjustmentReason } from "@diet-coach/core";

import { generateMockAdjustedPlan, generateMockChatPlannerResponse } from "@diet-coach/ai";
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
} from "../features/consultation";
import { useApprovedPlanPersistence } from "../features/plan";
import { SettingsScreen } from "../features/settings";
import { TodayScreen } from "../features/today";
import { getTodayPlanDate, getTodayPlanItems } from "../features/today";
import { trackAnalyticsEvent } from "../shared/lib/analytics";

type AppRoute = "adjustment" | "consultation" | "settings" | "today";

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
  } = useAuthSession();
  const [routeHistory, setRouteHistory] = useState<AppRoute[]>(["consultation"]);
  const currentRoute = routeHistory.at(-1) ?? "consultation";
  const [consultationMessages, setConsultationMessages] = useState<ChatPlannerMessage[]>(
    createInitialConsultationMessages,
  );
  const [pendingChatResponse, setPendingChatResponse] = useState<ChatPlannerResponse | null>(null);
  const [selectedAdjustmentReason, setSelectedAdjustmentReason] = useState<
    AdjustmentReason | undefined
  >();
  const [adjustmentNote, setAdjustmentNote] = useState("");
  const [adjustedPlanOutput, setAdjustedPlanOutput] = useState<AdjustTodayPlanOutput | null>(null);
  const [isApprovingAdjustedPlan, setIsApprovingAdjustedPlan] = useState(false);
  const { latestRevisionSnapshot, persistPlanRevision } = usePlanRevisionPersistence();
  const { applyApprovedRevision, approvedPlanSnapshot, isHydratingApprovedPlan, saveApprovedPlan } =
    useApprovedPlanPersistence();

  useEffect(() => {
    trackAnalyticsEvent("CHAT_CONSULTATION_STARTED", {
      userId: "local-user",
    });
  }, []);

  function navigateTo(route: AppRoute) {
    setRouteHistory((history) => [...history, route]);
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
        />
      ) : isHydratingApprovedPlan ? (
        <LoadingPlan />
      ) : currentRoute === "settings" ? (
        <SettingsScreen
          authMode={authGateState === "guest" ? "guest" : "authenticated"}
          onClose={() => navigateBack(setRouteHistory)}
        />
      ) : currentRoute === "adjustment" ? (
        isApprovingAdjustedPlan ? (
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
                  setAdjustmentNote("");
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
              navigateBack(setRouteHistory);
            }}
            output={adjustedPlanOutput}
          />
        ) : (
          <AdjustmentReasonSelectionScreen
            note={adjustmentNote}
            onChangeNote={setAdjustmentNote}
            onBack={() => navigateBack(setRouteHistory)}
            onSelectReason={(reason) => {
              setSelectedAdjustmentReason(reason);
              trackAnalyticsEvent("ADJUSTMENT_REASON_SELECTED", {
                userId: "local-user",
                planId: approvedPlanSnapshot?.plan.id ?? "local-plan",
                affectedDate: approvedPlanSnapshot?.plan.startDate ?? "local-date",
                reason,
              });
            }}
            onSubmitNote={() => {
              const reason = selectedAdjustmentReason ?? "schedule_changed";
              trackAnalyticsEvent("ADJUSTMENT_NOTE_SUBMITTED", {
                userId: "local-user",
                planId: approvedPlanSnapshot?.plan.id ?? "local-plan",
                affectedDate: approvedPlanSnapshot?.plan.startDate ?? "local-date",
                hasNote: adjustmentNote.trim().length > 0,
                reason,
              });
              trackAnalyticsEvent("PLAN_ADJUSTMENT_GENERATION_STARTED", {
                userId: "local-user",
                planId: approvedPlanSnapshot?.plan.id ?? "local-plan",
                affectedDate: approvedPlanSnapshot?.plan.startDate ?? "local-date",
                reason,
              });
              const output = generateMockAdjustedPlan({
                currentPlan: approvedPlanSnapshot?.plan ?? {
                  goalId: "local-goal",
                  startDate: "local-date",
                  endDate: "local-date",
                  summary: "local plan",
                  items: [],
                },
                todayItems: approvedPlanSnapshot
                  ? getTodayPlanItems(approvedPlanSnapshot.plan)
                  : [],
                completedItemIds: [],
                request: {
                  planId: approvedPlanSnapshot?.plan.id ?? "local-plan",
                  affectedDate: approvedPlanSnapshot?.plan.startDate ?? "local-date",
                  reason,
                  note: adjustmentNote.trim() || undefined,
                },
              });
              trackAnalyticsEvent("PLAN_ADJUSTMENT_GENERATION_SUCCEEDED", {
                userId: "local-user",
                planId: output.revision.planId,
                affectedDate: output.revision.affectedDate,
                revisionId: "mock-revision-1",
                reason,
              });
              setAdjustedPlanOutput(output);
            }}
            selectedReason={selectedAdjustmentReason}
          />
        )
      ) : currentRoute === "today" && approvedPlanSnapshot ? (
        <TodayScreen
          onAdjustToday={() => {
            navigateTo("adjustment");
          }}
          onOpenConsultation={() => navigateTo("consultation")}
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
              setConsultationMessages,
              setPendingChatResponse,
              todayDate: getActivePlanDate(approvedPlanSnapshot?.plan),
              navigateToToday: () => navigateTo("today"),
            });
          }}
          onBack={routeHistory.length > 1 ? () => navigateBack(setRouteHistory) : undefined}
          onDismissPendingResponse={() => {
            setPendingChatResponse(null);
          }}
          onOpenPlan={() => {
            if (approvedPlanSnapshot) {
              navigateTo("today");
            }
          }}
          onSendMessage={(message) => {
            const userMessage = createChatMessage("user", message);
            const nextMessages = [...consultationMessages, userMessage];
            const response = generateMockChatPlannerResponse({
              currentPlan: approvedPlanSnapshot?.plan,
              messages: nextMessages,
              todayDate: getActivePlanDate(approvedPlanSnapshot?.plan),
            });

            setConsultationMessages([
              ...nextMessages,
              createChatMessage("assistant", response.message),
            ]);
            setPendingChatResponse(response);
            trackAnalyticsEvent("CHAT_PLANNER_RESPONSE_GENERATED", {
              userId: "local-user",
              responseType: response.type,
            });
          }}
          pendingResponse={pendingChatResponse}
          showPlanAction={Boolean(approvedPlanSnapshot)}
        />
      )}
    </SafeAreaView>
  );
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
  actions.setConsultationMessages((messages) => [
    ...messages,
    createChatMessage("assistant", "좋아요. 승인한 내용을 플랜에 반영했어요."),
  ]);
  trackAnalyticsEvent("CHAT_PLANNER_ACTION_APPROVED", {
    userId: "local-user",
    action: response.confirmation.action,
    responseType: response.type,
    planId: nextPlan.id ?? "chat-plan",
  });
  actions.navigateToToday();
}

function createChatMessage(role: ChatPlannerMessage["role"], content: string): ChatPlannerMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  };
}

function navigateBack(setRouteHistory: Dispatch<SetStateAction<AppRoute[]>>) {
  setRouteHistory((history) => (history.length > 1 ? history.slice(0, -1) : history));
}

function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

function getActivePlanDate(plan: AiPlan | undefined) {
  return plan ? getTodayPlanDate(plan) : getTodayDate();
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
