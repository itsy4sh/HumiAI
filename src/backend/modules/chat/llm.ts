/** biome-ignore-all lint/suspicious/useAwait: <explanation */
import { google } from '@ai-sdk/google';
import type { ModelMessage } from 'ai';
import { streamText } from 'ai';

export async function streamLLM(messages: ModelMessage[]) {
  const result = streamText({
    model: google('gemini-1.5-flash'),
    messages, // already in the right format — no manual role mapping needed
  });
  return result.textStream; // AsyncIterable<string> — plug straight into your SSE loop
}

