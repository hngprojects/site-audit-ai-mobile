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

export const getUser = async (token: string): Promise<AuthResponse['user']> => {
  return await authService.getUser(token);
};

export const updateUser = async (
  token: string,
  data: { first_name: string; last_name: string; phone_number: string }
): Promise<AuthResponse['user']> => {
  return await authService.updateUser(token, data);
};

export const resetPassword = async (
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  return await authService.resetPassword(token, currentPassword, newPassword);
};

