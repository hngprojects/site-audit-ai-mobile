import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import styles from '@/stylesheets/privacy-stylesheet';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

const PrivacyContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Privacy</ThemedText>
    <ThemedText>This is the privacy placeholder.</ThemedText>
  </ThemedView>
);

export default function Privacy() {
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

  return <PrivacyContent />;
}

