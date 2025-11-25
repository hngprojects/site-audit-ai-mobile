import { apiClient, formatErrorMessage, isAxiosError } from '@/lib/api-client';
import type { AuthResponse, SignInCredentials, SignUpCredentials } from '@/type';

export const MIN_PASSWORD_LENGTH = 6;

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await apiClient.post('/api/v1/auth/login', { email, password });
      const responseData = response.data;
      
      // Extract token from response.data.access_token
      const token = responseData.data?.access_token;
      const apiUser = responseData.data?.user;
      
      if (!apiUser || !token) {
        throw new Error('Invalid response from server');
      }
      
      // Construct full name from first_name and last_name, fallback to username
      const fullName = apiUser.first_name && apiUser.last_name
        ? `${apiUser.first_name} ${apiUser.last_name}`.trim()
        : apiUser.first_name || apiUser.last_name || apiUser.username || '';
      
      const user = {
        id: apiUser.id,
        email: apiUser.email,
        fullName,
        createdAt: apiUser.created_at || new Date().toISOString(),
        phoneNumber: apiUser.phone_number || undefined,
        profileImage: apiUser.profile_picture_url || undefined,
      };
      
      return { user, token };
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to sign in. Please try again.');
    }
  },

  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    try {
      const response = await apiClient.post('/api/v1/auth/signup', {
        email,
        password,
        username: email.split('@')[0],
      });
      
      const responseData = response.data;
      
      // Extract token from response.data.access_token
      const token = responseData.data?.access_token;
      const apiUser = responseData.data?.user;
      
      if (!apiUser || !token) {
        throw new Error('Invalid response from server');
      }
      
      // Construct full name from first_name and last_name, fallback to username
      const fullName = apiUser.first_name && apiUser.last_name
        ? `${apiUser.first_name} ${apiUser.last_name}`.trim()
        : apiUser.first_name || apiUser.last_name || apiUser.username || '';
      
      const user = {
        id: apiUser.id,
        email: apiUser.email,
        fullName,
        createdAt: apiUser.created_at || new Date().toISOString(),
        phoneNumber: apiUser.phone_number || undefined,
        profileImage: apiUser.profile_picture_url || undefined,
      };
      
      return { user, token };
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        console.log(errorData);
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to sign up. Please try again.');
    }
  },

  async signOut(token: string): Promise<void> {
    try {
      await apiClient.post(
        '/api/v1/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // Even if the request fails, we still want to sign out locally
      console.error('Error signing out:', error);
    }
  },

  async forgotPassword(email: string): Promise<void> {
    if (!email) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    try {
      await apiClient.post('/api/v1/auth/forgot-password', { email });
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to send password reset email. Please try again.');
    }
  },

  async verifyForgotPassword(email: string, token: string, newPassword: string): Promise<void> {
    if (!email || !token || !newPassword) {
      throw new Error('Email, token, and new password are required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    try {
      await apiClient.post('/api/v1/auth/verify-forgot-password', {
        email,
        token,
        new_password: newPassword,
      });
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to reset password. Please try again.');
    }
  },

  async resendResetToken(email: string): Promise<void> {
    if (!email) {
      throw new Error('Email is required');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    try {
      await apiClient.post('/api/v1/auth/resend-reset-token', { email });
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to resend reset token. Please try again.');
    }
  },
};

