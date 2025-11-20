import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/stylesheets/language-screen-stylesheet';

const LanguageContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Language</ThemedText>
    <ThemedText>This is the language placeholder.</ThemedText>
  </ThemedView>
);

export default function Language() {
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

  return <LanguageContent />;
}

