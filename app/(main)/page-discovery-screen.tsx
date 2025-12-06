import { startPageDiscovery } from '@/actions/scan-actions';
import WaveCircle from '@/components/animated-wave-circle';
import ScanStepItem from '@/components/scan-step-item';
import { useScanStore } from '@/store/useScanStore';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import { useTranslation } from '@/utils/translations';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const PageDiscoveryScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const route = useRoute();
  const params = route.params as any;

  const url = Array.isArray(params?.url) ? params.url[0] : params?.url;

  const {
    currentEvent,
    isCompleted,
    eventMessages,
  } = useScanStore();

  const [isStopping, setIsStopping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const eventToStepMap = useMemo<Record<string, number>>(() => ({
    discovery_started: 1,
    crawling_pages: 1,
    analyzing_structure: 2,
    prioritizing_pages: 3,
    discovery_complete: 4,
  }), []);

  const discoverySteps = useMemo(() => {
    return [
      {
        text: eventMessages['discovery_started'] || eventMessages['crawling_pages'] || t('auditing.analyzing'),
        icon: 'search' as const,
        iconSet: 'FontAwesome' as const,
      },
      {
        text: eventMessages['analyzing_structure'] || t('auditing.scanningContent'),
        icon: 'description' as const,
        iconSet: 'MaterialIcons' as const,
      },
      {
        text: eventMessages['prioritizing_pages'] || t('auditing.checkingSpeed'),
        icon: 'speed' as const,
        iconSet: 'MaterialIcons' as const,
      },
      {
        text: eventMessages['discovery_complete'] || t('auditing.findingLinks'),
        icon: 'link' as const,
        iconSet: 'FontAwesome' as const,
      },
    ];
  }, [eventMessages, t]);

  // Convert currentEvent to completed steps count
  const completedSteps = useMemo(() => {
    if (isCompleted) return discoverySteps.length;
    if (!currentEvent) return 0;

    const step = eventToStepMap[currentEvent] || 0;
    return step;
  }, [currentEvent, isCompleted, discoverySteps.length, eventToStepMap]);

  useEffect(() => {
    if (isCompleted && url) {
      const timeout = setTimeout(() => {
        router.replace({
          pathname: "/(main)/pages-result-screen",
          params: { url: url },
        });
      }, 1200);

      return () => clearTimeout(timeout);
    }
  }, [isCompleted, url, router]);

  // Start page discovery when component mounts
  useEffect(() => {
    if (url && !hasStarted) {
      setHasStarted(true);
      useScanStore.getState().reset();

      startPageDiscovery(url, (event, data) => {
        console.log('[PageDiscoveryScreen] Event received:', event, data);

        try {
          useScanStore.getState().updateFromEvent(event as any, data);
        } catch (error) {
          console.error('[PageDiscoveryScreen] Error updating store:', error);
        }
      }).catch((error) => {
        console.error('[PageDiscoveryScreen] Failed to start discovery:', error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to start page discovery',
        });
      });
    }
  }, [url, hasStarted]);

  const handleStopDiscovery = async () => {
    setIsStopping(true);
    useScanStore.getState().reset();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discovering pages on your site...</Text>
          <Text style={styles.headerUrl}>{url}</Text>
        </View>

        <View style={styles.content}>
          {completedSteps >= 2 && <View style={styles.glowCircle} />}

          <WaveCircle
            size={120}
            completedSteps={completedSteps}
            totalSteps={discoverySteps.length}
          />

          <View style={{ marginBottom: 40 }} />

          <Text style={styles.hangTight}>{t("auditing.hangTight")}</Text>

          <View style={styles.checklistContainer}>
            {discoverySteps.map((step, index) => (
              <ScanStepItem
                key={index}
                text={step.text}
                index={index}
                active={index < completedSteps}
              />
            ))}
          </View>
        </View>

        {!isCompleted && (
          <View style={styles.stopButtonContainer}>
            <TouchableOpacity
              style={styles.stopButton}
              onPress={handleStopDiscovery}
              disabled={isStopping}
            >
              {isStopping ? (
                <ActivityIndicator size="small" color="#FF6B35" />
              ) : (
                <Text style={styles.stopButtonText}>Stop Discovery</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

    </SafeAreaView>
  );
};

export default PageDiscoveryScreen;