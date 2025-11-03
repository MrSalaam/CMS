import React, { createContext, useContext, useState } from 'react';
import type { AuthContextType, Role, User } from '../types';
import { api } from '../lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const permissions = {
  admin: ['create', 'read', 'update', 'delete', 'manage_users'],
  editor: ['create', 'read', 'update'],
  viewer: ['read'],
} as const;

// eslint-disable-next-line react-refresh/only-export-components
export const hasPermission = (role: Role, action: string): boolean => {
  // @ts-expect-error role indexes the map
  return permissions[role].includes(action);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string) => {
    const foundUser = await api.findUserByEmail(email);
    if (foundUser) {
      setUser(foundUser);
      alert(`Login successful. Welcome back, ${foundUser.name}!`);
    } else {
      alert('Login failed. Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    alert('Logged out');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};