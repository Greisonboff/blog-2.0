import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User } from '@/types/blog';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, senha: string, lembrar: boolean) => string | null;
  cadastrar: (dados: Omit<User, 'id'>) => string | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

const USERS_KEY = 'blog_users';
const SESSION_KEY = 'blog_session';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      const u = JSON.parse(saved) as User;
      // verify user still exists
      const allUsers: User[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      return allUsers.find(x => x.id === u.id) || null;
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  const login = useCallback((email: string, senha: string, lembrar: boolean): string | null => {
    const found = users.find(u => u.email === email && u.senha === senha);
    if (!found) return 'Email ou senha incorretos';
    setUser(found);
    const storage = lembrar ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(found));
    if (!lembrar) localStorage.removeItem(SESSION_KEY);
    return null;
  }, [users]);

  const cadastrar = useCallback((dados: Omit<User, 'id'>): string | null => {
    if (users.some(u => u.email === dados.email)) return 'Email já cadastrado';
    const novo: User = { ...dados, id: crypto.randomUUID() };
    setUsers(prev => [...prev, novo]);
    setUser(novo);
    localStorage.setItem(SESSION_KEY, JSON.stringify(novo));
    return null;
  }, [users]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, users, login, cadastrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
