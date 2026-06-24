import type { ChatPlannerMessage } from "@diet-coach/ai";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getMobileSupabaseClient } from "../../shared/lib/supabase";
import { toChatMessageRow } from "./chat-message-row";

type SaveChatMessageInput = {
  message: ChatPlannerMessage;
  supabaseClient?: SupabaseClient | null;
  userId?: string;
};

export async function saveChatMessage({
  message,
  supabaseClient = getMobileSupabaseClient(),
  userId,
}: SaveChatMessageInput) {
  if (!supabaseClient || !userId) {
    return false;
  }

  const { error } = await supabaseClient
    .from("chat_messages")
    .insert(toChatMessageRow(message, userId));

  return !error;
}
