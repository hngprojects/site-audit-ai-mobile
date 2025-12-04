import { apiClient, formatErrorMessage, isAxiosError } from '@/lib/api-client';
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

    try {

      const deviceInfo = await getPersistentDeviceInfo();


      const response = await apiClient.post<StartScanResponse>(
        '/api/v1/scan/start-async',
        { url, top_n: topN },
        {
          headers: {
            Authorization: `Bearer ${apiClient.defaults.headers.common['Authorization']}`,
            "X-Device": JSON.stringify({
            deviceId: deviceInfo.deviceId,
            device: deviceInfo.device,
          }), 
          },
        }
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

    try {
      const response = await apiClient.get<ScanStatusResponse>(
        `/api/v1/scan/${jobId}/status`,
        {
          headers: {
            Authorization: `Bearer ${apiClient.defaults.headers.common['Authorization']}`,
          },
        }
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

    try {
      const response = await apiClient.get<ScanResultResponse>(
        `/api/v1/scan/${jobId}/results`,
        {
          headers: {
            Authorization: `Bearer ${apiClient.defaults.headers.common['Authorization']}`,
          },
        }
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
};