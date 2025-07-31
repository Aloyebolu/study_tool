/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import {
  LayoutDashboard,
  FileText,
  Users,
  MessageSquare,
  Folder,
  Bell,
  BookOpen,
  LogOut,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import useSidebar from '@/hooks/useSideBar';
// import { useSidebar } from '@/lib/use-sidebar';

const links = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Workspace', icon: Folder, href: '/dashboard/workspace' },
  { name: 'Quiz', icon: FileText, href: '/dashboard/quiz' },
  { name: 'Snippets', icon: BookOpen, href: '/dashboard/snippets' },
  { name: 'Chat', icon: MessageSquare, href: '/dashboard/chat' },
  { name: 'Rankings', icon: Sparkles, href: '/dashboard/rank' },
  { name: 'Notifications', icon: Bell, href: '/dashboard/notification' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  return (
    <aside
      className={cn(
        'bg-white dark:bg-gray-900 border-r w-64 h-screen p-4 flex flex-col fixed z-40 transition-transform duration-300',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="flex flex-col gap-3">
        {links.map(({ name, icon: Icon, href }) => (
          <Link
            key={name}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition',
              pathname.startsWith(href)
                ? 'bg-muted font-semibold'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            {name}
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-6 border-t">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-md transition">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
