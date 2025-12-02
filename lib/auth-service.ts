import { apiClient, formatErrorMessage, isAxiosError } from '@/lib/api-client';
import { googleAuthService } from '@/lib/google-auth-service';
import { appleAuthService } from '@/lib/apple-auth-service';
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
        const statusCode = error.response?.status;
        console.log('Sign in error details:', {
          status: statusCode,
          statusText: error.response?.statusText,
          data: errorData,
          url: error.config?.url,
          method: error.config?.method
        });

        // Prioritize API message, fallback to generic messages
        let errorMessage = 'Failed to sign in. Please try again.';

        if (errorData.message) {
          errorMessage = errorData.message; // ← API message takes priority
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (statusCode === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (statusCode && statusCode >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }

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

      // Check if this is a success message (user registered successfully)
      if (responseData.message && responseData.message.includes('User registered successfully')) {
        // This is a successful registration - show success message and redirect
        // Since no token/user data is provided, we'll throw a success message
        // that the UI can handle by showing success and redirecting appropriately
        const successMessage = responseData.message;
        const successError = new Error(successMessage);
        (successError as any).isSignupSuccess = true;
        throw successError;
      }

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
        const statusCode = error.response?.status;
        console.log('Sign up response details:', {
          status: statusCode,
          statusText: error.response?.statusText,
          data: errorData,
          url: error.config?.url,
          method: error.config?.method
        });

        // Always prioritize the API's message field
        if (errorData.message) {
          // For any message, just display it (success messages are handled above)
          throw new Error(errorData.message);
        }

        // Fallback error messages if no message field
        let errorMessage = 'Failed to sign up. Please try again.';
        if (errorData.error) {
          errorMessage = errorData.error;
        }

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
        // Prioritize API message
        if (errorData.message) {
          throw new Error(errorData.message);
        }
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
        // Prioritize API message
        if (errorData.message) {
          throw new Error(errorData.message);
        }
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
        // Prioritize API message
        if (errorData.message) {
          throw new Error(errorData.message);
        }
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to resend reset token. Please try again.');
    }
  },

  async resetPassword(
    currentPassword: string,
    newPassword: string,
    token: string
  ): Promise<void> {
    if (!currentPassword || !newPassword) {
      throw new Error('Current password and new password are required');
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }

    try {
      await apiClient.post(
        '/api/v1/auth/reset-password',
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        // Prioritize API message
        if (errorData.message) {
          throw new Error(errorData.message);
        }
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to reset password. Please try again.');
    }
  },

  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      // Get id_token from Google
      const idToken = await googleAuthService.signIn();
      const platform = googleAuthService.getPlatform();

      // Send id_token to backend
      const response = await apiClient.post('/api/v1/auth/oauth/google', {
        id_token: idToken,
        platform: platform,
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
        // Prioritize API message
        if (errorData.message) {
          throw new Error(errorData.message);
        }
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to sign in with Google. Please try again.');
    }
  },

  async signInWithApple(): Promise<AuthResponse> {
    try {
      // Get identity_token from Apple
      const identityToken = await appleAuthService.signIn();
      const platform = appleAuthService.getPlatform();

      // Send identity_token to backend
      const response = await apiClient.post('/api/v1/auth/oauth/apple', {
        identity_token: identityToken,
        platform: platform,
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
        // Prioritize API message
        if (errorData.message) {
          throw new Error(errorData.message);
        }
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to sign in with Apple. Please try again.');
    }
  },
};

