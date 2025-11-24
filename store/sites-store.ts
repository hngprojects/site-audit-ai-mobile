import * as sitesActions from '@/actions/sites-actions';
import type { Site } from '@/lib/sites-service';
import type { WebsiteMetadata } from '@/utils/website-metadata';
import { create } from 'zustand';

interface SitesState {
  sites: Site[];
  isLoading: boolean;
  error: string | null;
}

interface SitesStore extends SitesState {
  fetchSites: () => Promise<void>;
  createSite: (url: string, metadata?: WebsiteMetadata) => Promise<Site>;
  getSiteDetails: (siteId: string) => Promise<Site>;
  deleteSite: (siteId: string) => Promise<void>;
  clearError: () => void;
}

const initialState: SitesState = {
  sites: [],
  isLoading: false,
  error: null,
};

export const useSitesStore = create<SitesStore>((set, get) => ({
  ...initialState,

  fetchSites: async () => {
    set({ isLoading: true, error: null });
    try {
      const sites = await sitesActions.getSites();
      set({
        sites,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch sites',
      });
    }
  },

  createSite: async (url: string, metadata?: WebsiteMetadata) => {
    set({ isLoading: true, error: null });
    try {
      const newSite = await sitesActions.createSite(url, metadata);
      set((state) => ({
        sites: [newSite, ...state.sites],
        isLoading: false,
        error: null,
      }));
      return newSite;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to create site',
      });
      throw error;
    }
  },

  getSiteDetails: async (siteId: string) => {
    set({ isLoading: true, error: null });
    try {
      const site = await sitesActions.getSiteDetails(siteId);
      set({
        isLoading: false,
        error: null,
      });
      return site;
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch site details',
      });
      throw error;
    }
  },

  deleteSite: async (siteId: string) => {
    const state = get();
    const siteToDelete = state.sites.find(s => s.id === siteId);
    
    set((state) => ({
      sites: state.sites.filter((site) => site.id !== siteId),
    }));

    try {
      await sitesActions.deleteSite(siteId);
    } catch (error) {
      if (siteToDelete) {
        set((state) => ({
          sites: [...state.sites, siteToDelete].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ),
        }));
      }
      set({
        error: error instanceof Error ? error.message : 'Failed to delete site',
      });
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));

