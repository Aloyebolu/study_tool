/* eslint-disable @typescript-eslint/no-unused-vars */
// 'use client';

// import {
//   Home,
//   Layers,
//   Code,
//   Bell,
//   Settings,
//   PanelRightOpen,
//   PanelRightClose,
// } from 'lucide-react';
// import { useState, ReactNode } from 'react';
// import Link from 'next/link';
// import { cn } from '@/lib/cn';
// // import { cn } from '@/lib/utils';

// export default function DashboardLayout({ children }: { children: ReactNode }) {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [workspaceVisible, setWorkspaceVisible] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-gray-100 text-gray-800">
//       {/* Sidebar */}
//       <aside
//         className={cn(
//           'transition-all duration-300 bg-white border-r shadow-sm z-20',
//           sidebarOpen ? 'w-64' : 'w-16'
//         )}
//       >
//         <div className="flex items-center justify-between p-4">
//           <span className="text-indigo-600 font-bold text-lg hidden sm:block">
//             {sidebarOpen && 'StudyTool'}
//           </span>
//           <button onClick={() => setSidebarOpen(!sidebarOpen)}>
//             {sidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
//           </button>
//         </div>

//         <nav className="space-y-1 px-2 mt-6">
//           <SidebarLink href="/dashboard" icon={<Home size={20} />} label="Home" open={sidebarOpen} />
//           <SidebarLink href="/dashboard/quizzes" icon={<Layers size={20} />} label="Quizzes" open={sidebarOpen} />
//           <SidebarLink href="/dashboard/snippets" icon={<Code size={20} />} label="Snippets" open={sidebarOpen} />
//           <SidebarLink
//             href="#"
//             icon={<Settings size={20} />}
//             label="Workspace"
//             open={sidebarOpen}
//             onClick={() => setWorkspaceVisible(!workspaceVisible)}
//           />
//           <SidebarLink href="/dashboard/notifications" icon={<Bell size={20} />} label="Notifications" open={sidebarOpen} />
//         </nav>
//       </aside>

//       {/* Main & Workspace */}
//       <div className="flex-1 flex flex-col">
//         {/* Topbar */}
//         <header className="bg-white p-4 shadow-sm flex justify-between items-center">
//           <h1 className="font-bold text-lg text-indigo-600">Dashboard</h1>
//           <div className="flex items-center gap-2">
//             <img
//               src="/avatar.png"
//               alt="user"
//               className="w-8 h-8 rounded-full object-cover border"
//             />
//             <span className="text-sm font-medium hidden sm:block">Aloye Breakthrough</span>
//           </div>
//         </header>

//         {/* Body */}
//         <div className="flex flex-1 overflow-hidden">
//           {/* Main view */}
//           <div
//             className={cn(
//               'transition-all duration-300 h-full overflow-auto',
//               workspaceVisible ? 'w-1/2 border-r' : 'w-full'
//             )}
//           >
//             {children}
//           </div>

//           {/* Workspace view */}
//           {workspaceVisible && (
//             <div className="w-1/2 h-full bg-white overflow-auto">
//               {/* You can render the workspace component here or route it */}
//               <iframe
//                 src="/dashboard/workspace"
//                 className="w-full h-full"
//                 title="Workspace"
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// function SidebarLink({
//   href,
//   icon,
//   label,
//   open,
//   onClick,
// }: {
//   href: string;
//   icon: ReactNode;
//   label: string;
//   open: boolean;
//   onClick?: () => void;
// }) {
//   return (
//     <div
//       onClick={onClick}
//       className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-indigo-50 cursor-pointer transition-colors"
//     >
//       <Link href={href} className="flex items-center gap-2 w-full">
//         <span>{icon}</span>
//         {open && <span className="text-sm font-medium">{label}</span>}
//       </Link>
//     </div>
//   );
// }


'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import WorkspacePage from './workspace/page';
import Sidebar from '@/components/SideBar';
import Topbar from '@/components/TopBar';
import { getCurrentUser } from '@/hooks/useCurrentUser';
import { UserProvider } from '@/context/userContext';
// import Workspace from '@/components/workspace';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [workspaceFull, setWorkspaceFull] = useState(false);
  const [splitRatio, setSplitRatio] = useState(0.5);
    const router = useRouter();

    const [user, setUser] = useState<{ userId: string | null; token: string | null }>({ userId: null, token: null });

  useEffect(() => {
    const loadUser = async () => {
      const current = await getCurrentUser(); // no React error now
      setUser(current);
      console.log(current)
      if (!current.userId || !current.token) {
        router.replace('/auth/login');
      }
    };

    loadUser();
  }, [router]);


  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setShowWorkspace(pathname.includes('/workspace') && isLargeScreen);
  }, [pathname, isLargeScreen]);


  // if (!userId || !token) {
  //   // Optional: prevent flash of content during redirect
  //   return null;
  // }
  return (
 <UserProvider>
    <div className="flex h-screen">
      {/* {isLargeScreen && <Sidebar/>} */}

      {false ? (
        <div className="flex w-full relative overflow-hidden ">
          <div
          style={workspaceFull ? {width: '0%'} : {width: splitRatio * 100+'%'}}
            className={cn(
              'transition-all duration-200 overflow-auto',
              workspaceFull ? 'w-0' : `w-[${splitRatio * 100}%]`
            )}
          >
            {/* <Topbar /> */}
            <div className="p-4">{children}</div>
          </div>

          {/* Divider / Resizer */}
          {!workspaceFull && (
            <div
              className="w-2 bg-gray-200 cursor-col-resize hover:bg-gray-400"
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startRatio = splitRatio;

                const onMouseMove = (moveEvent: MouseEvent) => {
                  const delta = moveEvent.clientX - startX;
                  console.log(delta)
                  const newRatio = startRatio + delta / window.innerWidth;
                  setSplitRatio(Math.min(Math.max(newRatio, 0.2), 0.8));
                };

                const onMouseUp = () => {
                  window.removeEventListener('mousemove', onMouseMove);
                  window.removeEventListener('mouseup', onMouseUp);
                };

                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
              }}
            />
          )}

          {/* Workspace Panel */}
          <div
          style={workspaceFull ? {width: '100%'} : {width: (1 - splitRatio) * 100+'%'}}
            className={cn(
              'transition-all duration-200 overflow-auto ',
              workspaceFull ? 'w-[100%]' : `w-[${(1 - splitRatio) * 100}%]`
            )}
          >
            <WorkspacePage
              onToggleFull={() => setWorkspaceFull(!workspaceFull)}
              full={workspaceFull}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <Topbar />
          <div className="p-4">

            {children}
            </div>
        </div>
      )}
    </div>
            </UserProvider>

  );
}
