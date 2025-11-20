import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/Stylesheets/delete-account-choice-selection-stylesheet';

const DeleteAccountChoiceSelectionContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Delete Account Choice Selection</ThemedText>
    <ThemedText>This is the delete account choice selection placeholder.</ThemedText>
  </ThemedView>
);

export default function DeleteAccountChoiceSelection() {
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

  return <DeleteAccountChoiceSelectionContent />;
}

