export type AiPromptContent =
  | {
      text: string;
      type: "input_text";
    }
  | {
      image_url: string;
      type: "input_image";
    };

export type AiPromptMessage = {
  role: "system" | "user";
  content: AiPromptContent[] | string;
};

export type AiPrompt = {
  messages: AiPromptMessage[];
  responseFormat: {
    type: "json_object";
  };
};
