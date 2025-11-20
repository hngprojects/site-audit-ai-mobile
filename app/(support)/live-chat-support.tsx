import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/stylesheets/live-chat-support-stylesheet';

const LiveChatSupportContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Live Chat Support</ThemedText>
    <ThemedText>This is the live chat support placeholder.</ThemedText>
  </ThemedView>
);

export default function LiveChatSupport() {
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

  return <LiveChatSupportContent />;
}

