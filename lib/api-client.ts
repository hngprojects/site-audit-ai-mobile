import axios, { AxiosError, InternalAxiosRequestConfig, isAxiosError } from 'axios';
import { authService } from './auth-service';
import { useAuthStore } from '@/store/auth-store';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';

if (!BASE_URL) {
  console.warn('EXPO_PUBLIC_BASE_URL is not set. Please add it to your .env file.');
}

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor to add token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = useAuthStore.getState();
    if (state.token && config.headers) {
      config.headers.Authorization = `Bearer ${state.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is not 401 or request was already retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          if (originalRequest.headers && token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const state = useAuthStore.getState();
    const refreshToken = state.refreshToken;

    if (!refreshToken) {
      // No refresh token available, sign out user
      useAuthStore.getState().signOut();
      processQueue(new Error('No refresh token available'), null);
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      // Attempt to refresh the token
      const { token: newToken, refreshToken: newRefreshToken } = await authService.refreshToken(refreshToken);

      // Update the auth store with new tokens
      useAuthStore.setState({
        token: newToken,
        refreshToken: newRefreshToken || refreshToken,
      });

      // Update the original request with new token
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
      }

      // Process queued requests
      processQueue(null, newToken);
      isRefreshing = false;

      // Retry the original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh failed, sign out user
      useAuthStore.getState().signOut();
      processQueue(refreshError instanceof Error ? refreshError : new Error('Token refresh failed'), null);
      isRefreshing = false;
      return Promise.reject(refreshError);
    }
  }
);

export const formatErrorMessage = (errorData: any): string => {
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
  console.log('errorData', errorData);
  return errorData.message || errorData.error || 'An error occurred';
};

export { isAxiosError };

