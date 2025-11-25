import * as authActions from '@/actions/auth-actions';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { AuthState } from '@/type';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AuthStore extends AuthState {
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isInitialized: false,
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      error: null,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authActions.signIn(email, password);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to sign in',
          });
          throw error;
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authActions.signInWithGoogle();
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to sign in with Google',
          });
          throw error;
        }
      },

      signUp: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authActions.signUp(email, password);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to sign up',
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true });
        try {
          const state = get();
          if (state.token) {
            await authActions.signOut(state.token);
          }
          set({
            ...initialState,
            isInitialized: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to sign out',
          });
        }
      },

      initialize: async () => {
        const state = get();
        if (state.isInitialized) return;

        set({ isLoading: true });

        try {
          if (state.token && state.user) {
            set({
              isLoading: false,
              isInitialized: true,
            });
          } else {
            set({
              ...initialState,
              isInitialized: true,
            });
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({
            ...initialState,
            isInitialized: true,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: STORAGE_KEYS.AUTH_STATE,
      storage: createJSONStorage(() => ({
        getItem: async (name: string): Promise<string | null> => {
          try {
            const item = await storage.getItem(name);
            return item ? JSON.stringify(item) : null;
          } catch (error) {
            console.error('Error getting item from storage in persist:', error);
            return null;
          }
        },
        setItem: async (name: string, value: string): Promise<void> => {
          try {
            await storage.setItem(name, JSON.parse(value));
          } catch (error) {
            console.error('Error setting item to storage in persist:', error);
          }
        },
        removeItem: async (name: string): Promise<void> => {
          try {
            await storage.removeItem(name);
          } catch (error) {
            console.error('Error removing item from storage in persist:', error);
          }
        },
      })),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

