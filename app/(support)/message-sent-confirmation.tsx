import React, { useState, useEffect } from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/stylesheets/confirmation-screen-stylesheet';

const MessageSentConfirmationContent = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.content}>
        <View style={styles.checkmarkContainerOuter}>
          <View style={styles.checkmarkContainer}>
            <Feather name="check" size={50} color="#1B7A18" />
          </View>
        </View>

        <ThemedText type="title" style={styles.title}>Message Sent!</ThemedText>
        <ThemedText style={styles.message}>
          Thank you for reaching out. We&lsquo;ll get back to you at <ThemedText style={[styles.message, styles.email]}>damianamadi20@gmail.com</ThemedText> within 24 hours.
        </ThemedText>

      </ThemedView>
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => router.push('/(tabs)/profile')}
      >
        <ThemedText style={styles.doneButtonText}>Done</ThemedText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default function MessageSentConfirmation() {
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

  return <MessageSentConfirmationContent />;
}
