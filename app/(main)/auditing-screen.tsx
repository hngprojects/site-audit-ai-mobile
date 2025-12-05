import WaveCircle from '@/components/animated-wave-circle';
import ScanStepItem from '@/components/scan-step-item';
import { useScanStore } from '@/store/useScanStore';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import { useTranslation } from '@/utils/translations';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuditingScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();

  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
  const url = Array.isArray(params.url) ? params.url[0] : params.url;

  const {
    jobId: storeJobId,
    url: storeUrl,
    currentEvent,
    isCompleted,
  } = useScanStore();

  // Use store values if available, fallback to params
  const finalJobId = storeJobId || jobId;
  const finalUrl = storeUrl || url;

  const scanSteps = [
    { text: t('auditing.analyzing'), icon: 'search', iconSet: 'FontAwesome' as const },
    { text: t('auditing.scanningContent'), icon: 'description', iconSet: 'MaterialIcons' as const },
    { text: t('auditing.checkingSpeed'), icon: 'speed', iconSet: 'MaterialIcons' as const },
    { text: t('auditing.findingLinks'), icon: 'link', iconSet: 'FontAwesome' as const },
  ];

  // Map events to steps
  const eventToStepMap = useMemo<Record<string, number>>(() => ({
    scan_started: 1,
    loading_page: 1,
    extracting_content: 2,
    performance_check: 3,
    seo_check: 3,
    accessibility_check: 3,
    performance_analysis: 3,
    scan_complete: 4,
  }), []);

  // Convert currentEvent to completed steps count
  const completedSteps = useMemo(() => {
    if (isCompleted) return scanSteps.length;
    if (!currentEvent) return 0;

    const step = eventToStepMap[currentEvent] || 0;
    return step;
  }, [currentEvent, isCompleted, scanSteps.length, eventToStepMap]);

  // Navigate to error screen if scan error occurs
  useEffect(() => {
    if (currentEvent === 'scan_error' || currentEvent === 'scan_failed') {
      console.log('[AuditingScreen] Scan error detected, navigating to error screen');
      router.replace({
        pathname: "/(main)/auditing-error-screen",
        params: {
          url: finalUrl || '',
          jobId: finalJobId || '',
        },
      });
    }
  }, [currentEvent, finalJobId, finalUrl, router]);

  // Navigate to summary screen once finished
  useEffect(() => {
    if (isCompleted && finalJobId && finalUrl) {
      const timeout = setTimeout(() => {
        router.replace({
          pathname: "/(reports)/report-dashboard",
          params: { jobId: finalJobId, url: finalUrl },
        });
      }, 1200);

      return () => clearTimeout(timeout);
    }
  }, [isCompleted, finalJobId, finalUrl, router]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("auditing.scanning")}</Text>
          <Text style={styles.headerUrl}>{finalUrl}</Text>
        </View>

        <View style={styles.content}>
          {completedSteps >= 2 && <View style={styles.glowCircle} />}

          {/* Wave animation */}
          <WaveCircle
            size={120}
            completedSteps={completedSteps}
            totalSteps={scanSteps.length}
          />

          <View style={{ marginBottom: 40 }} />

          <Text style={styles.hangTight}>{t("auditing.hangTight")}</Text>

          <View style={styles.checklistContainer}>
            {scanSteps.map((step, index) => (
              <ScanStepItem
                key={index}
                text={step.text}
                index={index}
                active={index < completedSteps}
              />
            ))}
          </View>
        </View>
      </View>

    </SafeAreaView>
  );
};

export default AuditingScreen;
