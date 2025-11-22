import { LoadingButton } from '@/components/ui/loading-button';
import { useAuth } from '@/hooks/use-auth';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheets/sign-in-stylesheet';

const SignIn = () => {
  const router = useRouter();
  const { signIn, isLoading, error, clearError, isAuthenticated } = useAuth();

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

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => {router.push('/(auth)/forgot-password')}}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {displayError && (
          <Text style={styles.incorrectPassword}>{displayError}</Text>
        )}

        <LoadingButton
          onPress={handleSignIn}
          loading={isLoading}
          disabled={isLoading}
          text="Sign In"
          buttonStyle={styles.signInButton}
          textStyle={styles.signInText}
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

      <View style={styles.signUpButtonContainer}>
        <TouchableOpacity 
          style={styles.signUpButton}
          onPress={() => router.push('/(auth)/sign-up')}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
