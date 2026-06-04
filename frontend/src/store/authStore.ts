/**
 * Auth store using Zustand
 */

import { create } from 'zustand';
import { User } from '@/types';
import { getUser, getAuthTokens, clearAuthTokens } from '@/lib/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) => set({ user }),

  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  logout: () => {
    clearAuthTokens();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const { accessToken } = getAuthTokens();
      const user = getUser();

      if (accessToken && user) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    }
  },
}));
