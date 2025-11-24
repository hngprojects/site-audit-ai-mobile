import { sitesService, type Site } from '@/lib/sites-service';
import { useAuthStore } from '@/store/auth-store';

export const getSites = async (): Promise<Site[]> => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error('Authentication required. Please sign in.');
  }
  return await sitesService.getSites(token);
};

export const createSite = async (url: string): Promise<Site> => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error('Authentication required. Please sign in.');
  }
  return await sitesService.createSite(url, token);
};

export const getSiteDetails = async (siteId: string): Promise<Site> => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error('Authentication required. Please sign in.');
  }
  return await sitesService.getSiteDetails(siteId, token);
};

export const deleteSite = async (siteId: string): Promise<void> => {
  const token = useAuthStore.getState().token;
  if (!token) {
    throw new Error('Authentication required. Please sign in.');
  }
  return await sitesService.deleteSite(siteId, token);
};

