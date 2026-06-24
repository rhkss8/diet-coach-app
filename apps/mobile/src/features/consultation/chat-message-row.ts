import type { ChatPlannerMessage } from "@diet-coach/ai";

export type ChatMessageRow = {
  attachments: ChatPlannerMessage["attachments"] | [];
  content: string;
  role: ChatPlannerMessage["role"];
  user_id: string;
};

export function toChatMessageRow(message: ChatPlannerMessage, userId: string): ChatMessageRow {
  return {
    attachments: message.attachments ?? [],
    content: message.content,
    role: message.role,
    user_id: userId,
  };
}
