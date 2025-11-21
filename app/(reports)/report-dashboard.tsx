import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styles from '../../Stylesheets/report-dashboard-stylesheet';

const ReportDashboardContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Report Dashboard</ThemedText>
    <ThemedText>This is the report dashboard placeholder.</ThemedText>
  </ThemedView>
);

export default function ReportDashboard() {
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

  return <ReportDashboardContent />;
}

