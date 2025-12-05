import { scanService, type ScanHistoryItem, type ScanResult } from '@/lib/scan-service';
import { useAuthStore } from '@/store/auth-store';

export const startScan = async (
  url: string,
  onEvent?: (eventName: string, data: any) => void
): Promise<{ job_id: string; status: string; message: string }> => {
  // Note: Authentication token is handled in scanService.startScan via fetch headers
  // No need to set apiClient headers for SSE requests

  return await scanService.startScan(url, onEvent);
};

export const getScanStatus = async (jobId: string): Promise<{
  job_id: string;
  status: string;
  progress_percent: number;
  current_step?: string;
  pages_discovered?: number;
  pages_selected?: number;
  pages_scanned?: number;
  error_message?: string;
  started_at?: string;
  completed_at?: string;
}> => {
  const token = useAuthStore.getState().token;
  // if (!token) {
  //   throw new Error('Authentication required. Please sign in.');
  // }

  // Set the token in the apiClient headers
  const { apiClient } = await import('@/lib/api-client');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }

  return await scanService.getScanStatus(jobId);
};

export const getScanResult = async (jobId: string): Promise<ScanResult> => {
  const token = useAuthStore.getState().token;
  // if (!token) {
  //   throw new Error('Authentication required. Please sign in.');
  // }

  // Set the token in the apiClient headers
  const { apiClient } = await import('@/lib/api-client');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }

  return await scanService.getScanResult(jobId);
};

export const getScanSummary = async (jobId: string) => {
  const token = useAuthStore.getState().token;
  // if (!token) {
  //   throw new Error('Authentication required. Please sign in.');
  // }

  // Set the token in the apiClient headers
  const { apiClient } = await import('@/lib/api-client');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }

  return await scanService.getScanSummary(jobId);
};

export const getScanIssues = async (jobId: string) => {
  const token = useAuthStore.getState().token;
  // if (!token) {
  //   throw new Error('Authentication required. Please sign in.');
  // }

  // Set the token in the apiClient headers
  const { apiClient } = await import('@/lib/api-client');
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }

  return await scanService.getScanIssues(jobId);
};

export const getScanHistory = async (): Promise<ScanHistoryItem[]> => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error('Authentication required. Please sign in.');
  }

  // Set the token in the apiClient headers
  const { apiClient } = await import('@/lib/api-client');
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return await scanService.getScanHistory();
};