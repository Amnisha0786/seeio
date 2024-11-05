import decamelizeKeys from "decamelize-keys";
import { AiApi } from "./endpoint";

type TSendChatMessagePayload = {
  query: string
  csvAttachment?: string
  isInitialMessage: boolean
  chatContext?: TChatContext
  userData?: any
  updateData?: any
}

type TChatContext = TChatMessage[];

type TChatMessage = {
  role: string
  content: string
  toolCalls?: any[]
  toolCallId?: string
}


export const sendChatMessage = (payload: TSendChatMessagePayload): Promise<{ chatContext: TChatContext, newRisks?: any }> => {
  return AiApi.post('/risk/new', decamelizeKeys(payload));
};

export const sendVisionChatMessage = (payload: TSendChatMessagePayload): Promise<{ chatContext: TChatContext, updateData: any }> => {
  return AiApi.post('/vision-purpose/setup', decamelizeKeys(payload));
};

export const sendObejectiveChatMessage = (payload: TSendChatMessagePayload): Promise<{ chatContext: TChatContext, newObjectives?: any }> => {
  return AiApi.post('/objectives/setup', decamelizeKeys(payload));
};
