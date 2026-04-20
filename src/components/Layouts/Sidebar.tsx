'use client';

import {
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  Settings,
} from 'lucide-react';
import Link from 'next/link';

import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { Button } from '../ui/button';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Session', href: '/session', icon: HeartHandshake },
  { name: 'Transcripts', href: '/transcripts', icon: ClipboardList },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await authClient.signOut();
  };

  return (
    <aside className='flex h-full w-full flex-col'>
      {/* Top Navigation */}
      <nav className='flex flex-1 flex-col gap-0'>
        {navLinks.map(({ name, href, icon: Icon }) => (
          <Link
            className={`flex items-center gap-3 px-3 py-2 text-md transition-colors ${
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-secondary'
            }`}
            href={href}
            key={href}
          >
            <Icon size={18} />
            {name}
          </Link>
        ))}
      </nav>

      {/* Bottom Logout */}
      <Button
        className='mx-2 my-5 p-5'
        onClick={handleLogout}
        variant={'ghost'}
      >
        <LogOut size={18} />
        <h1>SignOut</h1>
      </Button>
    </aside>
  );
}
