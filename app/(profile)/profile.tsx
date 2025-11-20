import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/Stylesheets/profile-stylesheet';

const ProfileContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Profile</ThemedText>
    <ThemedText>This is the profile placeholder.</ThemedText>
  </ThemedView>
);

export default function Profile() {
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

  return <ProfileContent />;
}

