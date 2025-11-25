import { authService } from '@/lib/auth-service';
import type { AuthResponse, SignInCredentials, SignUpCredentials } from '@/type';

/**
 * Authentication actions
 * These functions handle the business logic for authentication
 */

export const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const credentials: SignInCredentials = { email, password };
  return await authService.signIn(credentials);
};

export const signUp = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const credentials: SignUpCredentials = { email, password, fullName: '' };
  return await authService.signUp(credentials);
};

export const signOut = async (token: string): Promise<void> => {
  return await authService.signOut(token);
};

export const resendResetToken = async (email: string): Promise<void> => {
  return await authService.resendResetToken(email);
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  return await authService.signInWithGoogle();
};

