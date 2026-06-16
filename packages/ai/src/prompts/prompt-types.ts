export type AiPromptMessage = {
  role: "system" | "user";
  content: string;
};

export type AiPrompt = {
  messages: AiPromptMessage[];
  responseFormat: {
    type: "json_object";
  };
};
