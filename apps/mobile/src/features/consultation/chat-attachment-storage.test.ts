import { describe, expect, it } from "vitest";

import { createChatAttachmentStoragePath } from "./chat-attachment-path";

describe("chat attachment storage", () => {
  it("creates a user-scoped storage path with a sanitized file name", () => {
    expect(
      createChatAttachmentStoragePath("user-1", {
        id: "attachment-1",
        name: "저녁 식단 사진 @ 1.png",
      }),
    ).toBe("user-1/attachment-1-1.png");
  });

  it("falls back to a stable file name when the original name has no safe characters", () => {
    expect(
      createChatAttachmentStoragePath("user-1", {
        id: "attachment-2",
        name: "한글",
      }),
    ).toBe("user-1/attachment-2-attachment");
  });
});
