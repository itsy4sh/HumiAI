'use client';

import Vapi from '@vapi-ai/web';
import { useEffect, useRef, useState } from 'react';

type Status = 'idle' | 'connecting' | 'active' | 'error';

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_KEY!;
// const VAPI_ASSISTANT_ID = '53fe91cf-d4d7-473f-8b0f-84e59a8db2f2';
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function VoiceCompanion() {
  const vapiRef = useRef<Vapi | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [transcript, setTranscript] = useState<
    { role: string; text: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;
    vapi.on('call-start', () => setStatus('active'));
    vapi.on('call-end', () => setStatus('idle'));
    vapi.on('error', (e) => {
      setError(String(e));
      setStatus('error');
    });

    vapi.on('message', (msg) => {
      if (msg.type !== 'transcript') {
        return;
      }
      setTranscript((prev) => {
        const last = prev.at(-1);
        if (last?.role === msg.role && msg.transcriptType === 'partial') {
          return [
            ...prev.slice(0, -1),
            { role: msg.role, text: msg.transcript },
          ];
        }
        return [...prev, { role: msg.role, text: msg.transcript }];
      });
    });

    return () => {
      vapi.stop();
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [transcript]);

  const startCall = async () => {
    if (!vapiRef.current) {
      return;
    }
    setError(null);
    setTranscript([]);
    setStatus('connecting');
    try {
      // await vapiRef.current.start(VAPI_ASSISTANT_ID);
      await vapiRef.current.start({
        model: {
          provider: 'custom-llm',
          url: `${BACKEND_URL}/api/chat/completions`,
          model: 'test-v1',
        },
        voice: {
          provider: 'vapi', // ← free, no ElevenLabs needed
          voiceId: 'Elliot',
        },
        transcriber: {
          provider: 'deepgram',
          language: 'en',
        },
        firstMessage: "Hey, I'm here. How are you doing today?",
      });
    } catch (e) {
      setError(String(e));
      setStatus('error');
    }
  };

  const stopCall = () => {
    vapiRef.current?.stop();
  };

  const isActive = status === 'active';
  const isConnecting = status === 'connecting';

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-neutral-950 p-6 font-sans text-neutral-100'>
      <span
        className={`mb-8 rounded-full border px-3 py-1 text-xs uppercase tracking-widest transition-colors ${
          isActive
            ? 'border-emerald-700 bg-emerald-950 text-emerald-400'
            : isConnecting
              ? 'animate-pulse border-amber-700 bg-amber-950 text-amber-400'
              : status === 'error'
                ? 'border-red-700 bg-red-950 text-red-400'
                : 'border-neutral-700 bg-neutral-900 text-neutral-500'
        }`}
      >
        {status}
      </span>

      <button
        aria-label={isActive ? 'End call' : 'Start call'}
        className={`relative h-20 w-20 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
          isActive
            ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.35)] hover:bg-red-600'
            : isConnecting
              ? 'cursor-not-allowed bg-neutral-700'
              : 'bg-white shadow-[0_0_40px_rgba(255,255,255,0.12)] hover:bg-neutral-200'
        }`}
        disabled={isConnecting}
        onClick={isActive ? stopCall : startCall}
      >
        {isActive && (
          <span className='absolute inset-0 animate-ping rounded-full bg-red-500 opacity-30' />
        )}

        <svg
          className={`mx-auto ${isActive ? 'text-white' : 'text-neutral-900'}`}
          fill='currentColor'
          height='28'
          viewBox='0 0 24 24'
          width='28'
        >
          {isActive ? (
            <rect height='12' rx='2' width='12' x='6' y='6' />
          ) : (
            <path d='M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm7 9a1 1 0 0 1 1 1 8 8 0 0 1-7 7.938V21h2a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2h2v-2.062A8 8 0 0 1 4 11a1 1 0 0 1 2 0 6 6 0 0 0 12 0 1 1 0 0 1 1-1z' />
          )}
        </svg>
      </button>

      <p className='mt-5 text-neutral-500 text-sm'>
        {isActive
          ? 'Tap to end'
          : isConnecting
            ? 'Connecting…'
            : 'Tap to speak'}
      </p>

      {error && (
        <p className='mt-4 max-w-sm rounded-lg border border-red-800 bg-red-950 px-4 py-2 text-center text-red-400 text-xs'>
          {error}
        </p>
      )}

      {transcript.length > 0 && (
        <div
          className='mt-8 max-h-64 w-full max-w-md space-y-3 overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-900 p-4'
          ref={scrollRef}
        >
          {transcript.map((t, i) => (
            <div
              className={`flex gap-2 text-sm ${t.role === 'assistant' ? 'flex-row-reverse' : ''}`}
              key={i}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-medium text-[10px] ${
                  t.role === 'assistant'
                    ? 'bg-emerald-800 text-emerald-200'
                    : 'bg-neutral-700 text-neutral-300'
                }`}
              >
                {t.role === 'assistant' ? 'A' : 'U'}
              </span>
              <p
                className={`rounded-xl px-3 py-2 leading-relaxed ${
                  t.role === 'assistant'
                    ? 'bg-emerald-950 text-right text-emerald-100'
                    : 'bg-neutral-800 text-neutral-200'
                }`}
              >
                {t.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
