import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/stylesheets/delete-account-verification-stylesheet';

const DeleteAccountVerificationContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Delete Account Verification</ThemedText>
    <ThemedText>This is the delete account verification placeholder.</ThemedText>
  </ThemedView>
);

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
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return <DeleteAccountVerificationContent />;
}

