import { LoadingButton } from '@/components/ui/loading-button';
import { useAuth } from '@/hooks/use-auth';
import { biometricService } from '@/lib/biometric-service';
import { RedirectService } from '@/lib/redirect-service';
import styles from '@/stylesheets/sign-in-stylesheet';
import { useTranslation } from '@/utils/translations';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const SignIn = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signIn, signInWithGoogle, signInWithApple, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [biometricAvailable, setBiometricAvailable] = useState<boolean>(false);
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);

  const handleBiometricLogin = async () => {
    try {
      const credentials = await biometricService.getCredentials();
      if (!credentials) {
        // No credentials saved, silently return - user can sign in manually
        return;
      }

      // Authenticate with biometrics
      const result = await biometricService.authenticate(
        Platform.OS === 'ios'
          ? 'Use Face ID to sign in'
          : 'Use your fingerprint to sign in'
      );

      if (result.success) {
        // Biometric authentication successful, sign in with saved credentials
        try {
          await signIn(credentials.email, credentials.password);
        } catch {
          // If login fails, credentials might be invalid, remove them
          await biometricService.removeCredentials();
          Toast.show({
            type: 'error',
            text1: t('auth.biometricLoginFailed'),
            text2: t('auth.invalidCredentials'),
          });
        }
      } else if (result.error === 'user_cancel') {
        // User cancelled biometric prompt - silently allow manual login
        return;
      } else if (result.error === 'user_fallback') {
        // User chose to use passcode - silently allow manual login
        return;
      } else {
        // Other errors - only show alert for unexpected failures
        console.error('Biometric authentication error:', result.error);
      }
    } catch (error) {
      console.error('Biometric login error:', error);
      // Only show alert for unexpected errors
    }
  };

  // Check biometric availability and auto-trigger if enabled
  useEffect(() => {
    const checkAndTriggerBiometric = async () => {
      try {
        const available = await biometricService.isAvailable();
        const enabled = await biometricService.isEnabled();
        setBiometricAvailable(available);
        setBiometricEnabled(enabled);

        // If biometric is enabled and available, automatically trigger authentication
        if (available && enabled) {
          const credentials = await biometricService.getCredentials();
          if (credentials) {
            // Small delay to ensure UI is ready, then auto-trigger biometric
            setTimeout(() => {
              handleBiometricLogin();
            }, 300);
          }
        }
      } catch (error) {
        console.error('Error checking biometric:', error);
      }
    };

    checkAndTriggerBiometric();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Show error toasts
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('auth.signInError'),
        text2: error,
      });
      clearError();
    }
  }, [error, clearError]);

  const handleSignIn = async () => {
    // Reset local error
    setLocalError(null);
    clearError();

    // Validation
    if (!email.trim()) {
      setLocalError(t('auth.emailRequired'));
      return;
    }

    if (!password.trim()) {
      setLocalError(t('auth.passwordRequired'));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError(t('auth.invalidEmail'));
      return;
    }

    try {
      await signIn(email.trim(), password);
      // Save credentials for biometric login if biometric is enabled
      if (biometricEnabled && biometricAvailable) {
        await biometricService.saveCredentials({
          email: email.trim(),
          password: password,
        });
      }
      
      // Handle redirect after successful sign-in
      let redirectUrl = params.redirect as string;

      if (!redirectUrl) {
        const stored = await RedirectService.getStoredRedirect();
        if (stored) {
          redirectUrl = stored;
          RedirectService.clearStoredRedirect();
        }
      }

      if (redirectUrl) {
        const validatedRedirect = RedirectService.validateRedirect(redirectUrl);

        if (validatedRedirect) {
          const { pathname, params: redirectParams } = RedirectService.parseRedirectUrl(validatedRedirect);
          router.replace({
            pathname: pathname as any,
            params: redirectParams
          });
        } else {
          router.replace('/');
        }
      } else {
        router.replace('/');
      }
    } catch (error) {
      // Error is handled by the store and shown via Alert
      console.error('Sign in error:', error);
    }
  };

  const displayError = localError || error;
  const hasError = !!displayError;

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // Navigation is handled by useEffect when isAuthenticated changes
    } catch (error) {
      // Error is handled by the store and shown via Alert
      console.error('Google sign-in error:', error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      await signInWithApple();
      // Navigation is handled by useEffect when isAuthenticated changes
      
      // Handle redirect after successful sign-in
      let redirectUrl = params.redirect as string;

      if (!redirectUrl) {
        const stored = await RedirectService.getStoredRedirect();
        if (stored) {
          redirectUrl = stored;
          RedirectService.clearStoredRedirect();
        }
      }

      if (redirectUrl) {
        const validatedRedirect = RedirectService.validateRedirect(redirectUrl);
        if (validatedRedirect) {
          const { pathname, params: redirectParams } = RedirectService.parseRedirectUrl(validatedRedirect);
          router.replace({
            pathname: pathname as any,
            params: redirectParams
          });
        } else {
          router.replace('/');
        }
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          ...styles.container,
        }}
      >
        <Image
          source={require('../../assets/imgs/logo-variant-2.png')}
          style={styles.logo}
        />

        <Text style={{ ...styles.textInputLabel }}>{t('auth.email')}</Text>

        <TextInput
          placeholder={t('auth.emailPlaceholder')}
          style={styles.textInput}
          placeholderTextColor="#dfdfdfff"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setLocalError(null);
            clearError();
          }}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />

        <Text style={{ ...styles.textInputLabel }}>{t('auth.password')}</Text>

        <View
          style={{
            borderColor: hasError ? '#ff5a3d' : '#babec6',
            ...styles.passwordContainer,
          }}
        >
          <TextInput
            placeholder={t('auth.passwordPlaceholder')}
            style={styles.passwordTextInput}
            placeholderTextColor="#dfdfdfff"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setLocalError(null);
              clearError();
            }}
            secureTextEntry={secureTextEntry}
            editable={!isLoading}
          />

          {secureTextEntry ? (
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <Feather name="eye-off" size={24} color="#9ba1ab" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <Feather name="eye" size={24} color="#9ba1ab" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => { router.push('/(auth)/forgot-password') }}>
            <Text style={styles.forgotPasswordText}>{t('auth.forgotPassword')}</Text>
          </TouchableOpacity>
        </View>

        {displayError && (
          <Text style={styles.incorrectPassword}>{displayError}</Text>
        )}

        <LoadingButton
          onPress={handleSignIn}
          loading={isLoading}
          disabled={isLoading}
          text={t('auth.signIn')}
          buttonStyle={styles.signInButton}
          textStyle={styles.signInText}
        />

        <View style={styles.orDivider}>
          <View style={styles.orDividerLine} />
          <Text style={styles.orDividerText}>{t('common.or')}</Text>
          <View style={styles.orDividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.socialButton, isLoading && { opacity: 0.6 }]}
          onPress={handleGoogleLogin}
          disabled={isLoading}
        >
          <Image
            source={require('../../assets/images/google.png')}
            style={styles.socialIcon}
          />
          <Text style={styles.socialButtonText}>{t('auth.continueGoogle')}</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[styles.socialButton, isLoading && { opacity: 0.6 }]}
            onPress={handleAppleLogin}
            disabled={isLoading}
          >
            <Image
              source={require('../../assets/images/apple.png')}
              style={styles.appleIcon}
            />
            <Text style={styles.socialButtonText}>{t('auth.continueApple')}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.accountLinkContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.accountLinkText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push({
              pathname: '/(auth)/sign-up',
              params: params
            })}>
              <Text style={styles.accountLinkButton}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View style={styles.tipBox}>
          <Image
            source={require('../../assets/images/light-bulb.png')}
            style={styles.lightBulbIcon}
            resizeMode="contain"
          />
          <Text style={styles.tipText}>
            Join 2000+ business owners who&#39;ve improved their sales with Sitelytics.
          </Text>
        </View> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignIn;
