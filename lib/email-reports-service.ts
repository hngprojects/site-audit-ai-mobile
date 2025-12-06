import type { EmailFrequency } from '@/store/email-reports-store';
import { apiClient, formatErrorMessage, isAxiosError } from './api-client';

export interface EmailReportsSettings {
  email_reports_frequency: EmailFrequency;
}

export interface EmailReportsResponse {
  status_code: number;
  status: string;
  message: string;
  data: EmailReportsSettings;
}

export const emailReportsService = {
  async getEmailReportsSettings(token: string): Promise<EmailReportsSettings> {
    try {
      const response = await apiClient.get<EmailReportsResponse>(
        '/api/v1/users/email-reports-settings',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch email reports settings. Please try again.');
    }
  },

  async updateEmailReportsSettings(
    frequency: EmailFrequency,
    token: string
  ): Promise<EmailReportsSettings> {
    try {
      const response = await apiClient.patch<EmailReportsResponse>(
        '/api/v1/users/email-reports-settings',
        { email_reports_frequency: frequency },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update email reports settings. Please try again.');
    }
  },
};