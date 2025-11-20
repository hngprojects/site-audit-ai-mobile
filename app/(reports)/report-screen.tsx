import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/Stylesheets/report-screen-stylesheet';

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

