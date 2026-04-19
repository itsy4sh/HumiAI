/** biome-ignore-all lint/suspicious/useAwait: <explanation */
import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

export async function* streamLLM(messages: any[]) {
  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages,
  });
  const id = 'chatcmpl-' + crypto.randomUUID();
  for await (const textPart of result.textStream) {
    yield {
      id,
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model: 'gemini-2.5-flash',
      choices: [
        {
          index: 0,
          delta: { content: textPart },
          finish_reason: null,
        },
      ],
    };
  }
  yield {
    id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model: 'gemini-2.5-flash',
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: 'stop',
      },
    ],
  };
}
