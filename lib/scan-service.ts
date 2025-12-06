import { apiClient, formatErrorMessage, isAxiosError } from '@/lib/api-client';
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

    const token = useAuthStore.getState().token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await apiClient.post<StartScanResponse>(
        '/api/v1/scan/start-async',
        { url, top_n: 10 },
        { headers }
      );

      const responseData = response.data;

      if (responseData.status_code === 200) {
        const jobId = responseData.data.job_id;

        // Simulate events for UI feedback (since we don't have real SSE yet)
        if (onEvent) {
          onEvent('scan_started', { job_id: jobId, status: 'processing', message: 'Starting scan...' });
          setTimeout(() => onEvent('loading_page', { job_id: jobId, progress_percent: 25, current_step: 'Discovering pages' }), 500);
          setTimeout(() => onEvent('extracting_content', { job_id: jobId, progress_percent: 50, current_step: 'Analyzing content' }), 1000);
          setTimeout(() => onEvent('performance_check', { job_id: jobId, progress_percent: 75, current_step: 'Checking performance' }), 1500);
          setTimeout(() => onEvent('scan_complete', { job_id: jobId, status: 'completed', message: 'Scan completed successfully' }), 2000);
        }

        return {
          job_id: jobId,
          status: responseData.data.status,
          message: responseData.message,
        };
      } else {
        throw new Error(responseData.message || 'Scan failed to start');
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

  async startPageDiscovery(
    url: string,
    onEvent?: (eventName: string, data: any) => void
  ): Promise<{ job_id: string; status: string; message: string }> {
    if (!url) {
      throw new Error('URL is required');
    }

    const token = useAuthStore.getState().token;

    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      // Call the discovery API
      const response = await apiClient.post<DiscoveryResponse>(
        '/api/v1/scan/discovery/discover-urls',
        { url },
        { headers }
      );

      const responseData = response.data;

      if (responseData.status_code === 200) {
        // Transform API response to PageDiscoveryResult format
        const discoveryData = responseData.data;
        lastDiscoveryResult = {
          domain: discoveryData.base_url,
          total_pages: discoveryData.discovered_count,
          discovered_at: new Date().toISOString(),
          pages: discoveryData.important_urls.map((url: any, index: number) => ({
            id: `page-${index}`,
            name: url.title,
            url: url.url,
            title: url.title,
            status: 200, // Assume success
            lastModified: new Date().toISOString(),
            size: 0, // Not provided by API
            priority: url.priority,
            description: url.description,
            category: 'Discovered Pages'
          }))
        };

        // Simulate events for UI feedback
        if (onEvent) {
          onEvent('discovery_started', { job_id: 'discovery-' + Date.now(), message: 'Starting page discovery...' });
          setTimeout(() => onEvent('crawling_pages', { progress: 25, message: 'Crawling website pages...' }), 500);
          setTimeout(() => onEvent('analyzing_structure', { progress: 50, message: 'Analyzing site structure...' }), 1000);
          setTimeout(() => onEvent('prioritizing_pages', { progress: 75, message: 'Prioritizing important pages...' }), 1500);
          setTimeout(() => onEvent('discovery_complete', { message: 'Page discovery completed successfully' }), 2000);
        }

        return {
          job_id: 'discovery-' + Date.now(),
          status: 'completed',
          message: responseData.message,
        };
      } else {
        throw new Error(responseData.message || 'Discovery failed');
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
      throw new Error('Failed to start page discovery. Please try again.');
    }
  },

  async getDiscoveredPages(jobId: string): Promise<PageDiscoveryResult> {
    if (!jobId) {
      throw new Error('Job ID is required');
    }

    // Return the stored discovery result
    if (lastDiscoveryResult) {
      return lastDiscoveryResult;
    }

    // If no result is stored, return empty result
    return {
      domain: '',
      total_pages: 0,
      pages: [],
      discovered_at: new Date().toISOString()
    };
  },
};