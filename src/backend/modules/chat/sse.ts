// ─── SSE helpers ─────────────────────────────────────────────────────────────
export const sseChunk = (text: string) =>
  `data: ${JSON.stringify({ choices: [{ delta: { content: text }, finish_reason: null }] })}\n\n`;

export const sseDone =
  `data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: 'stop' }] })}\n\n` +
  'data: [DONE]\n\n';
