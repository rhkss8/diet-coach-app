import { describe, expect, it } from "vitest";

import { toChatMessageRow } from "./chat-message-row";

describe("chat message storage", () => {
  it("maps chat messages to Supabase rows", () => {
    expect(
      toChatMessageRow(
        {
          attachments: [
            {
              analysisUrl: "https://signed.example.com/storage/meal.png",
              id: "attachment-1",
              name: "meal.png",
              mimeType: "image/png",
              sizeBytes: 1200,
              storagePath: "user-1/attachment-1-meal.png",
              uri: "file:///local/meal.png",
            },
          ],
          content: "이 식단 기준으로 봐줘",
          id: "message-1",
          role: "user",
        },
        "user-1",
      ),
    ).toEqual({
      attachments: [
        {
          id: "attachment-1",
          name: "meal.png",
          mimeType: "image/png",
          sizeBytes: 1200,
          storagePath: "user-1/attachment-1-meal.png",
        },
      ],
      content: "이 식단 기준으로 봐줘",
      role: "user",
      user_id: "user-1",
    });
  });

  it("stores an empty attachment list when the message has no attachments", () => {
    expect(
      toChatMessageRow(
        {
          content: "좋아요",
          id: "message-2",
          role: "assistant",
        },
        "user-1",
      ).attachments,
    ).toEqual([]);
  });
});
