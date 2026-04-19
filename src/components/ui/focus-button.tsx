'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { cn } from '@/lib/utils';

interface FocusButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  dashColor?: string;
  href?: string;
}

const FocusButton = ({
  children,
  className,
  dashColor,
  href,
  ...props
}: FocusButtonProps) => {
  const router = useRouter();
  return (
    <button
      className={cn(
        'group relative cursor-pointer px-6 py-3 text-[16px] text-black leading-none tracking-normal dark:text-white',
        className,
      )}
      onClick={href ? () => router.push(href) : props.onClick}
      {...props}
    >
      {/* Main Border */}
      <div className='absolute inset-0 border border-gray-200 dark:border-white/20' />

      {/* Corner Dashes */}
      <CornerDashes color={dashColor} />

      {/* Content */}
      <span className='relative z-10'>{children}</span>
    </button>
  );
};

const CornerDashes = ({ color }: { color?: string }) => {
  return (
    <>
      {/* Top Right Corner */}
      <div
        className={cn(
          'absolute top-0 right-0 h-2 w-2 border-black border-t border-r transition-all duration-300 group-hover:h-full group-hover:w-full group-hover:border-black dark:border-white group-hover:dark:border-white',
        )}
        style={color ? { borderColor: color } : undefined}
      />

      {/* Bottom Left Corner */}
      <div
        className={cn(
          'absolute bottom-0 left-0 h-2 w-2 border-black border-b border-l transition-all duration-300 group-hover:h-full group-hover:w-full group-hover:border-black dark:border-white group-hover:dark:border-white',
        )}
        style={color ? { borderColor: color } : undefined}
      />
    </>
  );
};

export default FocusButton;
