import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import styles from '@/stylesheets/confirmation-screen-stylesheet';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

const ConfirmationScreenContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Confirmation Screen</ThemedText>
    <ThemedText>This is the confirmation screen placeholder.</ThemedText>
  </ThemedView>
);

export default function ConfirmationScreen() {
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

  return <ConfirmationScreenContent />;
}

