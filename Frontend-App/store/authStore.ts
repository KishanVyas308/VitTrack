import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { User } from '../types';
import { buildUrl, API_ENDPOINTS } from '../config/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  searchUserByEmail: (email: string) => Promise<User | null>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Login with email and password
          const response = await fetch(buildUrl(API_ENDPOINTS.USER_LOGIN), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Invalid email or password' }));
            throw new Error(errorData.detail || 'Invalid email or password');
          }

          const userData = await response.json();
          const user: User = {
            id: userData.id.toString(),
            name: userData.name,
            email: userData.email,
            createdAt: new Date(userData.created_at),
          };
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      signUp: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // Create new user with password
          const response = await fetch(buildUrl(API_ENDPOINTS.USERS), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Failed to create user');
          }

          const userData = await response.json();
          const user: User = {
            id: userData.id.toString(),
            name: userData.name,
            email: userData.email,
            createdAt: new Date(userData.created_at),
          };
          
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
          set({ isLoading: false, error: errorMessage });
          throw error;
        }
      },

      signOut: async () => {
        set({ user: null, isAuthenticated: false, error: null });
      },

      updateProfile: async (data: Partial<User>) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        }));
      },

      searchUserByEmail: async (email: string) => {
        try {
          const response = await fetch(buildUrl(API_ENDPOINTS.USER_SEARCH), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          });

          if (!response.ok) {
            return null;
          }

          const users = await response.json();
          if (users && users.length > 0) {
            const userData = users[0];
            return {
              id: userData.id.toString(),
              name: userData.name,
              email: userData.email,
              createdAt: new Date(userData.created_at),
            };
          }
          return null;
        } catch (error) {
          console.error('Error searching user:', error);
          return null;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
