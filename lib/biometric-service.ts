import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';

export interface BiometricCredentials {
  email: string;
  password: string;
}

/**
 * Biometric authentication service
 * Handles Face ID (iOS) and Fingerprint (Android) authentication
 */
export const biometricService = {
  /**
   * Check if biometric authentication is available on the device
   */
  async isAvailable(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) return false;

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return enrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      return false;
    }
  },

  /**
   * Get the supported authentication types
   */
  async getSupportedTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting supported authentication types:', error);
      return [];
    }
  },

  /**
   * Authenticate using biometrics
   * @param promptMessage - Optional custom message for the authentication prompt
   */
  async authenticate(
    promptMessage: string = 'Authenticate to continue'
  ): Promise<LocalAuthentication.LocalAuthenticationResult> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false, // Allow device passcode as fallback
        fallbackLabel: 'Use Passcode',
      });
      return result;
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      throw error;
    }
  },

  /**
   * Save credentials securely for biometric login
   */
  async saveCredentials(credentials: BiometricCredentials): Promise<void> {
    try {
      const serialized = JSON.stringify(credentials);
      await SecureStore.setItemAsync(BIOMETRIC_CREDENTIALS_KEY, serialized);
    } catch (error) {
      console.error('Error saving biometric credentials:', error);
      throw new Error('Failed to save credentials for biometric login');
    }
  },

  /**
   * Retrieve saved credentials
   */
  async getCredentials(): Promise<BiometricCredentials | null> {
    try {
      const serialized = await SecureStore.getItemAsync(BIOMETRIC_CREDENTIALS_KEY);
      if (!serialized) return null;

      const credentials = JSON.parse(serialized) as BiometricCredentials;
      return credentials;
    } catch (error) {
      console.error('Error retrieving biometric credentials:', error);
      return null;
    }
  },

  /**
   * Remove saved credentials
   */
  async removeCredentials(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(BIOMETRIC_CREDENTIALS_KEY);
    } catch (error) {
      console.error('Error removing biometric credentials:', error);
    }
  },

  /**
   * Check if biometric login is enabled
   */
  async isEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric enabled status:', error);
      return false;
    }
  },

  /**
   * Enable biometric login
   */
  async enable(): Promise<void> {
    try {
      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
    } catch (error) {
      console.error('Error enabling biometric login:', error);
      throw new Error('Failed to enable biometric login');
    }
  },

  /**
   * Disable biometric login and remove saved credentials
   */
  async disable(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
      await this.removeCredentials();
    } catch (error) {
      console.error('Error disabling biometric login:', error);
      throw new Error('Failed to disable biometric login');
    }
  },
};

