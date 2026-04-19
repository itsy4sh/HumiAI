import { DM_Mono, DM_Sans, Pixelify_Sans, Raleway } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300'],
  variable: '--font-dm-sans',
});
const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-raleway',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
});

const display = Pixelify_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'Humi Ai',
  description: 'Voice First Mental Health Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        'h-full',
        'antialiased',
        dmSans.variable,
        dmMono.variable,
        raleway.variable,
        display.variable,
        'dark',
      )}
      lang='en'
    >
      <body className='flex h-screen w-screen flex-col'>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
