import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styles from '../../Stylesheets/website-review-request-screen-stylesheet';

const WebsiteReviewRequestScreenContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Website Review Request Screen</ThemedText>
    <ThemedText>This is the website review request screen placeholder.</ThemedText>
  </ThemedView>
);

export default function WebsiteReviewRequestScreen() {
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

  return <WebsiteReviewRequestScreenContent />;
}

