import { apiClient, formatErrorMessage, isAxiosError } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';
import { getPersistentDeviceInfo } from '@/utils/device-id';

export interface StartScanRequest {
  top_n: number;
  url: string;
}

export interface StartScanResponse {
  status_code: number;
  status: string;
  message: string;
  data: {
    job_id: string;
    status: string;
    message: string;
  };
}

export interface ScanStatusResponse {
  status_code: number;
  status: string;
  message: string;
  data: {
    job_id: string;
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'scraping';
    progress_percent: number;
    current_step?: string;
    pages_discovered?: number;
    pages_selected?: number;
    pages_scanned?: number;
    error_message?: string;
    started_at?: string;
    completed_at?: string;
  };
}

export interface Issue {
  id: string;
  title: string;
  score: number;
  description: string;
  category?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  page_url?: string;
  business_benefits?: string[];
  impact_message?: string;
  icon?: 'alert' | 'warning';
}

export interface ScanResult {
  job_id: string;
  url: string;
  overall_score: number;
  status: 'Good' | 'Warning' | 'Critical';
  issues: Issue[];
  scanned_at: string;
  created_at: string;
  updated_at: string;
}

export interface ScanResultResponse {
  status_code: number;
  status: string;
  message: string;
  data: ScanResult;
}

export interface CategoryIssue {
  title: string;
  description: string;
}

export interface SummaryCategoryData {
  key: string;
  title: string;
  severity: string;
  score: number;
  score_max: number;
  short_description: string;
}

export interface CategoryData {
  key: string;
  title: string;
  description: string;
  section_title: string;
  score: number;
  score_max: number;
  business_impact: string[];
  problems: CategoryIssue[];
  suggestion: string[];
}

export interface IssuesResult {
  job_id: string;
  website_score: number;
  scan_date: string;
  summary_message: string;
  categories: CategoryData[];
}

export interface IssuesResultResponse {
  status_code: number;
  status: string;
  message: string;
  data: IssuesResult;
}

export interface SummaryResult {
  job_id: string;
  website_score: number;
  scan_date: string;
  summary_message: string;
  categories: SummaryCategoryData[];
}

export interface SummaryResultResponse {
  status_code: number;
  status: string;
  message: string;
  data: SummaryResult;
}

export interface ScanHistorySite {
  id: string;
  root_url: string;
}

export interface ScanHistoryItem {
  id: string;
  status: string;
  created_at: string;
  completed_at: string;
  site: ScanHistorySite;
}

export interface ScanHistoryResponse {
  status_code: number;
  status: string;
  message: string;
  data: ScanHistoryItem[];
}

function transformBackendDataToScanResult(backendData: any): ScanResult {
  const { results } = backendData;
  const issues: Issue[] = [];

  const categoryScores = {
    ux: results.score_accessibility || 0,
    performance: results.score_performance || 0,
    seo: results.score_seo || 0
  };

  const firstPage = results.selected_pages[0];
  if (firstPage) {
    const { analysis_details } = firstPage;

    issues.push({
      id: `ux-overall`,
      title: 'User Experience Issues',
      score: categoryScores.ux,
      description: analysis_details.ux?.impact_message || 'Issues affecting user experience and usability of the website.',
      category: 'UX',
      severity: categoryScores.ux < 50 ? 'high' : categoryScores.ux < 70 ? 'medium' : 'low',
      page_url: firstPage.url,
      business_benefits: analysis_details.ux?.business_benefits || [],
      impact_message: analysis_details.ux?.impact_message || '',
      icon: categoryScores.ux < 50 ? 'alert' : 'warning'
    });

    issues.push({
      id: `performance-overall`,
      title: 'Performance Issues',
      score: categoryScores.performance,
      description: analysis_details.performance?.impact_message || 'Issues affecting website loading speed and performance.',
      category: 'Performance',
      severity: categoryScores.performance < 50 ? 'high' : categoryScores.performance < 70 ? 'medium' : 'low',
      page_url: firstPage.url,
      business_benefits: analysis_details.performance?.business_benefits || [],
      impact_message: analysis_details.performance?.impact_message || '',
      icon: categoryScores.performance < 50 ? 'alert' : 'warning'
    });

    issues.push({
      id: `seo-overall`,
      title: 'SEO Issues',
      score: categoryScores.seo,
      description: analysis_details.seo?.impact_message || 'Issues affecting search engine optimization and visibility.',
      category: 'SEO',
      severity: categoryScores.seo < 50 ? 'high' : categoryScores.seo < 70 ? 'medium' : 'low',
      page_url: firstPage.url,
      business_benefits: analysis_details.seo?.business_benefits || [],
      impact_message: analysis_details.seo?.impact_message || '',
      icon: categoryScores.seo < 50 ? 'alert' : 'warning'
    });
  }

  return {
    job_id: backendData.job_id,
    url: results.selected_pages[0]?.url || '',
    overall_score: results.score_overall,
    status: results.score_overall >= 80 ? 'Good' : results.score_overall >= 50 ? 'Warning' : 'Critical',
    issues,
    scanned_at: results.selected_pages[0]?.analysis_details.scan_date || new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export const scanService = {
  async startScan(
    url: string,
    onEvent?: (eventName: string, data: any) => void
  ): Promise<{ job_id: string; status: string; message: string }> {
    if (!url) {
      throw new Error('URL is required');
    }

    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;
    const userId = authState.user?.id;

    try {
      const deviceInfo = await getPersistentDeviceInfo();
      const queryParams = new URLSearchParams({
        url: url,
        device_id: deviceInfo.deviceId,
      });

      if (isAuthenticated && userId) {
        queryParams.append('user_id', userId);
      }

      const baseUrl = process.env.EXPO_PUBLIC_BASE_URL || '';
      const apiUrl = `${baseUrl}/api/v1/scan/start-scan-sse?${queryParams.toString()}`;

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        let lastProcessedIndex = 0;
        let firstJobId: string | null = null;
        let buffer = '';

        xhr.open('POST', apiUrl);
        xhr.setRequestHeader('Accept', 'text/event-stream');

        if (isAuthenticated && token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }

        const processedEvents = new Set<string>();

        const processEventIfNew = (eventName: string, dataJson: string) => {
          const eventKey = `${eventName}-${dataJson.substring(0, 50)}`;
          if (!processedEvents.has(eventKey)) {
            processedEvents.add(eventKey);
            processEventImmediately(eventName, dataJson);
          }
        };

        const parseAndProcessEvents = (lines: string[]) => {
          let currentEvent: string | null = null;
          let currentDataLines: string[] = [];
          let processedUpTo = 0;

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (line.trim().startsWith(':')) {
              processedUpTo = i + 1;
              continue;
            }

            if (line.startsWith('event:')) {
              if (currentEvent && currentDataLines.length > 0) {
                processEventIfNew(currentEvent, currentDataLines.join('').trim());
                processedUpTo = i;
                currentDataLines = [];
              }
              currentEvent = line.replace('event:', '').trim();
            } else if (line.startsWith('data:')) {
              currentDataLines.push(line.replace('data:', '').trim());
            } else if (line.trim() === '') {
              if (currentEvent && currentDataLines.length > 0) {
                processEventIfNew(currentEvent, currentDataLines.join('').trim());
                processedUpTo = i + 1;
                currentEvent = null;
                currentDataLines = [];
              } else {
                processedUpTo = i + 1;
              }
            }
          }

          if (currentEvent && currentDataLines.length > 0) {
            processEventIfNew(currentEvent, currentDataLines.join('').trim());
            processedUpTo = lines.length;
          }

          return processedUpTo;
        };

        const processResponse = () => {
          const responseText = xhr.responseText;
          if (!responseText) return;

          const newData = responseText.slice(lastProcessedIndex);
          if (!newData) return;

          lastProcessedIndex = responseText.length;
          buffer += newData;

          const lines = buffer.split('\n');
          const processedUpTo = parseAndProcessEvents(lines);

          if (processedUpTo > 0) {
            buffer = lines.slice(processedUpTo).join('\n');
          }
        };

        const processEventImmediately = (eventName: string, dataJson: string) => {
          try {
            const parsedData = JSON.parse(dataJson);
            const finalEventName = eventName || parsedData.event_type || 'message';

            if (!firstJobId && parsedData.job_id) {
              firstJobId = parsedData.job_id;
              resolve({
                job_id: firstJobId!,
                status: parsedData.status || parsedData.event_type || 'queued',
                message: parsedData.message || 'Scan started',
              });
            }

            // Forward to callback
            if (onEvent && finalEventName) {
              try {
                onEvent(finalEventName, parsedData);
              } catch (callbackError) {
                console.error('[ScanService] Error in callback:', callbackError);
              }
            }
          } catch (parseError) {
            console.warn('[ScanService] Failed to parse SSE data:', parseError);
          }
        };

        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.LOADING || xhr.readyState === XMLHttpRequest.DONE) {
            processResponse();
          }
        };

        xhr.onprogress = () => {
          processResponse();
        };

        xhr.onload = () => {
          // Process any remaining buffer data
          if (buffer) {
            processResponse();
          }

          // Fallback: Process entire response to catch any missed events
          if (xhr.responseText) {
            const lines = xhr.responseText.split('\n');
            parseAndProcessEvents(lines);
          }

          if (!firstJobId) {
            reject(new Error('No job_id received from scan'));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during scan'));
        };

        xhr.ontimeout = () => {
          reject(new Error('Scan request timed out'));
        };

        xhr.send();
      });
    } catch (error) {
      console.error('[ScanService] startScan error:', {
        error,
        url,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to start scan. Please try again.');
    }
  },

  async getScanStatus(jobId: string): Promise<{
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
  }> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (isAuthenticated && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await apiClient.get<ScanStatusResponse>(
        `/api/v1/scan/${jobId}/status`,
        { headers }
      );
      const responseData = response.data;

      return responseData.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch scan status. Please try again.');
    }
  },

  async getScanResult(jobId: string): Promise<ScanResult> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (isAuthenticated && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await apiClient.get<ScanResultResponse>(
        `/api/v1/scan/${jobId}/results`,
        { headers }
      );
      const responseData = response.data;

      return transformBackendDataToScanResult(responseData.data);
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch scan result. Please try again.');
    }
  },

  async getScanSummary(jobId: string): Promise<SummaryResult> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (isAuthenticated && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await apiClient.get<SummaryResultResponse>(
        `/api/v1/scan/${jobId}/results`,
        { headers }
      );
      const responseData = response.data;

      return responseData.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch scan summary. Please try again.');
    }
  },

  async getScanIssues(jobId: string): Promise<IssuesResult> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (isAuthenticated && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await apiClient.get<IssuesResultResponse>(
        `/api/v1/scan/${jobId}/issues`,
        { headers }
      );
      const responseData = response.data;

      return responseData.data;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch scan issues. Please try again.');
    }
  },

  async getScanHistory(): Promise<ScanHistoryItem[]> {
    const authState = useAuthStore.getState();
    const token = authState.token;

    if (!token) {
      throw new Error('Authentication required. Please sign in.');
    }

    const headers: any = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await apiClient.get<ScanHistoryResponse>(
        '/api/v1/scan/history',
        { headers }
      );
      const responseData = response.data;
      console.log('Scan history response:', responseData);

      if (Array.isArray(responseData)) {
        return responseData;
      }
      return responseData.data || [];
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch scan history. Please try again.');
    }
  },

  async stopScan(jobId: string): Promise<{ success: boolean; message?: string }> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (isAuthenticated && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await apiClient.post(
        `/api/v1/scan/${jobId}/stop`,
        {},
        { headers }
      );

      return {
        success: true,
        message: response.data?.message || 'Scan stopped successfully',
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
      throw new Error('Failed to stop scan. Please try again.');
    }
  },

  async deleteScan(jobId: string): Promise<{ success: boolean; message?: string }> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const authState = useAuthStore.getState();
    const token = authState.token;

    if (!token) {
      throw new Error('Authentication required. Please sign in.');
    }

    const headers: any = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await apiClient.delete(
        `/api/v1/scan/${jobId}`,
        { headers }
      );

      return {
        success: true,
        message: response.data?.message || 'Scan deleted successfully',
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
      throw new Error('Failed to delete scan. Please try again.');
    }
  },

  async deleteMultipleScans(jobIds: string[]): Promise<{
    success: boolean;
    deleted: string[];
    failed: { jobId: string; error: string }[];
  }> {
    if (!jobIds || jobIds.length === 0) {
      throw new Error('At least one Job ID is required');
    }

    const authState = useAuthStore.getState();
    const token = authState.token;

    if (!token) {
      throw new Error('Authentication required. Please sign in.');
    }

    const deleted: string[] = [];
    const failed: { jobId: string; error: string }[] = [];

    await Promise.all(
      jobIds.map(async (jobId) => {
        try {
          await this.deleteScan(jobId);
          deleted.push(jobId);
        } catch (error) {
          failed.push({
            jobId,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      })
    );

    return {
      success: failed.length === 0,
      deleted,
      failed,
    };
  },
};