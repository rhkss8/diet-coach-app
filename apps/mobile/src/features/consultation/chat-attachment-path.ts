import type { ChatPlannerAttachment } from "@diet-coach/ai";

export function createChatAttachmentStoragePath(
  userId: string,
  attachment: Pick<ChatPlannerAttachment, "id" | "name">,
) {
  return `${userId}/${attachment.id}-${sanitizeAttachmentFileName(attachment.name)}`;
}

function sanitizeAttachmentFileName(fileName: string) {
  const sanitizedFileName = fileName
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitizedFileName || "attachment";
}
