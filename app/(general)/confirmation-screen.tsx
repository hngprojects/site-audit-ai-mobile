import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import styles from '@/stylesheets/confirmation-screen-stylesheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

const ConfirmationScreenContent = () => {
  const router = useRouter();
  //const website = useAuditStore((state) => state.domain);
  const website = "www.fashionsense.com"

  return (
    <ThemedView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.checkmarkContainerOuter}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="paper-plane-outline" size={30.72} color="#1A7338" />
          </View>
        </View>
        <ThemedText type="title" style={styles.title}>Your request is on its way!</ThemedText>
        <ThemedText style={styles.message}>
          Sitelytics has received your request and will get back to you within 24 hours.
        </ThemedText>

      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/')}>
        <Text style={styles.buttonText}>Back to home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButtonContainer} 
      onPress={() =>
        router.replace({
        pathname: "/(socialShare)/share-audit-promo-image-screen",
        params: { website },
        })}
      >
        <Feather name="share-2" size={18} color="#FF5A3D" />
        <Text style={styles.shareButtonText}>Share</Text>
      </TouchableOpacity>
    </ThemedView>
  );
};

export default function ConfirmationScreen() {
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

  return <ConfirmationScreenContent />;
}

