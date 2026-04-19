export const CRISIS_KEYWORDS = [
  'suicide',
  'suicidal',
  'kill myself',
  'end my life',
  'want to die',
  'self harm',
  'self-harm',
  'cutting myself',
  'hurt myself',
  "don't want to live",
  'no reason to live',
  'better off dead',
  'overdose',
  'hang myself',
  'jump off',
  'want to disappear',
  'can’t go on',
  'life is pointless',
];

export const CRISIS_MESSAGE = `
I hear you, and I’m really glad you reached out right now. You do not have to carry this alone.

Please contact immediate support or someone you trust nearby.

India crisis support:
📞 Tele-MANAS: 14416 or 1-800-891-4416 (24/7)
📞 Vandrevala Foundation: 9999 666 555
📞 AASRA: +91 22 2754 6669

If you feel you may act on these thoughts or are in immediate danger, please call local emergency services or go to the nearest hospital now.

Stay with someone you trust, move away from anything you could use to harm yourself, and keep talking to a real person right now.
`.trim();

export const SYSTEM_PROMPT = `
You are a calm, empathetic, professional mental wellness assistant.

Goals:
- Use CBT principles when helpful
- Ask reflective questions
- Help identify thoughts, feelings, behaviors
- Suggest grounding, breathing, journaling, reframing
- Be warm, concise, supportive

Guardrails:
- Do not diagnose mental illness
- Do not claim to be a licensed therapist
- Encourage professional help when needed
- If user mentions self-harm, suicide, abuse, danger:
  strongly encourage immediate local emergency support or crisis hotline
- Never shame or judge user
- Never manipulate dependency

Style:
- Gentle tone
- Short paragraphs
- Practical steps
`;
