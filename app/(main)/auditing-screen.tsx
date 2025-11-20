import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import React from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuditingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={{ flex: 1 }}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Scanning Website...</ThemedText>
          <ThemedText>https://www.google.com</ThemedText>
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff5a3d" />
        </ThemedView>
        <ThemedView style={styles.content}>
          {/* <Image source={require('@/assets/images/auditing-screen-image.png')} style={styles.image} /> */}
          <ThemedText>Hang tight, Takes about 30–60 seconds</ThemedText>
          <ThemedView style={styles.progress}>
            {/* implement progress bar here */}
            <ThemedText>0%</ThemedText>
          </ThemedView>
          <ThemedView style={styles.footer}>
            {/* implement process messages hers */}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  )
}

export default AuditingScreen