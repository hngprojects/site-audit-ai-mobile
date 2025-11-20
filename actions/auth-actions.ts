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
  fullName: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const credentials: SignUpCredentials = { fullName, email, password };
  return await authService.signUp(credentials);
};

export const signOut = async (token: string): Promise<void> => {
  return await authService.signOut(token);
};

export const verifyToken = async (token: string) => {
  return await authService.verifyToken(token);
};

