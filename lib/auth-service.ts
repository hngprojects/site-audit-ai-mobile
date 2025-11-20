import type { AuthResponse, SignInCredentials, SignUpCredentials } from '@/type';

/**
 * Authentication service
 * Makes HTTP requests to the backend API
 */

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';

if (!BASE_URL) {
  console.warn('EXPO_PUBLIC_BASE_URL is not set. Please add it to your .env file.');
}

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Invalid email or password');
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to sign in. Please try again.');
    }
  },

  /**
   * Sign up with email, password, and full name
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    const { email, password, fullName } = credentials;

    // Validate input
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password length
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username:email.split('@')[0] }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to sign up');
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to sign up. Please try again.');
    }
  },

  /**
   * Sign out (clears session)
   */
  async signOut(token: string): Promise<void> {
    try {
      await fetch(`${BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Even if the request fails, we still want to sign out locally
      console.error('Error signing out:', error);
    }
  },

  /**
   * Verify token (validate token with server)
   */
  async verifyToken(token: string): Promise<AuthResponse['user'] | null> {
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/v1/auth/verify-email`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user || null;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  },
};

