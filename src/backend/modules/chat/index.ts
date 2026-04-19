/** biome-ignore-all lint/suspicious/useAwait: <explanation */
import { Elysia } from 'elysia';
import { streamLLM } from './llm';

const app = new Elysia({ aot: false });
// Logger
function log(...args: any[]) {
  console.log('[LOG]', ...args);
}
/* ---------------------------------- */
/* ROUTE */
/* ---------------------------------- */

app.post('/chat/completions', async ({ body, set }) => {
  const requestData = { ...(body as any) };

  const streaming = requestData.stream ?? false;

  delete requestData.call;
  delete requestData.metadata;

  log('Incoming request:', requestData);

  // STREAMING RESPONSE
  if (streaming) {
    set.headers['Content-Type'] = 'text/event-stream; charset=utf-8';
    set.headers['Cache-Control'] = 'no-cache';
    set.headers['Connection'] = 'keep-alive';

    return new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        for await (const chunk of streamLLM(requestData.messages || [])) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
          );
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });
  }
});

/* ---------------------------------- */
/* HEALTH CHECK */
/* ---------------------------------- */
app.get('/chat/completions', () => ({
  status: 'ok',
  server: 'custom-llm endpoint',
}));

export default app;
// const port = Number(process.env.PORT || 5000);
// app.listen(port);
// console.log(`🚀 Running on http://0.0.0.0:${port}`);
