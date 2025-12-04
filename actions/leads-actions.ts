import { apiClient } from '@/lib/api-client';

export const submitLead = async (email: string): Promise<{ message: string }> => {
  try {
    const response = await apiClient.post('/api/v1/leads/', { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};