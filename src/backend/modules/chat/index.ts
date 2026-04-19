import { Elysia } from 'elysia';

const app = new Elysia({ aot: false });

// Logger
function log(...args: any[]) {
  console.log('[LOG]', ...args);
}

// Mock SSE stream generator
async function* mockStream(messages: any[]) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');

  const reply = `Hey you yes you said: '${
    lastUser?.content ?? 'nothing'
  }'. streaming works!`;

  for (const word of reply.split(' ')) {
    const chunk = {
      id: 'chatcmpl-test',
      object: 'chat.completion.chunk',
      created: Math.floor(Date.now() / 1000),
      model: 'mock',
      choices: [
        {
          index: 0,
          delta: { content: word + ' ' },
          finish_reason: null,
        },
      ],
    };

    yield chunk;
    await new Promise((r) => setTimeout(r, 40));
  }

  yield {
    id: 'chatcmpl-test',
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model: 'mock',
    choices: [
      {
        index: 0,
        delta: {},
        finish_reason: 'stop',
      },
    ],
  };
}

// Route
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

        for await (const chunk of mockStream(requestData.messages || [])) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`),
          );
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'));

        controller.close();
      },
    });
  }

  // NON-STREAMING RESPONSE
  set.headers['Content-Type'] = 'application/json';

  return {
    id: 'chatcmpl-test',
    object: 'chat.completion',
    choices: [
      {
        index: 0,
        message: {
          role: 'assistant',
          content: '[test] non-streaming response works!',
        },
        finish_reason: 'stop',
      },
    ],
  };
});

// Health check
app.get('/chat/completions', () => ({
  status: 'ok',
  server: 'Elysia mock OpenAI-compatible endpoint',
}));

export default app;
