import { getScanStatus, startScan } from '@/actions/scan-actions';
import WaveCircle from '@/components/animated-wave-circle';
import ScanStepItem from '@/components/scan-step-item';
import { useAuditStore } from '@/store/website-domain';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import { useTranslation } from '@/utils/translations';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
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


  const scanSteps = [
    { text: t('auditing.analyzing'), icon: 'search', iconSet: 'FontAwesome' as const },
    { text: t('auditing.scanningContent'), icon: 'description', iconSet: 'MaterialIcons' as const },
    { text: t('auditing.checkingSpeed'), icon: 'speed', iconSet: 'MaterialIcons' as const },
    { text: t('auditing.findingLinks'), icon: 'link', iconSet: 'FontAwesome' as const }
  ];

  useEffect(() => {
    setDomain(websiteUrl);

    if (jobId) {
      let statusInterval: NodeJS.Timeout;

      const pollStatus = async () => {
        try {
          const statusResponse = await getScanStatus(jobId);
          setScanStatus(statusResponse.status);
          setProgress(statusResponse.progress_percent);

          const stepProgress = (statusResponse.progress_percent / 100) * scanSteps.length;
          setCompletedSteps(Math.floor(stepProgress));

          if (statusResponse.status === 'completed') {
            setProgress(100);
            setCompletedSteps(scanSteps.length);
            clearInterval(statusInterval);

            setTimeout(() => {
              router.replace({
                pathname: "../(reports)/report-dashboard",
                params: { jobId, url: websiteUrl },
              });
            }, 1000);
          }

          else if (statusResponse.status === 'failed') {
            clearInterval(statusInterval);

            setTimeout(() => {
              router.replace({
                pathname: "/(main)/auditing-error-screen",
                params: { url: websiteUrl, jobId },
              });
            }, 1000);
          }
        } catch (error) {
          console.error('Failed to poll scan status:', error);
        }
      };

      pollStatus();
      statusInterval = Number(setInterval(pollStatus, 15000));

      return () => clearInterval(statusInterval);
    }

    else if (websiteUrl && params.isReRun === 'true') {
      const startNewScan = async () => {
        try {
          const scanResponse = await startScan(websiteUrl);
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




 // TEMPORARY SIMULATION (keep as is)
  useEffect(() => {
    if (jobId) return;

    let step = 0;

    const simulate = () => {
      if (step < scanSteps.length) {
          step++;
          setCompletedSteps(step);
        }
        setTimeout(simulate, 2500);
    };

    setTimeout(simulate, 1200);

    return () => {};
  }, [jobId]);

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
          {completedSteps >= 2 && (
            <View style={styles.glowCircle} />
          )}

          <WaveCircle
            size={120}
            completedSteps={completedSteps}
            totalSteps={scanSteps.length}
          />

          <View style={{ marginBottom: 40 }} />

          <View>
            <Text style={styles.hangTight}>Hang tight, it takes about 30-60 seconds</Text>
          </View>

          <View style={styles.checklistContainer}>
            {scanSteps.slice(0, completedSteps).map((step, index) => (
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
