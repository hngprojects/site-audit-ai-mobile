import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styles from '../../Stylesheets/email-support-stylesheet';

const EmailSupportContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Email Support</ThemedText>
    <ThemedText>This is the email support placeholder.</ThemedText>
  </ThemedView>
);

export default function EmailSupport() {
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

  return <EmailSupportContent />;
}

