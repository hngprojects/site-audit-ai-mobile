import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/Stylesheets/auditing-screen-stylesheet';

const AuditingScreenContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Auditing Screen</ThemedText>
    <ThemedText>This is the auditing screen placeholder.</ThemedText>
  </ThemedView>
);

export default function AuditingScreen() {
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

  return <AuditingScreenContent />;
}

