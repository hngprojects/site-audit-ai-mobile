import type { User } from '@/type';
import { apiClient, formatErrorMessage, isAxiosError } from './api-client';

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
}

export interface ProfileResponse {
  status_code: number;
  status: string;
  message: string;
  data: {
    id: string;
    email: string;
    username: string;
    first_name?: string | null;
    last_name?: string | null;
    phone_number?: string | null;
    profile_picture_url?: string | null;
    is_email_verified: boolean;
    created_at: string;
    updated_at?: string;
  };
}

export const profileService = {
  async getProfile(token: string): Promise<User> {
    try {
      const response = await apiClient.get<ProfileResponse>(
        '/api/v1/users/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data;
      const apiUser = responseData.data;
      
      const fullName = apiUser.first_name && apiUser.last_name
        ? `${apiUser.first_name} ${apiUser.last_name}`.trim()
        : apiUser.first_name || apiUser.last_name || apiUser.username || '';
      
      return {
        id: apiUser.id,
        email: apiUser.email,
        fullName,
        createdAt: apiUser.created_at,
        phoneNumber: apiUser.phone_number || undefined,
        profileImage: apiUser.profile_picture_url || undefined,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch profile. Please try again.');
    }
  },

  async updateProfile(
    data: UpdateProfileRequest,
    token: string
  ): Promise<User> {
    try {
      const response = await apiClient.patch<ProfileResponse>(
        '/api/v1/users/me',
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const responseData = response.data;
      const apiUser = responseData.data;
      
      const fullName = apiUser.first_name && apiUser.last_name
        ? `${apiUser.first_name} ${apiUser.last_name}`.trim()
        : apiUser.first_name || apiUser.last_name || apiUser.username || '';
      
      return {
        id: apiUser.id,
        email: apiUser.email,
        fullName,
        createdAt: apiUser.created_at,
        phoneNumber: apiUser.phone_number || undefined,
        profileImage: apiUser.profile_picture_url || undefined,
      };
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update profile. Please try again.');
    }
  },

  async uploadProfileImage(
    imageUri: string,
    token: string
  ): Promise<string> {
    try {
      const formData = new FormData();
      const filename = imageUri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const extension = match ? match[1].toLowerCase() : 'jpg';
      
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      if (!allowedExtensions.includes(extension)) {
        throw new Error('Invalid file type. Please use jpg, png, webp, or gif format.');
      }

      const type = `image/${extension === 'jpg' ? 'jpeg' : extension}`;

      formData.append('file', {
        uri: imageUri,
        name: filename,
        type,
      } as any);

      const response = await apiClient.post<ProfileResponse>(
        '/api/v1/users/me/profile-picture',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data.data.profile_picture_url || '';
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to upload profile image. Please try again.');
    }
  },

  async deleteProfileImage(token: string): Promise<void> {
    try {
      await apiClient.delete(
        '/api/v1/users/me/profile-picture',
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
      throw new Error('Failed to delete profile image. Please try again.');
    }
  },
};

