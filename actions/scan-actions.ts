import { scanService, type ScanResult } from '@/lib/scan-service';

export const startScan = async (url: string, topN: number = 15): Promise<{ job_id: string; status: string; message: string }> => {
  // const token = useAuthStore.getState().token;
  // if (!token) {
  //   throw new Error('Authentication required. Please sign in.');
  // }

  // Set the token in the apiClient headers
  // const { apiClient } = await import('@/lib/api-client');
  // apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return await scanService.startScan(url, topN);
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
  // const token = useAuthStore.getState().token;
  // if (!token) {
  //   throw new Error('Authentication required. Please sign in.');
  // }

  // // Set the token in the apiClient headers
  // const { apiClient } = await import('@/lib/api-client');
  // apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return await scanService.getScanStatus(jobId);
};

export const getScanResult = async (jobId: string): Promise<ScanResult> => {
  // const token = useAuthStore.getState().token;
  // if (!token) {
  //   throw new Error('Authentication required. Please sign in.');
  // }

  // // Set the token in the apiClient headers
  // const { apiClient } = await import('@/lib/api-client');
  // apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  return await scanService.getScanResult(jobId);
};