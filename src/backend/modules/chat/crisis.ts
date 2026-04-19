export function getLastUserMessage(messages: any[] = []) {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  return lastUser?.content?.toString() || '';
}

export function isCrisis(text: string) {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some((word) => lower.includes(word));
}
