import { getScanStatus, startScan } from '@/actions/scan-actions';
import { useAuditStore } from '@/store/website-domain';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import { useTranslation } from '@/utils/translations';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const AuditingScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
  const url = Array.isArray(params.url) ? params.url[0] : params.url;
  const fromReports = params.fromReports === 'true';

  const { setDomain } = useAuditStore();

  const websiteUrl = url || '';
  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<string>('queued');
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Scanning checklist items with appropriate icons
  const scanSteps = [
    { text: t('auditing.analyzing'), icon: 'search', iconSet: 'FontAwesome' as const },
    { text: t('auditing.scanningContent'), icon: 'description', iconSet: 'MaterialIcons' as const },
    { text: t('auditing.checkingSpeed'), icon: 'speed', iconSet: 'MaterialIcons' as const },
    { text: t('auditing.findingLinks'), icon: 'link', iconSet: 'FontAwesome' as const }
  ];

  useEffect(() => {
    setDomain(websiteUrl)
    // If we have a jobId, poll for existing scan status
    if (jobId) {
      let statusInterval: NodeJS.Timeout;

      const pollStatus = async () => {
        try {
          const statusResponse = await getScanStatus(jobId);
          setScanStatus(statusResponse.status);
          setProgress(statusResponse.progress_percent);

          // Update completed steps based on real progress from API
          const stepProgress = (statusResponse.progress_percent / 100) * scanSteps.length;
          setCompletedSteps(Math.floor(stepProgress));

          if (statusResponse.status === 'completed') {
            setProgress(100); // Ensure progress shows 100% on completion
            setCompletedSteps(scanSteps.length); // Mark all steps complete
            clearInterval(statusInterval);

            // Small delay to show completion before navigation
            setTimeout(() => {
              router.replace({
                pathname: "../(reports)/report-dashboard",
                params: {
                  jobId,
                  url: websiteUrl,
                },
              });
            }, 1000);
          } else if (statusResponse.status === 'failed') {
            clearInterval(statusInterval);

            // Redirect to error screen when scan fails
            setTimeout(() => {
              router.replace({
                pathname: "/(main)/auditing-error-screen",
                params: {
                  url: websiteUrl,
                  jobId,
                },
              });
            }, 1000);
          }
        } catch (error) {
          console.error('Failed to poll scan status:', error);
        }
      };

      // Poll status immediately and then every 15 seconds
      pollStatus();
      statusInterval = Number(setInterval(pollStatus, 15000));

      return () => {
        clearInterval(statusInterval);
      };
    }
    // If we have a URL but no jobId (re-run scenario), start a new scan
    else if (websiteUrl && params.isReRun === 'true') {
      const startNewScan = async () => {
        try {
          const scanResponse = await startScan(websiteUrl);
          // Navigate to same screen with the new jobId to start polling
          router.replace({
            pathname: '/(main)/auditing-screen',
            params: {
              url: websiteUrl,
              jobId: scanResponse.job_id,
            },
          });
        } catch (error) {
          console.error('Failed to start re-run scan:', error);
        }
      };

      startNewScan();
    }
  }, [jobId, router, websiteUrl, params.isReRun, scanSteps.length, setDomain]);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  const progressBarWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {fromReports ? t('auditing.reScanning') : t('auditing.scanning')}
          </Text>
          <Text style={styles.headerUrl}>{websiteUrl}</Text>
          {fromReports && (
            <Text style={styles.reScanNote}>{t('auditing.reScanNote')}</Text>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff5a3d" style={{ transform: [{ scale: 2 }] }} />
          </View>
          <View style={styles.progress}>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: progressBarWidth },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>

          {/* Scanning Checklist */}
          <View style={styles.checklistContainer}>
            {scanSteps.map((step, index) => {
              const isCompleted = index < completedSteps;
              const IconComponent = step.iconSet === 'MaterialIcons' ? MaterialIcons : FontAwesome;

              return (
                <View key={index} style={styles.checklistItem}>
                  {isCompleted ? (
                    <FontAwesome
                      name="check"
                      size={16}
                      color="#58A279"
                      style={styles.checklistIcon}
                    />
                  ) : (
                    <IconComponent
                      name={step.icon as any}
                      size={16}
                      color="#B9B9B9"
                      style={styles.checklistIcon}
                    />
                  )}
                  <Text style={[
                    styles.checklistText,
                    { color: isCompleted ? "#58A279" : "#B9B9B9" }
                  ]}>
                    {step.text}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t('auditing.status')}: {scanStatus}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AuditingScreen