export function createChunk(
  id: string,
  model: string,
  content = '',
  finish_reason: string | null = null,
) {
  return {
    id,
    object: 'chat.completion.chunk',
    created: Math.floor(Date.now() / 1000),
    model,
    choices: [
      {
        index: 0,
        delta: content ? { content } : {},
        finish_reason,
      },
    ],
  };
}