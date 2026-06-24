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

  it("passes planning context and personalization rules to the chat planner", () => {
    const prompt = buildGenerateChatPlannerResponsePrompt({
      messages: [
        {
          content: "저녁 식단 추천해줘",
          id: "message-1",
          role: "user",
        },
      ],
      planningContext: {
        foodContext: {
          allergies: ["새우"],
          avoidedFoods: ["크림소스"],
          foodsToKeep: ["삼각김밥"],
          preferredFoods: ["라면"],
        },
        managementIntent: {
          goalTypes: ["weight_loss"],
          preferredMethods: ["간헐적 단식"],
          reasonText: "체중 감량이 필요해요",
        },
        routineContext: {
          exerciseWindows: [],
          mealWindows: {},
          rawRoutineText: "8시 기상, 11시 점심, 21시 퇴근",
          riskMoments: [],
        },
      },
      todayDate: "2026-06-24",
    });

    const systemMessage = prompt.messages.at(0)?.content;
    const userMessage = prompt.messages.at(1)?.content;

    expect(systemMessage).toContain("primary personalization source");
    expect(userMessage).toContain('"planningContext"');
    expect(userMessage).toContain('"foodsToKeep"');
    expect(userMessage).toContain("삼각김밥");
    expect(userMessage).toContain("Never suggest foods listed in planningContext");
    expect(userMessage).toContain("cite at least one captured user trait");
  });
});
