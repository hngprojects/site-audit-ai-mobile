/**
 * Google Authentication Service - Native Google Sign-In
 * 
 * FRESH IMPLEMENTATION WITH DIFFERENT APPROACH:
 * - Uses @react-native-google-signin/google-signin native library
 * - Different configuration strategy and naming
 * - Enhanced error handling and diagnostics
 * - Platform-specific client ID handling
 * - Robust token extraction with fallbacks
 * 
 * Requirements:
 * - Development build (not Expo Go)
 * - EXPO_PUBLIC_GOOGLE_CLIENT_ID: Web OAuth Client ID (required)
 * - EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID: iOS OAuth Client ID (for iOS)
 * - Android: SHA-1 fingerprint in Google Cloud Console
 * - iOS: Bundle ID matches Google Cloud Console
 */

import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Environment variable names - using different naming convention
const WEB_OAUTH_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
const IOS_OAUTH_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const ANDROID_OAUTH_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

// Configuration state
let isInitialized = false;

/**
 * Initialize Google Sign-In with platform-specific configuration
 * Uses a different initialization strategy
 */
function initializeGoogleSignIn(): void {
  if (isInitialized) {
    return;
  }

  // Validate web client ID is available
  if (!WEB_OAUTH_CLIENT_ID) {
    const errorMsg =
      'Google Sign-In configuration error: EXPO_PUBLIC_GOOGLE_CLIENT_ID is not set.\n\n' +
      'Please add it to your eas.json build profile under env.EXPO_PUBLIC_GOOGLE_CLIENT_ID';
    console.error('❌', errorMsg);
    throw new Error(errorMsg);
  }

  // Build configuration object with different approach
  const signInConfig: {
    webClientId: string;
    iosClientId?: string;
    offlineAccess?: boolean;
    forceCodeForRefreshToken?: boolean;
    scopes?: string[];
  } = {
    // Web client ID is required and used for Android
    webClientId: WEB_OAUTH_CLIENT_ID,
    // Disable offline access - we only need id_token
    offlineAccess: false,
    // Don't force code for refresh token
    forceCodeForRefreshToken: false,
    // Minimal scopes - only what's needed for authentication
    scopes: [],
  };

  // Add iOS client ID if available and on iOS platform
  if (Platform.OS === 'ios') {
    if (IOS_OAUTH_CLIENT_ID) {
      signInConfig.iosClientId = IOS_OAUTH_CLIENT_ID;
      console.log('✅ iOS Client ID configured');
    } else {
      console.warn(
        '⚠️ iOS Client ID not set. iOS sign-in may not work properly.\n' +
        'Set EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID in eas.json'
      );
    }
  }

  // Log configuration for debugging
  console.log('=== Google Sign-In Configuration ===');
  console.log('Platform:', Platform.OS);
  console.log('Web Client ID:', WEB_OAUTH_CLIENT_ID.substring(0, 30) + '...');
  if (Platform.OS === 'ios' && IOS_OAUTH_CLIENT_ID) {
    console.log('iOS Client ID:', IOS_OAUTH_CLIENT_ID.substring(0, 30) + '...');
  }
  if (Platform.OS === 'android' && ANDROID_OAUTH_CLIENT_ID) {
    console.log('Android Client ID (reference):', ANDROID_OAUTH_CLIENT_ID.substring(0, 30) + '...');
    console.log('Note: Android uses webClientId and matches via package name + SHA-1');
  }
  console.log('===================================');

  // Configure Google Sign-In
  GoogleSignin.configure(signInConfig);
  isInitialized = true;
}

/**
 * Check if running in Expo Go (not supported)
 */
function checkExpoGo(): void {
  const isExpoGo = Constants.executionEnvironment === 'storeClient';
  if (isExpoGo) {
    throw new Error(
      'Native Google Sign-In requires a development build.\n\n' +
      'Expo Go does not support native modules.\n\n' +
      'To use Google Sign-In:\n' +
      '1. Create a development build: eas build --profile development --platform android\n' +
      '2. Install the development build on your device\n' +
      '3. Run: npx expo start --dev-client'
    );
  }
}

/**
 * Check Google Play Services (Android only)
 */
async function checkPlayServices(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  } catch (error: any) {
    if (isErrorWithCode(error) && error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error(
        'Google Play Services is not available or outdated.\n\n' +
        'Please install or update Google Play Services from the Play Store.'
      );
    }
    throw error;
  }
}

/**
 * Extract id_token from sign-in response with multiple fallback strategies
 */
async function extractIdToken(response: any): Promise<string> {
  // Strategy 1: Direct idToken in response
  if (response?.data?.idToken) {
    console.log('✅ Found id_token in response.data.idToken');
    return response.data.idToken;
  }

  // Strategy 2: Check response.idToken directly
  if (response?.idToken) {
    console.log('✅ Found id_token in response.idToken');
    return response.idToken;
  }

  // Strategy 3: Get tokens using getTokens() method
  console.log('⚠️ id_token not in response, trying getTokens()...');
  try {
    const tokens = await GoogleSignin.getTokens();
    if (tokens?.idToken) {
      console.log('✅ Retrieved id_token from getTokens()');
      return tokens.idToken;
    }
  } catch (tokenError) {
    console.error('❌ Failed to get tokens:', tokenError);
  }

  // Strategy 4: Check current user
  try {
    const currentUser = await GoogleSignin.getCurrentUser();
    if (currentUser?.idToken) {
      console.log('✅ Retrieved id_token from getCurrentUser()');
      return currentUser.idToken;
    }
  } catch (userError) {
    console.error('❌ Failed to get current user:', userError);
  }

  // All strategies failed
  throw new Error(
    'Could not obtain id_token from Google Sign-In.\n\n' +
    'Response structure: ' + JSON.stringify(response, null, 2)
  );
}

/**
 * Google Authentication Service
 */
export const googleAuthService = {
  /**
   * Sign in with Google and return id_token
   */
  async signIn(): Promise<string> {
    try {
      // Check if running in Expo Go
      checkExpoGo();

      // Initialize configuration
      initializeGoogleSignIn();

      // Check Google Play Services (Android)
      await checkPlayServices();

      console.log('🚀 Starting Google Sign-In...');

      // Check if user is already signed in
      try {
        const currentUser = await GoogleSignin.getCurrentUser();
        if (currentUser?.idToken) {
          console.log('✅ User already signed in, using existing id_token');
          return currentUser.idToken;
        }
      } catch {
        // Not signed in, continue with sign-in flow
        console.log('User not signed in, starting sign-in flow...');
      }

      // Perform sign-in
      const signInResponse = await GoogleSignin.signIn();

      // Validate response
      if (!isSuccessResponse(signInResponse)) {
        throw new Error('Google sign-in was cancelled or failed.');
      }

      console.log('✅ Google Sign-In successful');
      console.log('User Info:', {
        id: signInResponse.data?.user?.id,
        email: signInResponse.data?.user?.email,
        name: signInResponse.data?.user?.name,
      });

      // Extract id_token using multiple strategies
      const idToken = await extractIdToken(signInResponse);

      if (!idToken) {
        throw new Error('Google returned null id_token. Please try again.');
      }

      console.log('✅ Successfully obtained id_token');
      console.log('ID Token length:', idToken.length);
      return idToken;
    } catch (error: any) {
      console.error('❌ Google Sign-In error:', error);

      // Handle specific error codes
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            throw new Error('Sign-in was cancelled by the user.');

          case statusCodes.IN_PROGRESS:
            throw new Error('Sign-in is already in progress. Please wait.');

          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            throw new Error(
              'Google Play Services is not available or outdated.\n\n' +
              'Please install or update Google Play Services from the Play Store.'
            );

          case statusCodes.SIGN_IN_REQUIRED:
            throw new Error('Sign-in is required. Please try again.');

          default:
            // Check for DEVELOPER_ERROR (configuration issue)
            const errorMessage = String(error.message || '').toLowerCase();
            const errorCode = String(error.code || '');
            const isConfigError =
              errorMessage.includes('developer_error') ||
              errorMessage.includes('10:') ||
              errorCode === '10' ||
              errorMessage.includes('non-recoverable') ||
              errorMessage.includes('sign in failure');

            if (isConfigError) {
              let troubleshooting = '🔴 Google Sign-In Configuration Error\n\n';

              if (Platform.OS === 'android') {
                troubleshooting +=
                  '📱 ANDROID SETUP:\n\n' +
                  '1️⃣ Get SHA-1 Fingerprint:\n' +
                  '   cd android && ./gradlew signingReport\n' +
                  '   Look for "SHA1" under "Variant: debug"\n\n' +
                  '2️⃣ Add SHA-1 to Google Cloud Console:\n' +
                  '   • Go to: https://console.cloud.google.com/apis/credentials\n' +
                  '   • Click your Android OAuth 2.0 Client ID\n' +
                  '   • Add SHA-1 under "SHA-1 certificate fingerprints"\n' +
                  '   • SAVE and WAIT 5-10 minutes\n\n' +
                  '3️⃣ Verify Package Name:\n' +
                  `   • App: ${Constants.expoConfig?.android?.package || 'com.peliah.sitelytics'}\n` +
                  '   • Must match Google Cloud Console OAuth Client\n\n' +
                  '4️⃣ Verify Client IDs:\n' +
                  `   • Web: ${WEB_OAUTH_CLIENT_ID?.substring(0, 20)}...\n` +
                  `   • Android: ${ANDROID_OAUTH_CLIENT_ID?.substring(0, 20) || 'NOT SET'}...\n` +
                  '   • All should start with the SAME project number\n\n';
              } else if (Platform.OS === 'ios') {
                troubleshooting +=
                  '📱 iOS SETUP:\n\n' +
                  '1️⃣ Verify Bundle ID:\n' +
                  `   • App: ${Constants.expoConfig?.ios?.bundleIdentifier || 'com.peliah.sitelytics'}\n` +
                  '   • Must match Google Cloud Console OAuth Client\n\n' +
                  '2️⃣ Verify iOS Client ID:\n' +
                  `   • iOS Client ID: ${IOS_OAUTH_CLIENT_ID ? 'SET' : '❌ NOT SET'}\n` +
                  '   • Must be from Google Cloud Console > iOS OAuth Client\n\n';
              }

              troubleshooting +=
                '📚 Resources:\n' +
                '   • https://react-native-google-signin.github.io/docs/setting-up/get-config-file\n' +
                '   • https://react-native-google-signin.github.io/docs/troubleshooting\n';

              throw new Error(troubleshooting);
            }
        }
      }

      // Re-throw if already an Error instance
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
   * Get current platform
   */
  getPlatform(): 'ios' | 'android' {
    return Platform.OS === 'ios' ? 'ios' : 'android';
  },

  /**
   * Check if service is available
   */
  isAvailable(): boolean {
    const isExpoGo = Constants.executionEnvironment === 'storeClient';
    if (isExpoGo) {
      console.warn(
        '⚠️ Native Google Sign-In requires a development build.\n' +
        'Expo Go does not support native modules.'
      );
      return false;
    }
    return true;
  },
};