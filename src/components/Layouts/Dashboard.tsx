'use client';
import Link from 'next/link';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

// ─── Mock data (swap with real API / server-component props) ───────────────
const RECENT_SESSIONS = [
  { id: 1, date: 'Apr 18, 2026', duration: '45 min', mood: 'Calm', score: 8 },
  {
    id: 2,
    date: 'Apr 16, 2026',
    duration: '30 min',
    mood: 'Anxious',
    score: 5,
  },
  {
    id: 3,
    date: 'Apr 14, 2026',
    duration: '60 min',
    mood: 'Focused',
    score: 9,
  },
  { id: 4, date: 'Apr 11, 2026', duration: '20 min', mood: 'Tired', score: 4 },
];

const CURRENT_MOOD = {
  label: 'Calm',
  emoji: '😌',
  score: 7,
  description: 'Relaxed and grounded today.',
};
const TOTAL_SESSIONS = 24;
const STREAK = 5;
const WEEK_GOAL = 7;

// ─── Helpers ───────────────────────────────────────────────────────────────

const moodColor: Record<string, string> = {
  Calm: 'bg-blue-100  text-blue-700  dark:bg-blue-900/40  dark:text-blue-300',
  Anxious:
    'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Focused:
    'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Tired: 'bg-slate-100 text-slate-600 dark:bg-slate-800   dark:text-slate-400',
};

function MoodBadge({ mood }: { mood: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 font-medium text-xs ${moodColor[mood] ?? 'bg-muted text-muted-foreground'}`}
    >
      {mood}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div className='h-1.5 w-full overflow-hidden rounded-full bg-secondary'>
      <div
        className='h-full rounded-full bg-primary transition-all duration-500'
        style={{ width: `${(score / 10) * 100}%` }}
      />
    </div>
  );
}

// ─── Bento Tiles ───────────────────────────────────────────────────────────

function MoodCard() {
  return (
    <div className='flex flex-col justify-between border border-border bg-transparent p-6'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <p className='font-semibold text-[11px] text-muted-foreground uppercase tracking-widest'>
            Today's Mood
          </p>
          <p className='mt-2 font-bold text-4xl text-card-foreground tracking-tight'>
            {CURRENT_MOOD.emoji} {CURRENT_MOOD.label}
          </p>
        </div>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border bg-background font-bold text-foreground text-sm shadow-sm'>
          {CURRENT_MOOD.score}/10
        </div>
      </div>
      <div className='mt-6 space-y-2'>
        <ScoreBar score={CURRENT_MOOD.score} />
        <p className='text-muted-foreground text-sm'>
          {CURRENT_MOOD.description}
        </p>
      </div>
    </div>
  );
}

function StatsCard() {
  return (
    <div className='flex flex-col border border-border bg-transparent p-6'>
      <p className='font-semibold text-[11px] text-muted-foreground uppercase tracking-widest'>
        Your Progress
      </p>
      <div className='mt-4 grid grid-cols-2 divide-x divide-border'>
        <div className='flex flex-col items-center gap-0.5 pr-4 text-center'>
          <span className='font-bold text-5xl text-card-foreground tabular-nums'>
            {TOTAL_SESSIONS}
          </span>
          <span className='text-muted-foreground text-xs'>Total Sessions</span>
        </div>
        <div className='flex flex-col items-center gap-0.5 pl-4 text-center'>
          <span className='font-bold text-5xl text-card-foreground tabular-nums'>
            {STREAK}
            <span className='text-2xl leading-none'>🔥</span>
          </span>
          <span className='text-muted-foreground text-xs'>Day Streak</span>
        </div>
      </div>
      <div className='mt-auto pt-6'>
        <div className='flex items-center gap-1'>
          {Array.from({ length: WEEK_GOAL }).map((_, i) => (
            <div
              className={`h-2 flex-1 rounded-full ${i < STREAK ? 'bg-primary' : 'bg-secondary'}`}
              key={i}
            />
          ))}
        </div>
        <p className='mt-1.5 text-right text-muted-foreground text-xs'>
          {STREAK}/{WEEK_GOAL} this week
        </p>
      </div>
    </div>
  );
}

function CTACard() {
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState('');

  return (
    <div className='relative col-span-1 overflow-hidden border p-6 shadow-sm sm:col-span-2'>
      <div className='pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/5' />
      <div className='pointer-events-none absolute right-24 -bottom-8 h-28 w-28 rounded-full bg-white/5' />

      <div className='relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='font-semibold text-[11px] text-primary-foreground/60 uppercase tracking-widest'>
            Ready?
          </p>

          <h3 className='mt-1 font-bold text-2xl text-primary-foreground'>
            Start a Session
          </h3>

          <p className='mt-0.5 text-primary-foreground/70 text-sm'>
            Jump in now or schedule one for later.
          </p>
        </div>

        <div className='relative flex shrink-0 flex-wrap gap-2'>
          <Link
            className='inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 font-semibold text-primary text-sm shadow-sm transition hover:opacity-90 active:scale-95'
            href='/session'
          >
            Start Now
          </Link>

          <button
            className='inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-5 py-2.5 font-semibold text-primary-foreground text-sm transition hover:bg-primary-foreground/10 active:scale-95'
            onClick={() => setShowPicker(!showPicker)}
            type='button'
          >
            Book Later
          </button>

          {showPicker && (
            <div className='absolute right-0 z-10 border bg-background p-3 shadow-xl'>
              <input
                className='rounded-md border px-3 py-2 text-sm'
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                type='date'
                value={date}
              />
              {date && (
                <Link
                  className='mt-3 block bg-primary px-4 py-2 text-center text-primary-foreground text-sm'
                  href={`/session?mode=book&date=${date}`}
                >
                  Continue
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecentSessionsCard() {
  return (
    <div className='col-span-1 flex flex-col border border-border bg-transparent p-6 sm:col-span-2'>
      <div className='mb-4 flex items-center justify-between'>
        <p className='font-semibold text-[11px] text-muted-foreground uppercase tracking-widest'>
          Recent Sessions
        </p>
        <Link
          className='font-medium text-primary text-xs hover:underline'
          href='/sessions'
        >
          View all →
        </Link>
      </div>
      <ul className='divide-y divide-border'>
        {RECENT_SESSIONS.map((s) => (
          <li
            className='flex items-center gap-4 py-3 first:pt-0 last:pb-0'
            key={s.id}
          >
            <div className='min-w-0 flex-1'>
              <div className='flex flex-wrap items-center gap-2'>
                <span className='font-medium text-card-foreground text-sm'>
                  {s.date}
                </span>
                <MoodBadge mood={s.mood} />
              </div>
              <p className='mt-0.5 text-muted-foreground text-xs'>
                {s.duration}
              </p>
            </div>
            <div className='flex w-20 shrink-0 flex-col items-end gap-1'>
              <span className='font-semibold text-card-foreground text-xs'>
                {s.score}/10
              </span>
              <ScoreBar score={s.score} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function DashboardWrapper() {
  const session = authClient.useSession();
  const firstName = session.data?.user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className='p-5'>
      <div>
        <header className='mb-8'>
          <p className='text-muted-foreground text-sm'>Welcome back,</p>
          <h1 className='font-bold text-3xl text-foreground tracking-tight'>
            {firstName} 👋
          </h1>
        </header>

        {/* Bento Grid */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <MoodCard /> {/* col 1 */}
          <StatsCard /> {/* col 2 */}
          <CTACard /> {/* sm:col-span-2 — full width */}
          <RecentSessionsCard /> {/* sm:col-span-2 — full width */}
        </div>
      </div>
    </div>
  );
}
