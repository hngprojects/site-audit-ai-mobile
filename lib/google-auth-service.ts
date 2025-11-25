import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// Complete the auth session
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '546863276810-ggsrvoues4vrn2tpuq6bliou5dujgggi.apps.googleusercontent.com';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

/**
 * Google Authentication Service
 * Handles Google OAuth sign-in and retrieves id_token
 */
export const googleAuthService = {
  /**
   * Sign in with Google and get id_token
   * @returns The id_token from Google
   */
  async signIn(): Promise<string> {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: 'siteauditaife',
        path: 'oauth',
      });

      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.IdToken,
        redirectUri,
        extraParams: {},
        additionalParameters: {},
      });

      const result = await request.promptAsync(discovery, {
        useProxy: true,
        showInRecents: true,
      });

      if (result.type === 'success') {
        // Extract id_token from the response
        const idToken = result.params.id_token;
        
        if (!idToken) {
          throw new Error('No id_token received from Google');
        }

        return idToken;
      } else if (result.type === 'error') {
        throw new Error(result.error?.message || 'Google sign-in failed');
      } else {
        // User cancelled
        throw new Error('Google sign-in was cancelled');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to sign in with Google');
    }
  },

  /**
   * Get the current platform (ios or android)
   */
  getPlatform(): 'ios' | 'android' {
    return Platform.OS === 'ios' ? 'ios' : 'android';
  },
};

