import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, TouchableOpacity, ScrollView, View, TextInput, Text } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
import styles from '@/stylesheets/delete-account-verification-stylesheet';

const DeleteAccountVerificationContent = () => {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(56);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCodeChange = (text: string, index: number) => {
    if (text.length > 1) return;

    // Handle backspace
    if (text === '' && index > 0) {
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Auto focus next input
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      // Verify code logic
      router.push('/(account)/delete-account-final-confirmation');
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter the complete 6-digit code',
      });
    }
  };

  const handleResend = () => {
    setTimer(56);
    setCanResend(false);
    // Resend code logic
    Toast.show({
      type: 'success',
      text1: 'Code Resent',
      text2: 'A new verification code has been sent to your email',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Delete Account</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.mainTitle}>Verify your identity</Text>
          <Text style={styles.subtitle}>
            For security purposes, please enter the 6-digit code sent to da*********i20@gmail.com
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => {
                  if (ref) inputRefs.current[index] = ref;
                }}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                placeholder="*"
                placeholderTextColor="#B9B9B9"
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus
              />
            ))}
          </View>

          <View style={styles.resendContainer}>
            <View style={styles.resendTextContainer}>
              <Text style={styles.resendText}>Didn&lsquo;t receive a code?</Text>
              <TouchableOpacity onPress={handleResend} disabled={!canResend}>
                <Text style={[styles.resendLink, !canResend && styles.resendLinkDisabled]}>Resend</Text>
              </TouchableOpacity>
            </View>

            {!canResend && (
              <Text style={styles.timerText}>Resend code in [0:{timer.toString().padStart(2, '0')}]</Text>
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.verifyButton, code.some(digit => digit !== '') && styles.verifyButtonActive]}
          onPress={handleVerify}
          disabled={code.every(digit => digit === '')}
        >
          <Text style={[styles.verifyButtonText, code.some(digit => digit !== '') && styles.verifyButtonTextActive]}>
            Verify and Confirm Deletion
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function DeleteAccountVerification() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return <DeleteAccountVerificationContent />;
}
