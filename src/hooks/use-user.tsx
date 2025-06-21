"use client";

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import { type User, type UserRole } from '@/lib/types';
import { dataApi } from '@/lib/data';

interface UserContextType {
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  hasRole: (role: UserRole) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useMemo(async () => {
    const fetchedUsers = await dataApi.getUsers();
    setUsers(fetchedUsers);
    if (fetchedUsers.length > 0) {
      setCurrentUser(fetchedUsers[0]);
    }
  }, []);

  const hasRole = (role: UserRole) => {
    return currentUser?.role === role;
  };

  const value = useMemo(() => ({
    users,
    currentUser,
    setCurrentUser,
    hasRole,
  }), [users, currentUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
