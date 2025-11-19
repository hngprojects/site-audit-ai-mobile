import { LoadingButton } from '@/components/ui/loading-button';
import { useAuth } from '@/hooks/use-auth';
import styles from '@/stylesheets/sign-in-stylesheet';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Lazy load social login buttons
const SocialLoginButtons = lazy(() => import('@/components/auth/social-login-buttons'));

const SignIn = () => {
  const inset = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();
  const { signIn, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Navigate to tabs when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, router]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Sign In Error', error, [
        { text: 'OK', onPress: clearError },
      ]);
    }
  }, [error, clearError]);

  const handleSignIn = async () => {
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

    try {
      await signIn(email.trim(), password);
      // Navigation is handled by useEffect when isAuthenticated changes
    } catch (err) {
      // Error is handled by the store and shown via Alert
      console.error('Sign in error:', err);
    }
  };

  const displayError = localError || error;
  const hasError = !!displayError;

  return (
    <View
      style={{
        paddingTop: inset.top,
        paddingBottom: inset.bottom,
        ...styles.container,
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

      <Text style={{ ...styles.createAccountTitle }}>Sign in to your account</Text>

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
          placeholder="***********"
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
        <Text style={styles.incorrectPassword}>{displayError}</Text>
      )}

      <TouchableOpacity
        onPress={() => router.push('/(auth)/forgot-password')}
        style={styles.forgotPasswordContainer}
        disabled={isLoading}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <LoadingButton
        onPress={handleSignIn}
        loading={isLoading}
        disabled={isLoading}
        text="Sign in"
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

      <View style={styles.SignUpContainer}>
        <Text style={styles.existingAccountText}>Don&apos;t have an account?</Text>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/sign-up')}
          disabled={isLoading}
        >
          <Text style={styles.SignUp}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignIn;
