import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import styles from '@/Stylesheets/homepage-stylesheet';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

const HomepageContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Homepage</ThemedText>
    <ThemedText>This is the homepage placeholder.</ThemedText>
  </ThemedView>
);

export default function Homepage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Lazy load the component
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

  return <HomepageContent />;
}

