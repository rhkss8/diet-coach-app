import { describe, expect, it } from "vitest";

import type { GenerateChatPlannerResponseInput } from "../contracts";
import { buildGenerateChatPlannerResponsePrompt } from "./generate-chat-planner-response-prompt";

describe("buildGenerateChatPlannerResponsePrompt", () => {
  it("passes latest image attachments as image input without leaking transient URLs into text", () => {
    const input: GenerateChatPlannerResponseInput = {
      messages: [
        {
          attachments: [
            {
              analysisUrl: "https://signed.example.com/storage/image.png",
              id: "attachment-1",
              mimeType: "image/png",
              name: "meal.png",
              sizeBytes: 1234,
              storagePath: "user-1/attachment-1-meal.png",
              uri: "file:///local/meal.png",
            },
          ],
          content: "이 음식 기준으로 저녁 조정해줘",
          id: "message-1",
          role: "user",
        },
      ],
      todayDate: "2026-06-24",
    };

    const prompt = buildGenerateChatPlannerResponsePrompt(input);
    const userMessage = prompt.messages.at(1);

    expect(userMessage?.content).toEqual(
      expect.arrayContaining([
        {
          image_url: "https://signed.example.com/storage/image.png",
          type: "input_image",
        },
      ]),
    );
    const textContent = Array.isArray(userMessage?.content) ? userMessage.content.at(0) : null;

    expect(textContent).toEqual(expect.objectContaining({ type: "input_text" }));
    expect(JSON.stringify(textContent)).not.toContain("file:///local/meal.png");
    expect(JSON.stringify(textContent)).not.toContain("signed.example.com");
  });

  it("keeps text-only prompts as a string", () => {
    const prompt = buildGenerateChatPlannerResponsePrompt({
      messages: [
        {
          content: "오늘 저녁 추천해줘",
          id: "message-1",
          role: "user",
        },
      ],
      todayDate: "2026-06-24",
    });

    expect(typeof prompt.messages.at(1)?.content).toBe("string");
  });
});
