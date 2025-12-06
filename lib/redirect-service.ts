import AsyncStorage from '@react-native-async-storage/async-storage';

const REDIRECT_STORAGE_KEY = 'auth_redirect_url';

export const RedirectService = {
  /**
   * Validate a redirect URL to ensure it's safe
   */
  validateRedirect(redirect: string | null): string | null {
    if (!redirect) return null;

    try {
      // Only allow relative URLs (starting with /) for security
      if (!redirect.startsWith('/')) {
        return null;
      }

      // Prevent redirect to external domains
      if (redirect.includes('://')) {
        return null;
      }

      return redirect;
    } catch (error) {
      console.warn('Invalid redirect URL:', redirect);
      return null;
    }
  },

  /**
   * Parse a redirect URL into pathname and params
   */
  parseRedirectUrl(redirect: string): { pathname: string; params: Record<string, string> } {
    try {
      // Remove leading slash if present
      const cleanRedirect = redirect.startsWith('/') ? redirect.slice(1) : redirect;

      // Split by ? to separate pathname and query string
      const [pathname, queryString] = cleanRedirect.split('?');

      const params: Record<string, string> = {};

      if (queryString) {
        // Parse query parameters
        const searchParams = new URLSearchParams(queryString);
        searchParams.forEach((value, key) => {
          params[key] = value;
        });
      }

      return {
        pathname: `/${pathname}`,
        params
      };
    } catch (error) {
      console.warn('Failed to parse redirect URL:', redirect);
      return {
        pathname: '/',
        params: {}
      };
    }
  },

  /**
   * Store a redirect URL for later use
   */
  async storeRedirect(redirect: string): Promise<void> {
    try {
      const validatedRedirect = this.validateRedirect(redirect);
      if (validatedRedirect) {
        await AsyncStorage.setItem(REDIRECT_STORAGE_KEY, validatedRedirect);
      }
    } catch (error) {
      console.warn('Failed to store redirect:', error);
    }
  },

  /**
   * Get the stored redirect URL
   */
  async getStoredRedirect(): Promise<string | null> {
    try {
      const redirect = await AsyncStorage.getItem(REDIRECT_STORAGE_KEY);
      return redirect;
    } catch (error) {
      console.warn('Failed to get stored redirect:', error);
      return null;
    }
  },

  /**
   * Clear the stored redirect URL
   */
  async clearStoredRedirect(): Promise<void> {
    try {
      await AsyncStorage.removeItem(REDIRECT_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear stored redirect:', error);
    }
  }
};