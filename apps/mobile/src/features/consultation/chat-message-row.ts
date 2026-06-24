import type { ChatPlannerAttachment, ChatPlannerMessage } from "@diet-coach/ai";

type StoredChatPlannerAttachment = Omit<ChatPlannerAttachment, "analysisUrl" | "uri">;

export type ChatMessageRow = {
  attachments: StoredChatPlannerAttachment[];
  content: string;
  role: ChatPlannerMessage["role"];
  user_id: string;
};

export function toChatMessageRow(message: ChatPlannerMessage, userId: string): ChatMessageRow {
  return {
    attachments: (message.attachments ?? []).map(toStoredChatPlannerAttachment),
    content: message.content,
    role: message.role,
    user_id: userId,
  };
}

function toStoredChatPlannerAttachment(
  attachment: ChatPlannerAttachment,
): StoredChatPlannerAttachment {
  return {
    id: attachment.id,
    mimeType: attachment.mimeType,
    name: attachment.name,
    sizeBytes: attachment.sizeBytes,
    storagePath: attachment.storagePath,
  };
}
