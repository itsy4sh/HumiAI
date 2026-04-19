import type { Metadata } from 'next';
import Navbar from '@/components/Layouts/Navbar';
import Sidebar from '@/components/Layouts/Sidebar';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: {
    template: 'Home',
    default: 'Home',
  },
};

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen w-full'>
      <div className='grid h-full w-full grid-rows-[auto_1fr] md:grid-cols-[250px_1fr]'>
        {/* NAV (full width) */}
        <div className='flex items-center border-b p-4 md:col-span-2'>
          <Button className='mr-4 md:hidden'></Button>
          <Navbar />
        </div>

        {/* SIDEBAR */}
        <div className='hidden border-r md:block'>
          <Sidebar />
        </div>

        {/* MAIN CONTENT */}
        <div className='overflow-auto p-4'>{children}</div>
      </div>
    </div>
  );
}
