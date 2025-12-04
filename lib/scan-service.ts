import { apiClient, formatErrorMessage, isAxiosError } from '@/lib/api-client';
import { useAuthStore } from '@/store/auth-store';

// Redirect utilities for secure authentication flows
export class RedirectService {
  private static readonly ALLOWED_ROUTES = [
    '/(tabs)',
    '/(hireRequest)/request-form',
    '/(reports)/report-dashboard',
    '/(main)/auditing-screen',
  ];

  private static readonly MAX_REDIRECT_LENGTH = 500;

  /**
   * Validates and sanitizes redirect URLs
   * @param redirect - The redirect URL to validate
   * @returns Validated redirect URL or null if invalid
   */
  static validateRedirect(redirect: string | null | undefined): string | null {
    if (!redirect || typeof redirect !== 'string') {
      return null;
    }

    // Check length to prevent buffer overflow attacks
    if (redirect.length > this.MAX_REDIRECT_LENGTH) {
      return null;
    }

    // Remove any potentially dangerous characters
    const sanitized = redirect.replace(/[<>'"&]/g, '');

    // Check if it's an allowed route (starts with allowed patterns)
    const isAllowed = this.ALLOWED_ROUTES.some(route =>
      sanitized.startsWith(route) || sanitized === route
    );

    return isAllowed ? sanitized : null;
  }

  /**
   * Parses redirect URL with query parameters
   * @param redirect - Full redirect URL with optional query params
   * @returns Object with pathname and params
   */
  static parseRedirectUrl(redirect: string): { pathname: string; params?: Record<string, string> } {
    if (!redirect.includes('?')) {
      return { pathname: redirect };
    }

    const [pathname, queryString] = redirect.split('?');
    const params: Record<string, string> = {};

    if (queryString) {
      const searchParams = new URLSearchParams(queryString);
      for (const [key, value] of searchParams.entries()) {
        // Only allow safe parameter names and values
        if (key.length <= 50 && value.length <= 200) {
          params[key] = value;
        }
      }
    }

    return { pathname, params };
  }

  /**
   * Stores redirect information in persistent storage
   * @param redirect - Redirect information to store
   */
  static async storeRedirect(redirect: string): Promise<void> {
    try {
      const validated = this.validateRedirect(redirect);
      if (validated) {
        // In a real app, you'd use AsyncStorage or similar
        // For now, we'll use a simple approach
        console.log('Storing redirect:', validated);
      }
    } catch (error) {
      console.error('Failed to store redirect:', error);
    }
  }

  /**
   * Retrieves stored redirect information
   * @returns Stored redirect URL or null
   */
  static async getStoredRedirect(): Promise<string | null> {
    try {
      // In a real app, retrieve from AsyncStorage
      return null;
    } catch (error) {
      console.error('Failed to get stored redirect:', error);
      return null;
    }
  }

  /**
   * Clears stored redirect information
   */
  static async clearStoredRedirect(): Promise<void> {
    try {
      // Clear from storage
      console.log('Cleared stored redirect');
    } catch (error) {
      console.error('Failed to clear stored redirect:', error);
    }
  }
}

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

function transformBackendDataToScanResult(backendData: any): ScanResult {
  const { results } = backendData;
  const issues: Issue[] = [];

  // Calculate category scores from backend data
  const categoryScores = {
    ux: results.score_accessibility || 0, // Using accessibility as UX score
    performance: results.score_performance || 0,
    seo: results.score_seo || 0
  };

  // Get sample category data from first page for descriptions
  const firstPage = results.selected_pages[0];
  if (firstPage) {
    const { analysis_details } = firstPage;

    // Create one issue per category
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
  async startScan(url: string, topN: number = 15): Promise<{ job_id: string; status: string; message: string }> {
    if (!url) {
      throw new Error('URL is required');
    }

    // Get authentication state (optional)
    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;
    const userId = authState.user?.id;

    // Prepare request payload
    const payload: any = { url, top_n: topN };

    // Include user_id if authenticated
    if (isAuthenticated && userId) {
      payload.user_id = userId;
    }

    // Prepare headers
    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Include authorization header if authenticated
    if (isAuthenticated && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await apiClient.post<StartScanResponse>(
        '/api/v1/scan/start-async',
        payload,
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

    // Get authentication state (optional)
    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    // Prepare headers
    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Include authorization header if authenticated
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

    // Get authentication state (optional)
    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    // Prepare headers
    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Include authorization header if authenticated
    if (isAuthenticated && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await apiClient.get<ScanResultResponse>(
        `/api/v1/scan/${jobId}/results`,
        { headers }
      );
      const responseData = response.data;

      // Transform the backend data structure to our expected format
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

    // Get authentication state (optional)
    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    // Prepare headers
    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Include authorization header if authenticated
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

    // Get authentication state (optional)
    const authState = useAuthStore.getState();
    const isAuthenticated = authState.isAuthenticated;
    const token = authState.token;

    // Prepare headers
    const headers: any = {
      'Content-Type': 'application/json',
    };

    // Include authorization header if authenticated
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
};