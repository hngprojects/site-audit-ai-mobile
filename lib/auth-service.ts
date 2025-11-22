import type { AuthResponse, SignInCredentials, SignUpCredentials } from '@/type';
import axios, { isAxiosError } from 'axios';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';
export const MIN_PASSWORD_LENGTH = 6;

if (!BASE_URL) {
  console.warn('EXPO_PUBLIC_BASE_URL is not set. Please add it to your .env file.');
}

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to check if error is an authentication error
export const isAuthError = (error: unknown): boolean => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.response?.data?.error || '';
    const errorData = error.response?.data || {};
    
    // Check for 401 status or authentication-related error messages
    if (status === 401) {
      return true;
    }
    
    // Check for authentication error messages
    const authErrorMessages = [
      'Invalid authentication credentials',
      'Unauthenticated',
      'Authentication failed',
      'Token expired',
      'Invalid token',
    ];
    
    const errorText = typeof errorMessage === 'string' 
      ? errorMessage.toLowerCase() 
      : formatErrorMessage(errorData).toLowerCase();
    
    return authErrorMessages.some(msg => errorText.includes(msg.toLowerCase()));
  }
  
  if (error instanceof Error) {
    const errorText = error.message.toLowerCase();
    return errorText.includes('invalid authentication credentials') ||
           errorText.includes('unauthenticated') ||
           errorText.includes('authentication failed') ||
           errorText.includes('token expired') ||
           errorText.includes('invalid token');
  }
  
  return false;
};

const formatErrorMessage = (errorData: any): string => {
  if (errorData.data?.errors && Array.isArray(errorData.data.errors)) {
    const flattenErrors = (arr: any[]): string[] => {
      const result: string[] = [];
      for (const item of arr) {
        if (typeof item === 'string') {
          result.push(item);
        } else if (Array.isArray(item)) {
          result.push(...flattenErrors(item));
        } else if (item && typeof item === 'object') {
          if (item.message) {
            result.push(item.message);
          } else if (item.error) {
            result.push(item.error);
          } else {
            Object.values(item).forEach((val) => {
              if (typeof val === 'string') {
                result.push(val);
              } else if (Array.isArray(val)) {
                result.push(...flattenErrors(val));
              }
            });
          }
        }
      }
      return result;
    };
    
    const errorMessages = flattenErrors(errorData.data.errors);
    
    if (errorMessages.length > 0) {
      return errorMessages.join('. ');
    }
  }
  
  return errorData.message || errorData.error || 'An error occurred';
};

export const authService = {
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    const { email, password } = credentials;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await apiClient.post('/api/v1/auth/login', { email, password });
      const responseData = response.data;
      
      const token = responseData.data?.access_token || responseData.data?.token || responseData.access_token || responseData.token;
      const apiUser = responseData.data?.user || responseData.user;
      
      if (!apiUser || !token) {
        throw new Error('Invalid response from server');
      }
      
      const user = {
        id: apiUser.id,
        email: apiUser.email,
        fullName: apiUser.first_name && apiUser.last_name 
          ? `${apiUser.first_name} ${apiUser.last_name}`.trim()
          : apiUser.fullName || apiUser.username || '',
        createdAt: apiUser.created_at || apiUser.createdAt || new Date().toISOString(),
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
      console.log(responseData);
      
      const token = responseData.data?.access_token || responseData.data?.token || responseData.access_token || responseData.token;
      const apiUser = responseData.data?.user || responseData.user;
      
      if (!apiUser || !token) {
        throw new Error('Invalid response from server');
      }
      
      const user = {
        id: apiUser.id,
        email: apiUser.email,
        fullName: apiUser.first_name && apiUser.last_name 
          ? `${apiUser.first_name} ${apiUser.last_name}`.trim()
          : apiUser.fullName || apiUser.username || '',
        createdAt: apiUser.created_at || apiUser.createdAt || new Date().toISOString(),
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

  async getUser(token: string): Promise<AuthResponse['user']> {
    if (!token) {
      throw new Error('Token is required');
    }

    try {
      const response = await apiClient.get('/api/v1/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const responseData = response.data;
      const apiUser = responseData.data?.user || responseData.user || responseData.data || responseData;

      if (!apiUser) {
        throw new Error('Invalid response from server');
      }

      const user = {
        id: apiUser.id,
        email: apiUser.email,
        fullName: apiUser.first_name && apiUser.last_name
          ? `${apiUser.first_name} ${apiUser.last_name}`.trim()
          : apiUser.fullName || apiUser.username || '',
        createdAt: apiUser.created_at || apiUser.createdAt || new Date().toISOString(),
      };

      return user;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch user data. Please try again.');
    }
  },

  async updateUser(
    token: string,
    data: { first_name: string; last_name: string; phone_number: string }
  ): Promise<AuthResponse['user']> {
    if (!token) {
      throw new Error('Token is required');
    }

    if (!data.first_name || !data.last_name) {
      throw new Error('First name and last name are required');
    }

    try {
      const response = await apiClient.put(
        '/api/v1/users/me',
        {
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = response.data;
      const apiUser = responseData.data?.user || responseData.user || responseData.data || responseData;

      if (!apiUser) {
        throw new Error('Invalid response from server');
      }

      const user = {
        id: apiUser.id,
        email: apiUser.email,
        fullName: apiUser.first_name && apiUser.last_name
          ? `${apiUser.first_name} ${apiUser.last_name}`.trim()
          : apiUser.fullName || apiUser.username || '',
        createdAt: apiUser.created_at || apiUser.createdAt || new Date().toISOString(),
        profilePicture: apiUser.profile_picture || apiUser.profilePicture || undefined,
      };

      return user;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update user. Please try again.');
    }
  },

  async resetPassword(
    token: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    if (!token) {
      throw new Error('Token is required');
    }

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
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to reset password. Please try again.');
    }
  },

  async uploadProfilePicture(token: string, fileUri: string): Promise<string> {
    if (!token) {
      throw new Error('Token is required');
    }

    if (!fileUri) {
      throw new Error('File is required');
    }

    try {
      const formData = new FormData();
      
      // Extract filename from URI
      const filename = fileUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('file', {
        uri: fileUri,
        name: filename,
        type: type,
      } as any);

      const response = await apiClient.post(
        '/api/v1/users/me/profile-picture',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Return the profile picture URL from response
      const responseData = response.data;
      return responseData.data?.profile_picture || responseData.profile_picture || responseData.data?.url || '';
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to upload profile picture. Please try again.');
    }
  },

  async deleteProfilePicture(token: string): Promise<void> {
    if (!token) {
      throw new Error('Token is required');
    }

    try {
      await apiClient.delete('/api/v1/users/me/profile-picture', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      throw new Error('Failed to delete profile picture. Please try again.');
    }
  },
};

