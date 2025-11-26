import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Platform-specific Google OAuth Client IDs
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 
  '546863276810-ggsrvoues4vrn2tpuq6bliou5dujgggi.apps.googleusercontent.com';

// Initialize Google Sign-In configuration
let isConfigured = false;

/**
 * Configure Google Sign-In
 * This must be called before using signIn()
 */
function configureGoogleSignIn() {
  if (isConfigured) {
    return;
  }

  // Only webClientId is required in the configuration
  // Platform-specific client IDs are configured in Google Cloud Console
  // and are automatically detected by the library
  const config = {
    webClientId: GOOGLE_WEB_CLIENT_ID, // Required: Web OAuth Client ID
    offlineAccess: false, // We only need id_token, not access token
    forceCodeForRefreshToken: false,
  };

  console.log('=== GOOGLE SIGN-IN CONFIGURATION ===');
  console.log('Platform:', Platform.OS);
  console.log('Web Client ID:', GOOGLE_WEB_CLIENT_ID);
  console.log('Note: Platform-specific client IDs are configured in Google Cloud Console');
  if (GOOGLE_IOS_CLIENT_ID) {
    console.log('iOS Client ID (for reference):', GOOGLE_IOS_CLIENT_ID);
  }
  if (GOOGLE_ANDROID_CLIENT_ID) {
    console.log('Android Client ID (for reference):', GOOGLE_ANDROID_CLIENT_ID);
  }
  console.log('====================================');

  GoogleSignin.configure(config);
  isConfigured = true;
}

/**
 * Google Authentication Service
 * Uses native Google Sign-In (requires development build, not Expo Go)
 */
export const googleAuthService = {
  /**
   * Sign in with Google and get id_token
   * @returns The id_token from Google
   */
  async signIn(): Promise<string> {
    try {
      // Check if we're in Expo Go (not supported)
      const isExpoGo = Constants.appOwnership === 'expo';
      if (isExpoGo) {
        throw new Error(
          'Native Google Sign-In requires a development build.\n\n' +
          'Expo Go does not support native modules like @react-native-google-signin/google-signin.\n\n' +
          'To use this feature:\n' +
          '1. Create a development build: eas build --profile development --platform android\n' +
          '2. Install the development build on your device\n' +
          '3. Run: npx expo start --dev-client\n\n' +
          'Alternatively, use expo-auth-session for Expo Go compatibility.'
        );
      }

      // Configure Google Sign-In if not already configured
      configureGoogleSignIn();

      // Check if Google Play Services are available (Android only)
      if (Platform.OS === 'android') {
        try {
          await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        } catch (error: any) {
          console.error('❌ Google Play Services error:', error);
          if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            throw new Error(
              'Google Play Services is not available. Please install or update Google Play Services.'
            );
          }
          throw error;
        }
      }

      console.log('=== GOOGLE SIGN-IN DEBUG ===');
      console.log('Platform:', Platform.OS);
      console.log('App Ownership:', Constants.appOwnership);
      console.log('Is Development:', __DEV__);
      console.log('===========================');

      // Check if user is already signed in
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser?.idToken) {
          console.log('✅ User is already signed in, using existing id_token');
          return currentUser.idToken;
        }
      } catch {
        // User is not signed in, continue with sign-in flow
        console.log('User not signed in, starting sign-in flow...');
      }

      console.log('Prompting for Google Sign-In...');
      // console.log(GoogleSignin.signIn());
      
      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();

      console.log('=== SIGN-IN RESULT ===');
      console.log('User Info:', {
        id: userInfo.data?.user?.id,
        email: userInfo.data?.user?.email,
        name: userInfo.data?.user?.name,
        hasIdToken: !!userInfo.data?.idToken,
      });
      console.log('=====================');

      // Extract idToken from the response
      // The library returns: { data: { idToken: string, user: {...} } }
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        console.error('❌ No id_token in response');
        console.error('Available properties:', Object.keys(userInfo || {}));
        console.error('Response structure:', JSON.stringify(userInfo, null, 2));
        throw new Error('No id_token received from Google. Please try again.');
      }

      console.log('✅ Successfully obtained id_token');
      return idToken;
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);

      // Handle specific error codes
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            throw new Error('Sign-in was cancelled by the user.');
          
          case statusCodes.IN_PROGRESS:
            throw new Error('Sign-in is already in progress. Please wait.');
          
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            throw new Error(
              'Google Play Services is not available or outdated. ' +
              'Please install or update Google Play Services from the Play Store.'
            );
          
          case statusCodes.SIGN_IN_REQUIRED:
            throw new Error('Sign-in is required. Please try again.');
          
          default:
            // Check if it's a network or configuration error
            if (error.message?.includes('DEVELOPER_ERROR') || error.message?.includes('10:')) {
              throw new Error(
                'DEVELOPER_ERROR: Google Sign-In is not properly configured.\n\n' +
                'Please ensure:\n' +
                '1. You have created OAuth Client IDs in Google Cloud Console:\n' +
                '   - Web Client ID (required)\n' +
                '   - iOS Client ID (for iOS)\n' +
                '   - Android Client ID (for Android)\n\n' +
                '2. For Android: Add SHA-1 certificate fingerprint to Google Cloud Console\n' +
                '   - Debug: Run `cd android && ./gradlew signingReport`\n' +
                '   - Release: Get from EAS Build or Play Console\n\n' +
                '3. For iOS: Ensure Bundle ID matches in Google Cloud Console\n\n' +
                '4. You are using a development build (not Expo Go)\n\n' +
                'See: https://react-native-google-signin.github.io/docs/setting-up/get-config-file'
              );
            }
        }
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error('Failed to sign in with Google. Please try again.');
    }
  },

  /**
   * Sign out from Google
   */
  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
      console.log('✅ Successfully signed out from Google');
    } catch (error) {
      console.error('❌ Error signing out from Google:', error);
      throw error;
    }
  },

  /**
   * Revoke access and sign out
   */
  async revokeAccess(): Promise<void> {
    try {
      await GoogleSignin.revokeAccess();
      console.log('✅ Successfully revoked Google access');
    } catch (error) {
      console.error('❌ Error revoking Google access:', error);
      throw error;
    }
  },

  /**
   * Get the current platform
   */
  getPlatform(): 'ios' | 'android' {
    return Platform.OS === 'ios' ? 'ios' : 'android';
  },

  /**
   * Check if this service is available
   * Note: This requires a development build, not Expo Go
   */
  isAvailable(): boolean {
    const isExpoGo = Constants.appOwnership === 'expo';
    if (isExpoGo) {
      console.warn(
        '⚠️ Native Google Sign-In requires a development build.\n' +
        'Expo Go does not support native modules.\n' +
        'Please create a development build using: eas build --profile development --platform android'
      );
      return false;
    }
    return true;
  },
};
