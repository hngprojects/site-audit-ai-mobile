import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, User, AuthResponse } from '@/type';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import * as authActions from '@/actions/auth-actions';

interface AuthStore extends AuthState {
  // Actions
  signIn: (email: string, password: string) => Promise<void>;
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
          // Check if we have a stored token
          const storedState = await storage.getItem<AuthState>(STORAGE_KEYS.AUTH_STATE);
          
          if (storedState?.token) {
            // Verify the token with the server
            const user = await authActions.verifyToken(storedState.token);
            
            if (user) {
              set({
                user,
                token: storedState.token,
                isAuthenticated: true,
                isLoading: false,
                isInitialized: true,
              });
            } else {
              // Token is invalid, clear auth state
              set({
                ...initialState,
                isInitialized: true,
              });
            }
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
          const item = await storage.getItem(name);
          return item ? JSON.stringify(item) : null;
        },
        setItem: async (name: string, value: string): Promise<void> => {
          await storage.setItem(name, JSON.parse(value));
        },
        removeItem: async (name: string): Promise<void> => {
          await storage.removeItem(name);
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

