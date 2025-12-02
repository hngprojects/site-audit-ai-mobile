// import {
//   GoogleSignin,
//   isErrorWithCode,
//   isSuccessResponse,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
// import Constants from 'expo-constants';
// import { Platform } from 'react-native';

// // Platform-specific Google OAuth Client IDs
// const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
// const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
// const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
//   '546863276810-ggsrvoues4vrn2tpuq6bliou5dujgggi.apps.googleusercontent.com';

// // Initialize Google Sign-In configuration
// let isConfigured = false;

// /**
//  * Configure Google Sign-In
//  * This must be called before using signIn()
//  */
// function configureGoogleSignIn() {
//   if (isConfigured) {
//     return;
//   }

//   // Configure Google Sign-In with platform-specific client IDs
//   // webClientId is required for all platforms (used for Android and Web)
//   // iosClientId is required for iOS
//   // Note: androidClientId is NOT a valid parameter - Android uses webClientId
//   // and matches it with the Android OAuth client ID in Google Cloud Console
//   // based on package name and SHA-1 fingerprint
//   const config: any = {
//     webClientId: GOOGLE_WEB_CLIENT_ID, // Required: Web OAuth Client ID (also used for Android)
//     offlineAccess: true, // We only need id_token, not access token
//     forceCodeForRefreshToken: false,
//     scopes: ["https://www.googleapis.com/auth/drive.readonly"],
//     iosClientId: GOOGLE_IOS_CLIENT_ID,
//   };

//   // Add iOS client ID if available (required for iOS)
//   if (GOOGLE_IOS_CLIENT_ID) {
//     config.iosClientId = GOOGLE_IOS_CLIENT_ID;
//   }

//   console.log('=== GOOGLE SIGN-IN CONFIGURATION ===');
//   console.log('Current Platform:', Platform.OS);
//   console.log('Web Client ID:', GOOGLE_WEB_CLIENT_ID, '(used for Android & Web)');
//   if (config.iosClientId) {
//     console.log('✅ iOS Client ID configured:', config.iosClientId);
//   } else {
//     console.log('⚠️ iOS Client ID not set (iOS may not work)');
//   }
//   if (GOOGLE_ANDROID_CLIENT_ID) {
//     console.log('ℹ️  Android Client ID (for reference):', GOOGLE_ANDROID_CLIENT_ID);
//     console.log('   Note: Android uses webClientId and matches via package name + SHA-1');
//   }
//   console.log('====================================');

//   GoogleSignin.configure(config);
//   isConfigured = true;
// }

// /**
//  * Google Authentication Service
//  * Uses native Google Sign-In (requires development build, not Expo Go)
//  */
// export const googleAuthService = {
//   /**
//    * Sign in with Google and get id_token
//    * @returns The id_token from Google
//    */
//   async signIn(): Promise<string> {
//     try {
//       // Check if we're in Expo Go (not supported)
//       const isExpoGo = Constants.executionEnvironment === 'storeClient';
//       if (isExpoGo) {
//         throw new Error(
//           'Native Google Sign-In requires a development build.\n\n' +
//           'Expo Go does not support native modules like @react-native-google-signin/google-signin.\n\n' +
//           'To use this feature:\n' +
//           '1. Create a development build: eas build --profile development --platform android\n' +
//           '2. Install the development build on your device\n' +
//           '3. Run: npx expo start --dev-client\n\n' +
//           'Alternatively, use expo-auth-session for Expo Go compatibility.'
//         );
//       }

//       // Configure Google Sign-In if not already configured
//       configureGoogleSignIn();

//       // Check if Google Play Services are available (Android only)
//       if (Platform.OS === 'android') {
//         try {
//           await GoogleSignin.hasPlayServices();
//         } catch (error: any) {
//           console.error('❌ Google Play Services error:', error);
//           if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//             throw new Error(
//               'Google Play Services is not available. Please install or update Google Play Services.'
//             );
//           }
//           throw error;
//         }
//       }

//       console.log('=== GOOGLE SIGN-IN DEBUG ===');
//       console.log('Platform:', Platform.OS);
//       console.log('Execution Environment:', Constants.executionEnvironment);
//       console.log('Is Development:', __DEV__);
//       console.log('===========================');

//       // Check if user is already signed in
//       try {
//         const currentUser = await GoogleSignin.getCurrentUser();
//         if (currentUser?.idToken) {
//           console.log('✅ User is already signed in, using existing id_token');
//           return currentUser.idToken;
//         }
//       } catch {
//         // User is not signed in, continue with sign-in flow
//         console.log('User not signed in, starting sign-in flow...');
//       }

//       console.log('Prompting for Google Sign-In...');

//       // Sign in with Google
//       const response = await GoogleSignin.signIn();

//       // Use library's utility function to check if response is successful
//       if (!isSuccessResponse(response)) {
//         console.log('Google auth was rejected by user or failed');
//         throw new Error('Google sign-in was cancelled or failed.');
//       }

//       console.log('=== SIGN-IN RESULT ===');
//       console.log('User Info:', {
//         id: response.data?.user?.id,
//         email: response.data?.user?.email,
//         name: response.data?.user?.name,
//         hasIdToken: !!response.data?.idToken,
//       });
//       console.log('=====================');

//       // Extract idToken from the response
//       // The library returns: { data: { idToken: string, user: {...} } }
//       let idToken = response.data?.idToken;

//       // Sometimes idToken isn't directly included, try getTokens() as fallback
//       if (!idToken) {
//         console.log('⚠️ idToken not in response, trying getTokens()...');
//         try {
//           const tokens = await GoogleSignin.getTokens();
//           idToken = tokens.idToken;
//           console.log('✅ Retrieved idToken from getTokens()');
//         } catch (tokenError) {
//           console.error('❌ Failed to get tokens:', tokenError);
//         }
//       }

//       if (!idToken) {
//         console.error('❌ No id_token available');
//         console.error('Response structure:', JSON.stringify(response, null, 2));
//         throw new Error('Google returned null idToken. Please try again.');
//       }

//       console.log('✅ Successfully obtained id_token');
//       console.log('ID Token length:', idToken.length);
//       return idToken;
//     } catch (error: any) {
//       console.error('❌ Google sign-in error:', error);

//       // Use library's utility function to check if error has a code property
//       if (isErrorWithCode(error)) {
//         switch (error.code) {
//           case statusCodes.SIGN_IN_CANCELLED:
//             throw new Error('Sign-in was cancelled by the user.');

//           case statusCodes.IN_PROGRESS:
//             throw new Error('Sign-in is already in progress. Please wait.');

//           case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
//             throw new Error(
//               'Google Play Services is not available or outdated. ' +
//               'Please install or update Google Play Services from the Play Store.'
//             );

//           case statusCodes.SIGN_IN_REQUIRED:
//             throw new Error('Sign-in is required. Please try again.');

//           default:
//             // Check if it's a DEVELOPER_ERROR (configuration issue)
//             const errorMessage = (error as any).message || '';
//             if (errorMessage.includes('DEVELOPER_ERROR') || errorMessage.includes('10:') || error.code === '10') {
//               // Get SHA-1 for debugging
//               let sha1Instructions = '';
//               if (Platform.OS === 'android') {
//                 sha1Instructions =
//                   '\n\n📋 To get your SHA-1 fingerprint:\n' +
//                   '   1. Debug: cd android && ./gradlew signingReport\n' +
//                   '   2. Look for "SHA1" under "Variant: debug"\n' +
//                   '   3. Copy the SHA-1 value\n' +
//                   '   4. Go to Google Cloud Console > APIs & Services > Credentials\n' +
//                   '   5. Edit your Android OAuth 2.0 Client ID\n' +
//                   '   6. Add the SHA-1 fingerprint under "SHA-1 certificate fingerprints"\n' +
//                   '   7. Wait a few minutes for changes to propagate\n';
//               }

//               throw new Error(
//                 'DEVELOPER_ERROR: Google Sign-In is not properly configured.\n\n' +
//                 'Common causes:\n' +
//                 '1. Missing SHA-1 certificate fingerprint in Google Cloud Console (most common)\n' +
//                 '2. Package name mismatch between app and Google Cloud Console\n' +
//                 '3. OAuth Client IDs not properly configured\n\n' +
//                 'Steps to fix:\n' +
//                 '1. Ensure you have created OAuth Client IDs in Google Cloud Console:\n' +
//                 '   - Web Client ID (required)\n' +
//                 '   - Android Client ID (for Android)\n' +
//                 '   - iOS Client ID (for iOS)\n' +
//                 sha1Instructions +
//                 '2. Verify your package name matches in:\n' +
//                 '   - app.json (expo.android.package)\n' +
//                 '   - Google Cloud Console OAuth Client\n' +
//                 '3. Ensure you are using a development build (not Expo Go)\n' +
//                 '4. Wait 5-10 minutes after updating Google Cloud Console\n\n' +
//                 'See: https://react-native-google-signin.github.io/docs/troubleshooting'
//               );
//             }
//         }
//       }

//       if (error instanceof Error) {
//         throw error;
//       }

//       throw new Error('Failed to sign in with Google. Please try again.');
//     }
//   },

//   /**
//    * Sign out from Google
//    */
//   async signOut(): Promise<void> {
//     try {
//       await GoogleSignin.signOut();
//       console.log('✅ Successfully signed out from Google');
//     } catch (error) {
//       console.error('❌ Error signing out from Google:', error);
//       throw error;
//     }
//   },

//   /**
//    * Revoke access and sign out
//    */
//   async revokeAccess(): Promise<void> {
//     try {
//       await GoogleSignin.revokeAccess();
//       console.log('✅ Successfully revoked Google access');
//     } catch (error) {
//       console.error('❌ Error revoking Google access:', error);
//       throw error;
//     }
//   },

//   /**
//    * Get the current platform
//    */
//   getPlatform(): 'ios' | 'android' {
//     return Platform.OS === 'ios' ? 'ios' : 'android';
//   },

//   /**
//    * Check if this service is available
//    * Note: This requires a development build, not Expo Go
//    */
//   isAvailable(): boolean {
//     const isExpoGo = Constants.executionEnvironment === 'storeClient';
//     if (isExpoGo) {
//       console.warn(
//         '⚠️ Native Google Sign-In requires a development build.\n' +
//         'Expo Go does not support native modules.\n' +
//         'Please create a development build using: eas build --profile development --platform android'
//       );
//       return false;
//     }
//     return true;
//   },
// };


import Constants from 'expo-constants';

// Check if we're in Expo Go - conditionally import Google Sign-In
const isExpoGo = Constants.executionEnvironment === 'storeClient';

let GoogleSignin: any = null;
let isErrorWithCode: any = null;
let isSuccessResponse: any = null;
let statusCodes: any = null;
let Platform: any = null;

// Conditionally import native modules only when not in Expo Go
if (!isExpoGo) {
  try {
    const googleSigninModule = require('@react-native-google-signin/google-signin');
    const platformModule = require('react-native');

    GoogleSignin = googleSigninModule.GoogleSignin;
    isErrorWithCode = googleSigninModule.isErrorWithCode;
    isSuccessResponse = googleSigninModule.isSuccessResponse;
    statusCodes = googleSigninModule.statusCodes;
    Platform = platformModule.Platform;
  } catch (error) {
    console.error('Failed to import Google Sign-In modules:', error);
  }
} else {
  // Mock Platform for Expo Go
  Platform = { OS: 'unknown' };
}

// Platform-specific Google OAuth Client IDs
// IMPORTANT: All three should be from the SAME Google Cloud project
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

// Validate configuration (only when not in Expo Go)
if (!isExpoGo) {
  if (!GOOGLE_WEB_CLIENT_ID) {
    console.error('❌ EXPO_PUBLIC_GOOGLE_CLIENT_ID is required');
    throw new Error('EXPO_PUBLIC_GOOGLE_CLIENT_ID environment variable is not set. Please add it to your .env file or eas.json build profile.');
  }
  if (!GOOGLE_IOS_CLIENT_ID && Platform.OS === 'ios') {
    console.warn('⚠️ EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID not set (required for iOS)');
  }
  if (!GOOGLE_ANDROID_CLIENT_ID && Platform.OS === 'android') {
    console.warn('⚠️ EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID not set (recommended for debugging)');
  }
}

// Initialize Google Sign-In configuration
let isConfigured = false;

/**
 * Configure Google Sign-In
 * This must be called before using signIn()
 */
function configureGoogleSignIn() {
  if (isConfigured || isExpoGo) {
    return;
  }

  // Validate webClientId is set before configuring
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error(
      'Google Sign-In configuration failed: EXPO_PUBLIC_GOOGLE_CLIENT_ID is not set.\n\n' +
      'Please add it to your .env file or eas.json build profile:\n' +
      'EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com'
    );
  }

  // Configure Google Sign-In with platform-specific client IDs
  // Note: Removed unnecessary scopes - only request what's needed for authentication
  const config: any = {
    webClientId: GOOGLE_WEB_CLIENT_ID, // Required: Web OAuth Client ID (also used for Android)
    offlineAccess: false, // Set to false - we only need id_token, not refresh token
    forceCodeForRefreshToken: false,
    // Removed scopes - not needed for basic Google Sign-In authentication
  };

  // Add iOS client ID if available (required for iOS)
  if (GOOGLE_IOS_CLIENT_ID) {
    config.iosClientId = GOOGLE_IOS_CLIENT_ID;
  }

  console.log('=== GOOGLE SIGN-IN CONFIGURATION ===');
  console.log('Current Platform:', Platform.OS);
  console.log('Web Client ID:', GOOGLE_WEB_CLIENT_ID?.substring(0, 20) + '...');

  if (Platform.OS === 'ios' && config.iosClientId) {
    console.log('✅ iOS Client ID configured:', config.iosClientId.substring(0, 20) + '...');
  } else if (Platform.OS === 'ios') {
    console.log('⚠️ iOS Client ID not set (iOS will not work)');
  }

  if (Platform.OS === 'android') {
    console.log('✅ Using webClientId for Android:', GOOGLE_WEB_CLIENT_ID?.substring(0, 20) + '...');
    if (GOOGLE_ANDROID_CLIENT_ID) {
      console.log('ℹ️  Android Client ID (reference only):', GOOGLE_ANDROID_CLIENT_ID.substring(0, 20) + '...');
    }
    console.log('📋 Android requires:');
    console.log('   1. SHA-1 fingerprint added to Google Cloud Console');
    console.log('   2. Package name must match app.json and Google Cloud Console');
    console.log('   3. Wait 5-10 minutes after making changes in Google Cloud Console');
  }
  console.log('====================================');

  if (GoogleSignin) {
    GoogleSignin.configure(config);
  }
  isConfigured = true;
}

/**
 * Alternative Google Sign-In using expo-auth-session (works in Expo Go)
 */

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
    // Check if Google Sign-In is available (not in Expo Go)
    if (!GoogleSignin) {
      throw new Error(
        'Google Sign-In is not available in Expo Go.\n\n' +
        'To test Google Sign-In:\n' +
        '1. Create a development build: eas build --profile development --platform android\n' +
        '2. Install the development build on your device\n' +
        '3. Run: npx expo start --dev-client\n\n' +
        'This is a limitation of Expo Go, which doesn\'t support native modules.'
      );
    }

    try {
      // Configure Google Sign-In if not already configured
      configureGoogleSignIn();

      // Check if Google Play Services are available (Android only)
      if (Platform.OS === 'android') {
        try {
          await GoogleSignin.hasPlayServices();
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
      console.log('Execution Environment:', Constants.executionEnvironment);
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

      // Sign in with Google
      const response = await GoogleSignin.signIn();

      // Use library's utility function to check if response is successful
      if (!isSuccessResponse(response)) {
        console.log('Google auth was rejected by user or failed');
        throw new Error('Google sign-in was cancelled or failed.');
      }

      console.log('=== SIGN-IN RESULT ===');
      console.log('User Info:', {
        id: response.data?.user?.id,
        email: response.data?.user?.email,
        name: response.data?.user?.name,
        hasIdToken: !!response.data?.idToken,
      });
      console.log('=====================');

      // Extract idToken from the response
      let idToken = response.data?.idToken;

      // Sometimes idToken isn't directly included, try getTokens() as fallback
      if (!idToken) {
        console.log('⚠️ idToken not in response, trying getTokens()...');
        try {
          const tokens = await GoogleSignin.getTokens();
          idToken = tokens.idToken;
          console.log('✅ Retrieved idToken from getTokens()');
        } catch (tokenError) {
          console.error('❌ Failed to get tokens:', tokenError);
        }
      }

      if (!idToken) {
        console.error('❌ No id_token available');
        console.error('Response structure:', JSON.stringify(response, null, 2));
        throw new Error('Google returned null idToken. Please try again.');
      }

      console.log('✅ Successfully obtained id_token');
      console.log('ID Token length:', idToken.length);
      return idToken;
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);

      // Use library's utility function to check if error has a code property
      if (isErrorWithCode && isErrorWithCode(error)) {
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
            // Check if it's a DEVELOPER_ERROR or non-recoverable sign in failure (configuration issue)
            const errorMessage = (error as any).message || '';
            const errorString = String(errorMessage).toLowerCase();

            // Check for various error indicators
            const isDeveloperError =
              errorMessage.includes('DEVELOPER_ERROR') ||
              errorMessage.includes('10:') ||
              error.code === '10' ||
              errorString.includes('non-recoverable') ||
              errorString.includes('sign in failure') ||
              errorString.includes('apiException') ||
              (error as any).statusCode === 10 ||
              (error as any).statusCode === 8;

            if (isDeveloperError) {
              // Build detailed troubleshooting message
              let troubleshooting =
                '🔴 DEVELOPER_ERROR: Google Sign-In configuration issue\n\n';

              if (Platform.OS === 'android') {
                troubleshooting +=
                  '📱 ANDROID TROUBLESHOOTING:\n\n' +
                  '1️⃣ GET YOUR SHA-1 FINGERPRINT:\n' +
                  '   cd android && ./gradlew signingReport\n' +
                  '   Look for "SHA1" under "Variant: debug"\n\n' +

                  '2️⃣ ADD SHA-1 TO GOOGLE CLOUD CONSOLE:\n' +
                  '   • Go to: https://console.cloud.google.com/apis/credentials\n' +
                  '   • Click your Android OAuth 2.0 Client ID\n' +
                  '   • Add the SHA-1 under "SHA-1 certificate fingerprints"\n' +
                  '   • SAVE and WAIT 5-10 minutes\n\n' +

                  '3️⃣ VERIFY PACKAGE NAME:\n' +
                  '   • Check app.json: ' + (GOOGLE_ANDROID_CLIENT_ID ? 'configured' : 'NOT SET') + '\n' +
                  '   • Must match Google Cloud Console OAuth Client\n\n' +

                  '4️⃣ VERIFY PROJECT CONSISTENCY:\n' +
                  `   • Web Client: ${GOOGLE_WEB_CLIENT_ID?.split('-')[0]}\n` +
                  `   • iOS Client: ${GOOGLE_IOS_CLIENT_ID?.split('-')[0] || 'NOT SET'}\n` +
                  `   • Android Client: ${GOOGLE_ANDROID_CLIENT_ID?.split('-')[0] || 'NOT SET'}\n` +
                  '   ⚠️  All three should start with the SAME project number!\n\n' +

                  '5️⃣ REBUILD:\n' +
                  '   cd android && ./gradlew clean\n' +
                  '   cd .. && npx expo prebuild --clean\n' +
                  '   npx expo run:android\n\n';
              } else if (Platform.OS === 'ios') {
                troubleshooting +=
                  '📱 iOS TROUBLESHOOTING:\n\n' +
                  '1️⃣ VERIFY BUNDLE ID:\n' +
                  '   • Check app.json ios.bundleIdentifier\n' +
                  '   • Must match Google Cloud Console OAuth Client\n\n' +

                  '2️⃣ VERIFY iOS CLIENT ID:\n' +
                  `   • iOS Client ID: ${GOOGLE_IOS_CLIENT_ID ? 'configured' : '❌ NOT SET'}\n` +
                  '   • Must be from Google Cloud Console > iOS OAuth Client\n\n' +

                  '3️⃣ REBUILD:\n' +
                  '   npx expo prebuild --clean\n' +
                  '   npx expo run:ios\n\n';
              }

              troubleshooting +=
                '📚 Resources:\n' +
                '   • Setup guide: https://react-native-google-signin.github.io/docs/setting-up/get-config-file\n' +
                '   • Troubleshooting: https://react-native-google-signin.github.io/docs/troubleshooting\n';

              throw new Error(troubleshooting);
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
    if (!GoogleSignin) {
      console.warn('Google Sign-In not available in Expo Go');
      return;
    }

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
    if (!GoogleSignin) {
      console.warn('Google Sign-In not available in Expo Go');
      return;
    }

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
    // Import Platform dynamically if not already imported
    if (!Platform) {
      try {
        Platform = require('react-native').Platform;
      } catch {
        return 'android'; // fallback
      }
    }
    return Platform.OS === 'ios' ? 'ios' : 'android';
  },

  /**
   * Check if this service is available
   * Note: This requires a development build, not Expo Go
   */
  isAvailable(): boolean {
    return !!GoogleSignin;
  },
};