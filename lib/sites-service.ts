import { apiClient, formatErrorMessage, isAxiosError } from '@/lib/api-client';

export interface Site {
  id: string;
  root_url: string;
  display_name?: string | null;
  favicon_url?: string | null;
  status: string;
  total_scans?: number;
  last_scanned_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface SiteResponse {
  data: Site | Site[];
  message?: string;
}

export interface CreateSiteRequest {
  root_url: string;
  display_name?: string;
  favicon_url?: string;
  status?: string;
}

export const sitesService = {
  async getSites(token: string): Promise<Site[]> {
    try {
      const response = await apiClient.get<SiteResponse>(
        '/api/v1/sites',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data;
      console.log(responseData);
      
      if (Array.isArray(responseData.data)) {
        return responseData.data;
      }
      return [];
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch sites. Please try again.');
    }
  },

  async createSite(
    url: string,
    token: string,
    metadata?: { display_name?: string; favicon_url?: string }
  ): Promise<Site> {
    if (!url || url.trim() === '') {
      throw new Error('URL is required');
    }

    try {
      const payload: CreateSiteRequest = {
        root_url: url.trim(),
        status: 'active',
      };

      if (metadata?.display_name) {
        payload.display_name = metadata.display_name;
      }

      if (metadata?.favicon_url) {
        payload.favicon_url = metadata.favicon_url;
      }

      const response = await apiClient.post<SiteResponse>(
        '/api/v1/sites',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data;
      
      if (Array.isArray(responseData.data)) {
        return responseData.data[0];
      }
      return responseData.data as Site;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create site. Please try again.');
    }
  },

  async getSiteDetails(siteId: string, token: string): Promise<Site> {
    if (!siteId) {
      throw new Error('Site ID is required');
    }

    try {
      const response = await apiClient.get<SiteResponse>(
        `/api/v1/sites/${siteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const responseData = response.data;
      
      if (Array.isArray(responseData.data)) {
        return responseData.data[0];
      }
      return responseData.data as Site;
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch site details. Please try again.');
    }
  },

  async deleteSite(siteId: string, token: string): Promise<void> {
    if (!siteId) {
      throw new Error('Site ID is required');
    }

    try {
      await apiClient.patch(
        `/api/v1/sites/${siteId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      if (isAxiosError(error)) {
        const errorData = error.response?.data || {};
        const errorMessage = formatErrorMessage(errorData);
        throw new Error(errorMessage);
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete site. Please try again.');
    }
  },
};

