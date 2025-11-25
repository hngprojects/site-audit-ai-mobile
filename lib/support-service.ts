import { apiClient, formatErrorMessage, isAxiosError } from '@/lib/api-client';

export interface SendEmailRequest {
  email: string;
  subject: string;
  message: string;
}

export interface SendEmailResponse {
  status_code: number;
  status: string;
  message: string;
  data?: any;
}

export const supportService = {
  async sendEmail(data: SendEmailRequest): Promise<SendEmailResponse> {
    const { email, subject, message } = data;

    if (!email || !subject || !message) {
      throw new Error('Email, subject, and message are required');
    }

    try {
      const response = await apiClient.post<SendEmailResponse>('/api/v1/support/email/', {
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = formatErrorMessage(error.response || error);
        throw new Error(errorMessage);
      }
      throw error;
    }
  },
};

