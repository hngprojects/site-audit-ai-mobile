import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styles from '../../Stylesheets/edit-profile-stylesheet';

const EditProfileContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Edit Profile</ThemedText>
    <ThemedText>This is the edit profile placeholder.</ThemedText>
  </ThemedView>
);

export default function EditProfile() {
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

  return <EditProfileContent />;
}

