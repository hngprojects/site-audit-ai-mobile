import WaveCircle from '@/components/animated-wave-circle';
import ScanStepItem from '@/components/scan-step-item';
import { useScanStore } from '@/store/useScanStore';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import { useTranslation } from '@/utils/translations';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const eventOrder = [
  "scan_started",
  "loading_page",
  "extracting_content",
  "performance_analysis",
] as const;

const AuditingScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();

  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
  const url = Array.isArray(params.url) ? params.url[0] : params.url;

  const {
    progress,
    currentEvent,
    isCompleted,
  } = useScanStore();

  const scanSteps = [
    { text: t('auditing.analyzing'), icon: 'search', iconSet: 'FontAwesome' as const },
    { text: t('auditing.scanningContent'), icon: 'description', iconSet: 'MaterialIcons' as const },
    { text: t('auditing.checkingSpeed'), icon: 'speed', iconSet: 'MaterialIcons' as const },
    { text: t('auditing.findingLinks'), icon: 'link', iconSet: 'FontAwesome' as const },
  ];

  // Convert currentEvent to completed steps count
  const completedSteps = useMemo(() => {
    if (!currentEvent) return 0;

    const index = eventOrder.indexOf(currentEvent as any);
    if (index === -1) return 0;
    return index + 1;
  }, [currentEvent]);

  // Navigate to summary screen once finished
  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        router.replace({
          pathname: "/(reports)/report-dashboard",
          params: { jobId, url },
        });
      }, 1200);
    }
  }, [isCompleted]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>

        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t("auditing.scanning")}</Text>
          <Text style={styles.headerUrl}>{url}</Text>
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
