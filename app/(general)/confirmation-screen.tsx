import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/Stylesheets/confirmation-screen-stylesheet';

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

