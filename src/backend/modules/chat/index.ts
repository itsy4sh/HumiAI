/** biome-ignore-all lint/suspicious/useAwait: <explanation */
import { Elysia } from 'elysia';
// import { createChunk } from './chunk';
// import { getLastUserMessage, isCrisis } from './crisis';
import { streamLLM } from './llm';

// import { CRISIS_MESSAGE } from './promt';

const app = new Elysia({ aot: false });

/* LOGGER */
function log(...args: any[]) {
  console.log('[LOG]', ...args);
}

/* ---------------------------------- */
/* CRISIS DETECTION */
/* ---------------------------------- */

/* @custom-llmROTUE */
app.post('/chat/completions', async ({ body, set }) => {
  const requestData = { ...(body as any) };

  const streaming = requestData.stream ?? false;

  delete requestData.call;
  delete requestData.metadata;

  log('Incoming request:', requestData);

  if (streaming) {
    set.headers['Content-Type'] = 'text/event-stream; charset=utf-8';
    set.headers['Cache-Control'] = 'no-cache';
    set.headers['Connection'] = 'keep-alive';

    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const messages = requestData.messages || [];

        /* Crisis Detection */

        // const userText = getLastUserMessage(messages);

        // if (isCrisis(userText)) {
        //   const id = 'chatcmpl-' + crypto.randomUUID();

        //   controller.enqueue(
        //     encoder.encode(
        //       `data: ${JSON.stringify(
        //         createChunk(id, 'safety', CRISIS_MESSAGE, null),
        //       )}\n\n`,
        //     ),
        //   );

        //   controller.enqueue(
        //     encoder.encode(
        //       `data: ${JSON.stringify(
        //         createChunk(id, 'safety', '', 'stop'),
        //       )}\n\n`,
        //     ),
        //   );

        //   controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        //   controller.close();
        //   return;
        // }

        /* Normal Stream */

        for await (const chunk of streamLLM(messages)) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
          );
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });
  }

  return {
    error: 'Use stream:true',
  };
});

/* HEALTH */
app.get('/chat/completions', () => ({
  status: 'ok',
  server: 'custom-llm endpoint',
}));

export default app;
// const port = Number(process.env.PORT || 5000);
// app.listen(port);
// console.log(`🚀 Running on http://0.0.0.0:${port}`);
