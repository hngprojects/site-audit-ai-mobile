import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styles from '../../Stylesheets/change-password-stylesheet';

const ChangePasswordContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Change Password</ThemedText>
    <ThemedText>This is the change password placeholder.</ThemedText>
  </ThemedView>
);

export default function ChangePassword() {
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

  return <ChangePasswordContent />;
}

