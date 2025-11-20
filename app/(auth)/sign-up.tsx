import { LoadingButton } from '@/components/ui/loading-button';
import { useAuth } from '@/hooks/use-auth';
import styles from '@/Stylesheets/sign-up-stylesheet';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Keyboard, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Lazy load social login buttons
const SocialLoginButtons = lazy(() => import('@/components/auth/social-login-buttons'));

const SignUp = () => {
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const { signUp, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [localError, setLocalError] = useState<string | null>(null);

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
    if (!fullName.trim()) {
      setLocalError('Full name is required');
      return;
    }

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
    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      await signUp(fullName.trim(), email.trim(), password);
      // Navigation is handled by useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by the store and shown via Alert
      console.error('Sign up error:', err);
    }
  };

  const displayError = localError || error;
  const hasError = !!displayError;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior="padding"
        style={{
          ...styles.container,
          paddingTop: inset.top,
          paddingBottom: inset.bottom,
        }}
      >
        <Image
          source={require('../../assets/images/icon.png')}
          style={{
            width: 140,
            resizeMode: 'contain',
            alignSelf: 'center',
            ...styles.logo,
          }}
        />

        <Text style={{ ...styles.createAccountTitle }}>Create your account</Text>

        <Text style={{ ...styles.textInputLabel }}>Full Name</Text>

        <TextInput
          placeholder="Enter your full name"
          style={styles.textInput}
          placeholderTextColor="#dfdfdfff"
          value={fullName}
          onChangeText={(text) => {
            setFullName(text);
            setLocalError(null);
            clearError();
          }}
          autoCapitalize="words"
          editable={!isLoading}
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
            borderColor: hasError ? '#ff5a3d' : '#babec6',
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

        {displayError && (
          <Text style={[styles.incorrectPassword, { marginTop: 8 }]}>{displayError}</Text>
        )}

        <LoadingButton
          onPress={handleSignUp}
          loading={isLoading}
          disabled={isLoading}
          text="Sign Up"
          buttonStyle={styles.signUpButton}
          textStyle={styles.signUpText}
        />

        <View style={styles.continueWithSection}>
          <View style={styles.Line} />

          <Text style={styles.continueText}>Or continue with</Text>

          <View style={styles.Line} />
        </View>

        <Suspense
          fallback={
            <View style={styles.SocialSIgninButton}>
              <ActivityIndicator size="small" color="#9ba1ab" />
            </View>
          }
        >
          <SocialLoginButtons />
        </Suspense>

        <View style={styles.SignInContainer}>
          <Text style={styles.existingAccountText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
            <Text style={styles.SignIN}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
