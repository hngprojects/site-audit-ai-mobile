import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/stylesheets/delete-account-screen-stylesheet';

const DeleteAccountScreenContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Delete Account Screen</ThemedText>
    <ThemedText>This is the delete account screen placeholder.</ThemedText>
  </ThemedView>
);

export default function DeleteAccountScreen() {
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

  return <DeleteAccountScreenContent />;
}

