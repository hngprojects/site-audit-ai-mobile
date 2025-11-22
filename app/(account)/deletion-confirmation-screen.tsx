import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import styles from '@/stylesheets/deletion-confirmation-screen-stylesheet';

const DeletionConfirmationScreenContent = () => {
  const router = useRouter();

  const handleDone = () => {
    // Navigate to home or splash
    router.replace('/(tabs)');
  };

  const handleReactivate = () => {
    // Navigate to sign in
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Sitelytics</Text>

          </View>

          <View>
            <Text style={styles.title}>Account Deactivated</Text>

            <Text style={styles.description}>
              Your Sitelytics account is scheduled for deletion. It will be permanently removed in 14 days.{'\n\n'}
              If you change your mind, simply log in again before then to reactivate your account.{'\n\n'}
              We hope to see you back soon.
            </Text>
          </View>

        </View>


        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.doneButton} onPress={handleDone}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.reactivateButton} onPress={handleReactivate}>
            <Text style={styles.reactivateButtonText}>Reactivate my Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function DeletionConfirmationScreen() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return <DeletionConfirmationScreenContent />;
}

