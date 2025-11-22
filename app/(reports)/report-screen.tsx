import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import styles from '@/stylesheets/report-screen-stylesheet';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

const ReportScreenContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Report Screen</ThemedText>
    <ThemedText>This is the report screen placeholder.</ThemedText>
  </ThemedView>
);

export default function ReportScreen() {
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

  return <ReportScreenContent />;
}

