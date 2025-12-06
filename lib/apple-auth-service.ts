import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export interface AppleAuthCredential {
  authorizationCode: string;
  identityToken: string | null;
  email: string | null;
  fullName: {
    givenName: string | null;
    familyName: string | null;
  } | null;
  user: string; // Apple's unique user identifier
}

export class AppleAuthService {
  static isAvailable(): boolean {
    // Apple Sign-In is only available on iOS
    if (Platform.OS !== 'ios') {
      return false;
    }

    // Check if running in Expo Go (which doesn't support Apple Sign-In)
    const isExpoGo = Constants.executionEnvironment === 'storeClient';
    if (isExpoGo) {
      console.warn('Apple Sign-In is not available in Expo Go. Please use a development build.');
      return false;
    }

    try {
      // Check if AppleAuthentication is available (iOS only)
      return AppleAuthentication && typeof AppleAuthentication.isAvailableAsync === 'function';
    } catch {
      return false;
    }
  }

  static async checkAvailability(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }

    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch {
      return false;
    }
  }

  /**
   * Sign in with Apple and return the credential containing authorization code
   * The authorization code is sent to the backend callback endpoint
   */
  static async signIn(): Promise<AppleAuthCredential> {
    // Check platform
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only available on iOS devices.');
    }

    // Check if running in Expo Go
    const isExpoGo = Constants.executionEnvironment === 'storeClient';
    if (isExpoGo) {
      throw new Error(
        'Apple Sign-In is not available in Expo Go.\n\n' +
        'To test Apple Sign-In:\n' +
        '1. Create a development build: eas build --profile development --platform ios\n' +
        '2. Install the development build on your iOS device\n' +
        '3. Run: npx expo start --dev-client\n\n' +
        'Expo Go does not support native iOS modules like Apple Sign-In.'
      );
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // The authorizationCode is required for the backend callback
      if (!credential.authorizationCode) {
        throw new Error('No authorization code received from Apple');
      }

      console.log('✅ Apple Sign-In successful');
      console.log('User:', credential.user);
      console.log('Email:', credential.email || '(not provided - returning user)');
      console.log('Name:', credential.fullName?.givenName || '(not provided - returning user)');

      return {
        authorizationCode: credential.authorizationCode,
        identityToken: credential.identityToken,
        email: credential.email,
        fullName: credential.fullName ? {
          givenName: credential.fullName.givenName,
          familyName: credential.fullName.familyName,
        } : null,
        user: credential.user,
      };
    } catch (error: any) {
      // Handle specific Apple authentication errors
      if (error.code === 'ERR_REQUEST_CANCELED') {
        throw new Error('Sign-in was cancelled by the user.');
      }
      if (error.code === 'ERR_INVALID_RESPONSE') {
        throw new Error('Invalid response from Apple. Please try again.');
      }
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Apple sign-in failed. Please try again.');
    }
  }

  static getPlatform(): string {
    return 'ios';
  }
}

export const appleAuthService = AppleAuthService;