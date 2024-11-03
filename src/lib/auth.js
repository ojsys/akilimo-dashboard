// src/lib/auth.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      credentials: null,
      isAuthenticated: false,
      login: (credentials) => set({ 
        credentials,
        isAuthenticated: true 
      }),
      logout: () => set({ 
        credentials: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);