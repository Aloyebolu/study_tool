// context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type UserType = { userId: string | null; token: string | null };

const UserContext = createContext<{ user: UserType; setUser: React.Dispatch<React.SetStateAction<UserType>> } | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType>({ userId: null, token: null });
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const userId = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).userId : null;
      const token = localStorage.getItem('token') || null;

      const current = { userId, token };
      setUser(current);

      if (!userId || !token) {
        router.replace('/auth/login');
      }
    };

    loadUser();
  }, [router]);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
