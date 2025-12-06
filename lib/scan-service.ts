import { apiClient, formatErrorMessage, isAxiosError } from '@/lib/api-client';
import { storage } from '@/lib/storage';
import { useAuthStore } from '@/store/auth-store';

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

export interface DiscoveredPage {
  id: string;
  name: string;
  url: string;
  title: string;
  status: number;
  lastModified: string;
  size: number;
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
  description: string;
  category?: string;
}

export interface PageDiscoveryResult {
  domain: string;
  total_pages: number;
  pages: DiscoveredPage[];
  discovered_at: string;
}

export interface DiscoveryRequest {
  url: string;
}

export interface DiscoveryResponse {
  status_code: number;
  status: string;
  message: string;
  data: {
    base_url: string;
    discovered_count: number;
    important_urls: {
      title: string;
      url: string;
      priority: string;
      description: string;
    }[];
  };
}


// Temporary storage for discovery results
let lastDiscoveryResult: PageDiscoveryResult | null = null;

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
      const queryParams = new URLSearchParams({
        url: url,
      });

      if (isAuthenticated && userId) {
        // Authenticated users: send user_id, no device_id
        queryParams.append('user_id', userId);
      } else {
        // Anonymous users: send device_id
        const deviceInfo = await getPersistentDeviceInfo();
        queryParams.append('device_id', deviceInfo.deviceId);
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
          // Check HTTP status first
          if (xhr.status !== 200) {
            console.error('[ScanService] HTTP error:', {
              status: xhr.status,
              statusText: xhr.statusText,
              response: xhr.responseText?.substring(0, 500),
            });

            let errorMessage = `Scan request failed with status ${xhr.status}`;
            try {
              const errorData = JSON.parse(xhr.responseText);
              errorMessage = errorData.message || errorData.detail || errorMessage;
            } catch {
              // Response is not JSON, use status-based message
              if (xhr.status === 401) {
                errorMessage = 'Authentication failed. Please sign in again.';
              } else if (xhr.status === 403) {
                errorMessage = 'Access denied. You do not have permission to perform this scan.';
              } else if (xhr.status >= 500) {
                errorMessage = 'Server error. Please try again later.';
              }
            }
            reject(new Error(errorMessage));
            return;
          }

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
            console.error('[ScanService] No job_id found in response:', {
              responseLength: xhr.responseText?.length,
              responsePreview: xhr.responseText?.substring(0, 500),
              processedEventsCount: processedEvents.size,
            });
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
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
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

    const token = useAuthStore.getState().token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await apiClient.get<ScanStatusResponse>(
        `/api/v1/scan/${jobId}/status`,
        { headers }
      );

      const responseData = response.data;

      if (responseData.status_code === 200) {
        const statusData = responseData.data;
        return {
          job_id: statusData.job_id,
          status: statusData.status,
          progress_percent: statusData.progress_percent,
          current_step: statusData.current_step,
          pages_discovered: statusData.pages_discovered,
          pages_selected: statusData.pages_selected,
          pages_scanned: statusData.pages_scanned,
          error_message: statusData.error_message,
          started_at: statusData.started_at,
          completed_at: statusData.completed_at
        };
      } else {
        throw new Error(responseData.message || 'Failed to get scan status');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get scan status. Please try again.');
    }
  },

  async getScanResult(jobId: string): Promise<ScanResult> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const token = useAuthStore.getState().token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await apiClient.get<ScanResultResponse>(
        `/api/v1/scan/${jobId}/results`,
        { headers }
      );

      const responseData = response.data;

      if (responseData.status_code === 200) {
        return responseData.data;
      } else {
        throw new Error(responseData.message || 'Failed to get scan results');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get scan results. Please try again.');
    }
  },

  async getScanSummary(jobId: string): Promise<SummaryResult> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const token = useAuthStore.getState().token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      // Try to get results from the API - the summary is included in the results endpoint
      const response = await apiClient.get<ScanResultResponse>(
        `/api/v1/scan/${jobId}/results`,
        { headers }
      );

      const responseData = response.data;

      if (responseData.status_code === 200) {
        const resultData = responseData.data;
        // Transform the result data to summary format
        return {
          job_id: resultData.job_id,
          website_score: resultData.overall_score,
          scan_date: resultData.scanned_at,
          summary_message: `Scan completed with score ${resultData.overall_score}`,
          categories: [
            {
              key: 'seo',
              title: 'SEO',
              severity: resultData.overall_score < 50 ? 'high' : resultData.overall_score < 70 ? 'medium' : 'low',
              score: Math.round(resultData.overall_score * 0.8), // Estimate based on overall score
              score_max: 100,
              short_description: 'Search engine optimization issues'
            },
            {
              key: 'performance',
              title: 'Performance',
              severity: resultData.overall_score < 50 ? 'high' : resultData.overall_score < 70 ? 'medium' : 'low',
              score: Math.round(resultData.overall_score * 0.9),
              score_max: 100,
              short_description: 'Website loading speed and performance'
            },
            {
              key: 'accessibility',
              title: 'Accessibility',
              severity: resultData.overall_score < 50 ? 'high' : resultData.overall_score < 70 ? 'medium' : 'low',
              score: Math.round(resultData.overall_score * 0.85),
              score_max: 100,
              short_description: 'Website accessibility and usability'
            }
          ]
        };
      } else {
        throw new Error(responseData.message || 'Failed to get scan summary');
      }
    } catch (error) {
      // Re-throw the error instead of using mock data
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get scan summary. Please try again.');
    }
  },

  async getScanIssues(jobId: string): Promise<IssuesResult> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    const token = useAuthStore.getState().token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      // Try to get issues from the API
      const response = await apiClient.get<IssuesResultResponse>(
        `/api/v1/scan/issues?job_id=${jobId}`,
        { headers }
      );

      const responseData = response.data;

      if (responseData.status_code === 200) {
        return responseData.data;
      } else {
        throw new Error(responseData.message || 'Failed to get scan issues');
      }
    } catch (error) {
      // Re-throw the error instead of using mock data
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get scan issues. Please try again.');
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

// Redirect Service for handling post-auth redirects
const REDIRECT_STORAGE_KEY = 'pending_redirect';

export const RedirectService = {
  // Store a redirect URL for later use
  storeRedirect: async (url: string): Promise<void> => {
    try {
      await storage.setItem(REDIRECT_STORAGE_KEY, url);
    } catch (error) {
      console.error('Failed to store redirect:', error);
    }
  },

  // Get stored redirect URL
  getStoredRedirect: async (): Promise<string | null> => {
    try {
      return await storage.getItem<string>(REDIRECT_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to get stored redirect:', error);
      return null;
    }
  },

  // Clear stored redirect
  clearStoredRedirect: async (): Promise<void> => {
    try {
      await storage.removeItem(REDIRECT_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear stored redirect:', error);
    }
  },

  // Validate redirect URL to prevent open redirect attacks
  validateRedirect: (url: string | undefined): string | null => {
    if (!url) return null;

    // Only allow relative paths (starting with /)
    if (!url.startsWith('/')) {
      console.warn('Invalid redirect URL (must be relative):', url);
      return null;
    }

    // Block any protocol handlers
    if (url.includes('://') || url.startsWith('//')) {
      console.warn('Invalid redirect URL (no protocols allowed):', url);
      return null;
    }

    // Allowed path prefixes (must include route group)
    const allowedPrefixes = [
      '/(tabs)',
      '/(reports)',
      '/(main)',
      '/(profile)',
      '/(settings)',
      '/(support)',
      '/(hireRequest)',
      '/(general)',
      '/(account)',
      '/(socialShare)',
    ];

    const isAllowed = allowedPrefixes.some(prefix => url.startsWith(prefix));
    if (!isAllowed) {
      console.warn('Redirect URL not in allowed list:', url);
      return null;
    }

    return url;
  },

  // Parse redirect URL into pathname and params
  parseRedirectUrl: (url: string): { pathname: string; params: Record<string, string> } => {
    const [pathname, queryString] = url.split('?');
    const params: Record<string, string> = {};

    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    return { pathname, params };
  },
};