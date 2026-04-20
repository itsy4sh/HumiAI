'use client';

import { FileTextIcon, MicIcon, VideoIcon } from 'lucide-react';
import type { ColumnDef } from '@/components/kibo-ui/table';
import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from '@/components/kibo-ui/table';

// ─── Types ────────────────────────────────────────────────────────────────────
type TranscriptStatus = 'processing' | 'ready' | 'failed' | 'reviewing';
type TranscriptSource = 'upload' | 'recording' | 'meeting';

interface Transcript {
  createdAt: Date;
  duration: number;
  id: string;
  language: string;
  source: TranscriptSource;
  status: TranscriptStatus;
  tags: string[];
  title: string;
  wordCount: number;
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const TRANSCRIPTS: Transcript[] = [
  {
    id: 't1',
    title: 'Session - Hana',
    createdAt: new Date('2025-03-10T09:15:00'),
    duration: 3612,
    status: 'ready',
    source: 'meeting',
    language: 'English',
    wordCount: 8420,
    tags: ['anxiety'],
  },
  {
    id: 't2',
    title: 'Session - Elliot',
    createdAt: new Date('2025-03-14T14:00:00'),
    duration: 2745,
    status: 'reviewing',
    source: 'recording',
    language: 'English',
    wordCount: 5930,
    tags: ['CBT'],
  },
  {
    id: 't3',
    title: 'Session - Kylie',
    createdAt: new Date('2025-03-18T11:30:00'),
    duration: 1890,
    status: 'ready',
    source: 'meeting',
    language: 'English',
    wordCount: 4210,
    tags: ['stress'],
  },
  {
    id: 't4',
    title: 'Session - Rohan',
    createdAt: new Date('2025-03-21T16:45:00'),
    duration: 900,
    status: 'processing',
    source: 'upload',
    language: 'English',
    wordCount: 0,
    tags: ['mindfulness'],
  },
  {
    id: 't5',
    title: 'Session - Lily',
    createdAt: new Date('2025-03-22T10:00:00'),
    duration: 1320,
    status: 'failed',
    source: 'recording',
    language: 'Spanish',
    wordCount: 0,
    tags: ['trauma'],
  },
  {
    id: 't6',
    title: 'Session - Savannah',
    createdAt: new Date('2025-03-25T13:00:00'),
    duration: 5040,
    status: 'ready',
    source: 'meeting',
    language: 'English',
    wordCount: 11_800,
    tags: ['medication'],
  },
  {
    id: 't7',
    title: 'Session - Neha',
    createdAt: new Date('2025-03-27T09:30:00'),
    duration: 2160,
    status: 'reviewing',
    source: 'recording',
    language: 'English',
    wordCount: 4780,
    tags: ['DBT'],
  },
  {
    id: 't8',
    title: 'Session - Cole',
    createdAt: new Date('2025-03-28T15:00:00'),
    duration: 2700,
    status: 'ready',
    source: 'meeting',
    language: 'English',
    wordCount: 6150,
    tags: ['relationships'],
  },
  {
    id: 't9',
    title: 'Session - Harry',
    createdAt: new Date('2025-04-01T11:00:00'),
    duration: 3300,
    status: 'processing',
    source: 'upload',
    language: 'English',
    wordCount: 0,
    tags: ['sleep'],
  },
  {
    id: 't10',
    title: 'Session - Paige',
    createdAt: new Date('2025-04-03T10:00:00'),
    duration: 7200,
    status: 'ready',
    source: 'meeting',
    language: 'English',
    wordCount: 16_400,
    tags: ['recovery'],
  },
  {
    id: 't11',
    title: 'Session - Spencer',
    createdAt: new Date('2025-04-05T09:00:00'),
    duration: 2500,
    status: 'ready',
    source: 'recording',
    language: 'English',
    wordCount: 5100,
    tags: ['focus'],
  },
  {
    id: 't12',
    title: 'Session - Leah',
    createdAt: new Date('2025-04-07T16:00:00'),
    duration: 3100,
    status: 'reviewing',
    source: 'meeting',
    language: 'English',
    wordCount: 6900,
    tags: ['self-esteem'],
  },
  {
    id: 't13',
    title: 'Session - Tara',
    createdAt: new Date('2025-04-08T12:30:00'),
    duration: 2950,
    status: 'ready',
    source: 'meeting',
    language: 'English',
    wordCount: 6020,
    tags: ['healing'],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const SOURCE_ICON: Record<TranscriptSource, React.ReactNode> = {
  meeting: <VideoIcon className='text-muted-foreground' size={13} />,
  recording: <MicIcon className='text-muted-foreground' size={13} />,
  upload: <FileTextIcon className='text-muted-foreground' size={13} />,
};

function formatDuration(seconds: number): string {
  if (seconds === 0) {
    return '—';
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
const TranscriptsPage = () => {
  const columns: ColumnDef<Transcript>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <TableColumnHeader column={column} title='Transcript' />
      ),
      cell: ({ row }) => {
        const { source } = row.original;
        const name = row.original.title.replace('Session - ', '');

        return (
          <div className='flex items-center gap-3'>
            <div className='flex size-8 items-center justify-center rounded-full bg-secondary font-medium text-xs'>
              {name.slice(0, 2).toUpperCase()}
            </div>

            <div className='min-w-0'>
              <p className='truncate font-medium text-sm'>
                {row.original.title}
              </p>
              <div className='mt-0.5 flex items-center gap-1.5 text-muted-foreground text-xs'>
                {SOURCE_ICON[source]}
                <span className='capitalize'>{source}</span>
              </div>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: 'language',
      header: ({ column }) => (
        <TableColumnHeader column={column} title='Language' />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground text-sm'>
          {row.original.language}
        </span>
      ),
    },

    {
      accessorKey: 'duration',
      header: ({ column }) => (
        <TableColumnHeader column={column} title='Duration' />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground text-sm tabular-nums'>
          {formatDuration(row.original.duration)}
        </span>
      ),
    },

    {
      accessorKey: 'wordCount',
      header: ({ column }) => (
        <TableColumnHeader column={column} title='Words' />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground text-sm tabular-nums'>
          {row.original.wordCount > 0
            ? row.original.wordCount.toLocaleString()
            : '—'}
        </span>
      ),
    },

    {
      id: 'tags',
      accessorFn: (row) => row.tags.join(', '),
      header: ({ column }) => (
        <TableColumnHeader column={column} title='Tags' />
      ),
      cell: ({ row }) => (
        <div className='flex flex-wrap gap-1'>
          {row.original.tags.map((tag) => (
            <span
              className='rounded-md border border-border bg-secondary/40 px-1.5 py-0.5 text-muted-foreground text-xs'
              key={tag}
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },

    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <TableColumnHeader column={column} title='Created' />
      ),
      cell: ({ row }) => (
        <span className='text-muted-foreground text-sm'>
          {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(
            row.original.createdAt,
          )}
        </span>
      ),
    },
  ];

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h1 className='font-semibold text-xl'>Transcripts</h1>
        <p className='mt-1 text-muted-foreground text-sm'>
          {TRANSCRIPTS.length} transcripts
        </p>
      </div>

      <TableProvider columns={columns} data={TRANSCRIPTS}>
        <TableHeader>
          {({ headerGroup }) => (
            <TableHeaderGroup headerGroup={headerGroup} key={headerGroup.id}>
              {({ header }) => <TableHead header={header} key={header.id} />}
            </TableHeaderGroup>
          )}
        </TableHeader>

        <TableBody>
          {({ row }) => (
            <TableRow key={row.id} row={row}>
              {({ cell }) => <TableCell cell={cell} key={cell.id} />}
            </TableRow>
          )}
        </TableBody>
      </TableProvider>
    </div>
  );
};

export default TranscriptsPage;
