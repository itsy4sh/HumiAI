import { Bell, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '../ui/button';

export default function Navbar() {
  return (
    <section className='flex w-full items-center justify-between gap-4'>
      {/* Logo */}
      <div>
        <span className='font-display text-2xl'>REN</span>
      </div>

      {/* Search (hidden on small screens if needed) */}

      {/* Right side */}
      <div className='flex items-center gap-3'>
        {/* Mobile search icon */}
        <Button className='md:hidden'>
          <Search className='h-5 w-5' />
        </Button>
        <div className='hidden max-w-3xs flex-1 items-center gap-2 border px-3 py-2 md:flex'>
          <Search className='h-4 w-4 opacity-60' />
          <input
            className='w-full bg-transparent text-sm outline-none'
            placeholder='Search...'
            type='text'
          />
        </div>
        <Button className='border py-4' variant={'outline'}>
          <Bell />
        </Button>
        {/* Avatar */}
        <Avatar>
          <AvatarImage
            alt='shadcn'
            className='rounded-none'
            src='https://github.com/shadcn.png'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </section>
  );
}
