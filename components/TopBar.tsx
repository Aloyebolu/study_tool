/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Menu, UserCircle, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import useSidebar from '@/hooks/useSideBar';
import { useLogout } from '@/hooks/useLogout';
import { getCurrentUser } from '@/hooks/useCurrentUser';
import { useUser } from '@/context/userContext';


export default function Topbar() {
  const { toggle } = useSidebar();
  const { token: user } = useUser()
  const logout = useLogout();

  return (
    <header className="w-full h-14 bg-white dark:bg-gray-900 border-b px-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={toggle} className="lg:hidden">
          <Menu className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-semibold tracking-wide">StudyTool</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {user ? `User: ${user.userId}` : 'Not logged in'}
        </span>

        <Button
          variant="ghost"
          onClick={logout}
          title="Logout"
          className="text-red-500 hover:text-red-600"
        >
          <LogOut className="w-6 h-6" />
        </Button>
      </div>
    </header>
  );
}
