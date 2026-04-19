'use client';
import {
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Session', href: '/session', icon: HeartHandshake },
  { name: 'Transcripts', href: '/transcripts', icon: ClipboardList },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className='flex h-full w-full flex-col'>
      <nav className='mt flex flex-col gap-0'>
        {navLinks.map(({ name, href, icon: Icon }) => (
          <Link
            className={`flex items-center gap-3 px-3 py-2 text-md transition-colors ${
              pathname === href || pathname.startsWith(href + '/')
                ? 'bg-primary'
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
    </aside>
  );
}
