'use client';

import Vapi from '@vapi-ai/web';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Spinner } from '../kibo-ui/spinner';
import { Status, StatusIndicator, StatusLabel } from '../kibo-ui/status';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Orb } from '../ui/orb';
import { TextShimmer } from '../ui/text-shimmer';

type AgentStatus = 'idle' | 'connecting' | 'active' | 'error';

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_KEY!;
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function VoiceCompanion() {
  const vapiRef = useRef<Vapi | null>(null);
  const [AgentStatus, setAgentStatus] = useState<AgentStatus>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState<
    { role: string; text: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;
    vapi.on('call-start', () => setAgentStatus('active'));
    vapi.on('call-end', () => setAgentStatus('idle'));
    vapi.on('error', (e) => {
      setError(String(e));
      setAgentStatus('error');
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
    setAgentStatus('connecting');
    try {
      // await vapiRef.current.start(VAPI_ASSISTANT_ID);
      await vapiRef.current.start({
        model: {
          provider: 'custom-llm',
          // url: 'https://339488dd-91d5-40b1-89a9-b6f8412b5d2f-00-3g4twogggd93m.pike.repl.co/chat/completions',
          url: `${BACKEND_URL}/api/chat/completions`,
          model: 'test-v1',
        },
        voice: {
          provider: 'vapi', // ← free, no ElevenLabs needed
          voiceId: 'Tara',
        },
        transcriber: {
          provider: 'deepgram',
          language: 'en',
        },
        firstMessage: "Hey, I'm here. How are you doing today?",
      });
    } catch (e) {
      setError(String(e));
      setAgentStatus('error');
    }
  };

  const stopCall = () => {
    vapiRef.current?.stop();
  };
  const isActive = AgentStatus === 'active';
  const isConnecting = AgentStatus === 'connecting';

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };
  return (
    <div className='flex h-full items-center justify-around bg-neutral-950 p-6 font-sans text-neutral-100'>
      <div className='flex flex-col gap-10 p-2'>
        {/*Status bar*/}
        <div className='flex w-70 items-center justify-between'>
          <div>HUMI</div>
          <Status
            className='rounded-full p-3 text-md'
            status={error ? 'error' : AgentStatus}
          >
            <StatusIndicator />
            <StatusLabel />
          </Status>
        </div>

        {/* orb */}
        <div className='flex flex-col items-center gap-6'>
          <div className='relative size-40'>
            <div className='relative h-full w-full rounded-full bg-muted p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]'>
              <div className='h-full w-full overflow-hidden rounded-full bg-background shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]'>
                <Orb className='h-full w-full' />
              </div>
            </div>
          </div>
        </div>

        {/*conversation BAR*/}
        <div
          className={`flex items-center justify-between border px-4 py-3 transition-all duration-300 ${
            isActive ? 'border-red-400' : 'border-muted'
          }`}
        >
          {/* Status */}
          <div className='min-w-[140px]'>
            <p className='text-md text-white'>
              {isActive
                ? 'Conversation Live'
                : isConnecting
                  ? 'Connecting...'
                  : 'Ready to Talk'}
            </p>

            {/*description*/}
            <TextShimmer className='text-sm' duration={3}>
              {isActive
                ? isMuted
                  ? 'Microphone muted'
                  : 'Tap to end'
                : isConnecting
                  ? 'please wait'
                  : 'Tap to speak'}
            </TextShimmer>
          </div>

          {/* Call Button */}
          <Button
            aria-label={isActive ? 'End call' : 'Start call'}
            className={`relative h-11 w-11 rounded-full transition-all ${
              isActive
                ? 'bg-red-500 text-white hover:bg-red-600'
                : isConnecting
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer bg-primary'
            }`}
            disabled={isConnecting}
            onClick={isActive ? stopCall : startCall}
          >
            {isActive && (
              <span className='absolute inset-0 animate-pulse rounded-full bg-red-500 opacity-30' />
            )}

            <span className='relative z-10 flex items-center justify-center'>
              {isConnecting ? (
                <Spinner variant='throbber' />
              ) : isActive ? (
                <PhoneOff size={18} />
              ) : (
                <Phone size={18} />
              )}
            </span>
          </Button>

          {/* Mic Button Only During Active Call */}
          {isActive && (
            <Button
              aria-label={isMuted ? 'Unmute mic' : 'Mute mic'}
              className='h-12 w-12 rounded-full transition'
              onClick={toggleMute}
              variant={'outline'}
            >
              {isMuted ? <MicOff /> : <Mic />}
            </Button>
          )}
        </div>
      </div>

      <div>
        {transcript.length > 0 && (
          <div
            className='h-100 w-125 space-y-3 overflow-y-auto bg-transparent p-4'
            ref={scrollRef}
          >
            {transcript.map((t, i) => (
              <div
                className={`flex gap-2 text-sm ${
                  t.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
                key={i}
              >
                {/* Assistant Message */}
                {t.role === 'assistant' && (
                  <>
                    <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-[10px] text-emerald-200'>
                      <Orb className='h-full w-full' />
                    </span>

                    <p className='rounded-md bg-primary px-3 py-2 text-primary-foreground leading-relaxed'>
                      {t.text}
                    </p>
                  </>
                )}

                {/* User Message */}
                {t.role === 'user' && (
                  <>
                    <p className='rounded-xl bg-secondary px-3 py-2 text-right text-secondary-foreground leading-relaxed'>
                      {t.text}
                    </p>

                    <span className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-700 font-medium text-[10px] text-neutral-300'>
                      <Avatar>
                        <AvatarImage
                          alt='shadcn'
                          className='rounded-none'
                          src='https://github.com/shadcn.png'
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
