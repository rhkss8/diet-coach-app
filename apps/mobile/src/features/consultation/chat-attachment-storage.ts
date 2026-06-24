import type { ChatPlannerAttachment } from "@diet-coach/ai";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getMobileSupabaseClient } from "../../shared/lib/supabase";
import { createChatAttachmentStoragePath } from "./chat-attachment-path";

const CHAT_ATTACHMENT_BUCKET = "chat-attachments";
const CHAT_ATTACHMENT_SIGNED_URL_SECONDS = 60 * 10;

type UploadChatAttachmentsInput = {
  attachments: ChatPlannerAttachment[];
  supabaseClient?: SupabaseClient | null;
  userId?: string;
};

export async function uploadChatAttachments({
  attachments,
  supabaseClient = getMobileSupabaseClient(),
  userId,
}: UploadChatAttachmentsInput): Promise<ChatPlannerAttachment[]> {
  if (!attachments.length || !supabaseClient || !userId) {
    return attachments;
  }

  const uploadedAttachments = await Promise.all(
    attachments.map((attachment) =>
      uploadChatAttachment({
        attachment,
        supabaseClient,
        userId,
      }),
    ),
  );

  return uploadedAttachments;
}

async function uploadChatAttachment({
  attachment,
  supabaseClient,
  userId,
}: {
  attachment: ChatPlannerAttachment;
  supabaseClient: SupabaseClient;
  userId: string;
}): Promise<ChatPlannerAttachment> {
  if (!attachment.uri || attachment.storagePath) {
    return addChatAttachmentAnalysisUrl({
      attachment,
      supabaseClient,
    });
  }

  const storagePath = createChatAttachmentStoragePath(userId, attachment);

  try {
    const response = await fetch(attachment.uri);
    const fileBody = await response.blob();
    const { error: uploadError } = await supabaseClient.storage
      .from(CHAT_ATTACHMENT_BUCKET)
      .upload(storagePath, fileBody, {
        contentType: attachment.mimeType ?? "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      return attachment;
    }

    const { error: metadataError } = await supabaseClient.from("attachments").insert({
      mime_type: attachment.mimeType,
      name: attachment.name,
      size_bytes: attachment.sizeBytes,
      storage_path: storagePath,
      user_id: userId,
    });

    if (metadataError) {
      return attachment;
    }

    return {
      ...(await addChatAttachmentAnalysisUrl({
        attachment,
        supabaseClient,
        storagePath,
      })),
      storagePath,
    };
  } catch {
    return attachment;
  }
}

async function addChatAttachmentAnalysisUrl({
  attachment,
  storagePath = attachment.storagePath,
  supabaseClient,
}: {
  attachment: ChatPlannerAttachment;
  storagePath?: string;
  supabaseClient: SupabaseClient;
}): Promise<ChatPlannerAttachment> {
  if (!storagePath || !isImageAttachment(attachment)) {
    return attachment;
  }

  const { data, error } = await supabaseClient.storage
    .from(CHAT_ATTACHMENT_BUCKET)
    .createSignedUrl(storagePath, CHAT_ATTACHMENT_SIGNED_URL_SECONDS);

  if (error || !data?.signedUrl) {
    return {
      ...attachment,
      storagePath,
    };
  }

  return {
    ...attachment,
    analysisUrl: data.signedUrl,
    storagePath,
  };
}

function isImageAttachment(attachment: ChatPlannerAttachment) {
  return attachment.mimeType?.startsWith("image/") ?? false;
}
