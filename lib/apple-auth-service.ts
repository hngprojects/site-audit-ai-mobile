import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';

export class AppleAuthService {
  static isAvailable(): boolean {
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

  static async signIn(): Promise<string> {
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

      if (credential.identityToken) {
        return credential.identityToken;
      } else {
        throw new Error('No identity token received from Apple');
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Apple sign-in failed');
    }
  }

  static getPlatform(): string {
    return 'ios'; // Apple Sign-In is primarily for iOS
  }
}

export const appleAuthService = AppleAuthService;