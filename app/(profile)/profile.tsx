import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styles from '../../stylesheets/profile-stylesheet';

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

