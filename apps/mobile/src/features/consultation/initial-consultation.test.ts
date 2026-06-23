import { describe, expect, it } from "vitest";

import { createInitialConsultationMessages } from "./initial-consultation";

describe("createInitialConsultationMessages", () => {
  it("keeps the initial chat state to one guided welcome bubble", () => {
    const messages = createInitialConsultationMessages();

    expect(messages).toHaveLength(1);
    expect(messages[0]?.role).toBe("assistant");
    expect(messages[0]?.content).toContain("세 가지만");
  });

  it("uses product language instead of visible AI wording in the first bubble", () => {
    const [welcomeMessage] = createInitialConsultationMessages();

    expect(welcomeMessage?.content).not.toContain("AI");
    expect(welcomeMessage?.content).toContain("이어갈 플랜");
  });
});
