import { LoadingButton } from '@/components/ui/loading-button';
import { useAuth } from '@/hooks/use-auth';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../Stylesheets/sign-up-stylesheet';

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
  const router = useRouter();
  const { signUp, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [localError, setLocalError] = useState<string | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState<boolean>(false);

  const passwordValidation = useMemo(() => validatePassword(password), [password]);
  const isPasswordComplete = useMemo(() => isPasswordValid(passwordValidation), [passwordValidation]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Sign Up Error', error, [
        { text: 'OK', onPress: clearError },
      ]);
    }
  }, [error, clearError]);

  const handleSignUp = async () => {
    // Reset local error
    setLocalError(null);
    clearError();

    // Validation
    if (!email.trim()) {
      setLocalError('Email is required');
      return;
    }

    if (!password.trim()) {
      setLocalError('Password is required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setLocalError('Please enter a valid email address');
      return;
    }

    // Password validation
    if (!isPasswordComplete) {
      setLocalError('Please ensure your password meets all requirements');
      return;
    }

    try {
      await signUp(email.trim(), password);
      // Navigation is handled by useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by the store and shown via Alert
      console.error('Sign up error:', err);
    }
  };

  const displayError = localError || error;
  const hasError = !!displayError;

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

        <Text style={{ ...styles.textInputLabel }}>Email</Text>

        <TextInput
          placeholder="user@gmail.com"
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

        <Text style={{ ...styles.textInputLabel }}>Password</Text>

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
            placeholder="Enter your password"
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
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
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
                At least 8 characters
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
                One uppercase letter
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
                One lowercase letter
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
                One number
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
                One special character
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
          text="Sign Up"
          buttonStyle={styles.signUpButton}
          textStyle={styles.signUpText}
        />

        <View style={styles.tipBox}>
          <Image
            source={require('../../assets/images/light-bulb.png')}
            style={styles.lightBulbIcon}
            resizeMode="contain"
          />
          <Text style={styles.tipText}>
            Join 2000+ business owners who&apos;ve improved their sales with Sitelytics.
          </Text>
        </View>
      </KeyboardAvoidingView>

      <View style={styles.signInButtonContainer}>
        <TouchableOpacity 
          style={styles.signInButton}
          onPress={() => router.push('/(auth)/sign-in')}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
