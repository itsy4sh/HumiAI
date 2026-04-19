/** biome-ignore-all lint/suspicious/useAwait: <explanation */
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { createChunk } from './chunk';
import { SYSTEM_PROMPT } from './promt';

export async function* streamLLM(messages: any[]) {
  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
  });

  const id = 'chatcmpl-' + crypto.randomUUID();

  for await (const textPart of result.textStream) {
    yield createChunk(id, 'gemini-2.5-flash', textPart, null);
  }

  yield createChunk(id, 'gemini-2.5-flash', '', 'stop');
}
