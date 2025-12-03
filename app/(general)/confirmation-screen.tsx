import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuditStore } from '@/store/website-domain';
import { useTranslation } from '@/utils/translations';
import styles from '@/stylesheets/confirmation-screen-stylesheet';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ConfirmationScreenContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const website = useAuditStore((state) => state.domain);
  const inset = useSafeAreaInsets();
 

  return (
    <ThemedView style={[styles.container, {paddingTop: inset.top, paddingBottom: inset.bottom}]}>
      <View style={styles.content}>
        <View style={styles.checkmarkContainerOuter}>
          <View style={styles.checkmarkContainer}>
            <Ionicons name="paper-plane-outline" size={30.72} color="#1A7338" />
          </View>
        </View>
        <ThemedText type="title" style={styles.title}>{t('confirmation.requestOnWay')}</ThemedText>
        <ThemedText style={styles.message}>
          {t('confirmation.requestReceived')}
        </ThemedText>

      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.replace('/(tabs)/')}>
        <Text style={styles.buttonText}>{t('confirmation.backToHome')}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.shareButtonContainer} 
      onPress={() =>
        router.replace({
        pathname: "/(socialShare)/share-audit-promo-image-screen",
        params: { website },
        })}
      >
        <Feather name="share-2" size={18} color="#FF5A3D" />
        <Text style={styles.shareButtonText}>{t('common.share')}</Text>
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

