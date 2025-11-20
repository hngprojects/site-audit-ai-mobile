import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/Stylesheets/deletion-confirmation-screen-stylesheet';

const DeletionConfirmationScreenContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Deletion Confirmation Screen</ThemedText>
    <ThemedText>This is the deletion confirmation screen placeholder.</ThemedText>
  </ThemedView>
);

export default function DeletionConfirmationScreen() {
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

  return <DeletionConfirmationScreenContent />;
}

