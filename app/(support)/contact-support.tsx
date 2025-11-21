import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styles from '../../Stylesheets/contact-support-stylesheet';

const ContactSupportContent = () => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Contact Support</ThemedText>
    <ThemedText>This is the contact support placeholder.</ThemedText>
  </ThemedView>
);

export default function ContactSupport() {
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

  return <ContactSupportContent />;
}

