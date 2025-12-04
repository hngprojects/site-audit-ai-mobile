import { LoadingButton } from '@/components/ui/loading-button';
import { useAuth } from '@/hooks/use-auth';
import { RedirectService } from '@/lib/scan-service';
import styles from '@/stylesheets/sign-up-stylesheet';
import { useTranslation } from '@/utils/translations';
import Feather from '@expo/vector-icons/Feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface PasswordValidation {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

const validatePassword = (password: string): PasswordValidation => {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };
};

const isPasswordValid = (validation: PasswordValidation): boolean => {
  return Object.values(validation).every((val) => val === true);
};

const SignUp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { signUp, signInWithGoogle, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState<boolean>(false);

  const passwordValidation = useMemo(() => validatePassword(password), [password]);
  const isPasswordComplete = useMemo(() => isPasswordValid(passwordValidation), [passwordValidation]);

  useEffect(() => {
    if (isAuthenticated) {
      // Check for redirect in params first, then stored redirect
      let redirectUrl = params.redirect as string;

      if (!redirectUrl) {
        // Try to get stored redirect
        RedirectService.getStoredRedirect().then(stored => {
          if (stored) {
            redirectUrl = stored;
            RedirectService.clearStoredRedirect();
          }
        });
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
          // Invalid redirect, fallback to default
          router.replace('/');
        }
      } else {
        // No redirect, go to default route
        router.replace('/');
      }
    }
  }, [isAuthenticated, router, params]);

  // Show error toasts
  useEffect(() => {
    if (error) {
      Toast.show({
        type: 'error',
        text1: t('auth.signUpError'),
        text2: error,
      });
      clearError();
    }
  }, [error, clearError]);

  const handleSignUp = async () => {
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

    // Password validation
    if (!isPasswordComplete) {
      setLocalError(t('auth.passwordRequirementsNotMet'));
      return;
    }

    try {
      await signUp(email.trim(), password);
      // Navigation is handled by useEffect when isAuthenticated changes
    } catch (err: any) {
      // Check if this is a successful signup
      if (err.isSignupSuccess) {
        // Show success message and redirect to sign-in page
        Toast.show({
          type: 'success',
          text1: t('common.success'),
          text2: err.message || t('auth.signUpSuccess'),
        });
        // Redirect to sign-in page after a short delay, preserving all parameters
        setTimeout(() => {
          router.replace({
            pathname: '/(auth)/sign-in',
            params: params
          });
        }, 2000);
        return;
      }

      // Regular error handling
      console.error('Sign up error:', err);
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

  const handleAppleLogin = () => {
    // TODO: Implement Apple OAuth
    console.log('Apple login pressed');
  };

  return (
    // <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          ...styles.container,
        }}
      >
        <Image
          source={require('../../assets/imgs/logo-variant-2.png')}
          style={
            styles.logo
          }
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
            borderColor: hasError
              ? '#ff5a3d'
              : showPasswordRequirements && password.length > 0 && !isPasswordComplete
                ? '#ff9800'
                : '#babec6',
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
              setShowPasswordRequirements(true);
            }}
            onFocus={() => setShowPasswordRequirements(true)}
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

        {showPasswordRequirements && password.length > 0 && (
          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementsTitle}>{t('auth.passwordMustContain')}</Text>
            <View style={styles.requirementItem}>
              <Feather
                name={passwordValidation.hasMinLength ? 'check-circle' : 'circle'}
                size={16}
                color={passwordValidation.hasMinLength ? '#4CAF50' : '#9ba1ab'}
              />
              <Text
                style={[
                  styles.requirementText,
                  passwordValidation.hasMinLength && styles.requirementTextValid,
                ]}
              >
                {t('auth.passwordRequirementMinLength')}
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Feather
                name={passwordValidation.hasUppercase ? 'check-circle' : 'circle'}
                size={16}
                color={passwordValidation.hasUppercase ? '#4CAF50' : '#9ba1ab'}
              />
              <Text
                style={[
                  styles.requirementText,
                  passwordValidation.hasUppercase && styles.requirementTextValid,
                ]}
              >
                {t('auth.passwordRequirementUppercase')}
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Feather
                name={passwordValidation.hasLowercase ? 'check-circle' : 'circle'}
                size={16}
                color={passwordValidation.hasLowercase ? '#4CAF50' : '#9ba1ab'}
              />
              <Text
                style={[
                  styles.requirementText,
                  passwordValidation.hasLowercase && styles.requirementTextValid,
                ]}
              >
                {t('auth.passwordRequirementLowercase')}
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Feather
                name={passwordValidation.hasNumber ? 'check-circle' : 'circle'}
                size={16}
                color={passwordValidation.hasNumber ? '#4CAF50' : '#9ba1ab'}
              />
              <Text
                style={[
                  styles.requirementText,
                  passwordValidation.hasNumber && styles.requirementTextValid,
                ]}
              >
                {t('auth.passwordRequirementNumber')}
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Feather
                name={passwordValidation.hasSpecialChar ? 'check-circle' : 'circle'}
                size={16}
                color={passwordValidation.hasSpecialChar ? '#4CAF50' : '#9ba1ab'}
              />
              <Text
                style={[
                  styles.requirementText,
                  passwordValidation.hasSpecialChar && styles.requirementTextValid,
                ]}
              >
                {t('auth.passwordRequirementSpecial')}
              </Text>
            </View>
          </View>
        )}

        {displayError && (
          <Text style={styles.incorrectPassword}>{displayError}</Text>
        )}

        <LoadingButton
          onPress={handleSignUp}
          loading={isLoading}
          disabled={isLoading}
          text={t('auth.signUp')}
          buttonStyle={styles.signUpButton}
          textStyle={styles.signUpText}
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

        <TouchableOpacity
          style={styles.socialButton}
          onPress={handleAppleLogin}
        >
          <Image
            source={require('../../assets/images/apple.png')}
            style={styles.appleIcon}
          />
          <Text style={styles.socialButtonText}>{t('auth.continueApple')}</Text>
        </TouchableOpacity>

        <View style={styles.accountLinkContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.accountLinkText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push({
              pathname: '/(auth)/sign-in',
              params: params
            })}>
              <Text style={styles.accountLinkButton}>Sign in</Text>
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

export default SignUp;
