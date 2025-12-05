import { startScan } from "@/actions/scan-actions";
import type { ScanEvent } from "@/store/useScanStore";
import { useScanStore } from "@/store/useScanStore";
import styles from "@/stylesheets/auditing-error-screen-stylesheet";
import { useTranslation } from '@/utils/translations';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


export default function WebsiteDown() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const url = Array.isArray(params.url) ? params.url[0] : params.url;
  const [isRetrying, setIsRetrying] = useState(false);

  const onTryAgain = async () => {
    if (!url || isRetrying) return;

    setIsRetrying(true);

    try {
      useScanStore.getState().reset();

      let hasNavigated = false;

      const scanResponse = await startScan(
        url,
        (event, data) => {
          if (event === 'scan_error' || event === 'scan_failed') {
            const errorJobId = data.job_id || useScanStore.getState().jobId;
            setIsRetrying(false);

            router.replace({
              pathname: "/(main)/auditing-error-screen",
              params: {
                url: url,
                jobId: errorJobId || '',
              },
            });
            return;
          }

          try {
            useScanStore.getState().updateFromEvent(event as ScanEvent, data);
          } catch (error) {
            console.error('[AuditingErrorScreen] Error updating store:', error);
          }

          if (data.job_id && !useScanStore.getState().jobId) {
            useScanStore.getState().setInitial(data.job_id, url);

            if (!hasNavigated) {
              hasNavigated = true;
              setIsRetrying(false);

              router.replace({
                pathname: "/(main)/auditing-screen",
                params: {
                  url: url,
                  jobId: data.job_id,
                },
              });
            }
          }
        }
      );

      if (!hasNavigated && scanResponse.job_id) {
        if (!useScanStore.getState().jobId) {
          useScanStore.getState().setInitial(scanResponse.job_id, url);
        }

        setIsRetrying(false);

        router.replace({
          pathname: "/(main)/auditing-screen",
          params: {
            url: url,
            jobId: scanResponse.job_id,
          },
        });
      }
    } catch (error) {
      setIsRetrying(false);
      console.error('[AuditingErrorScreen] Failed to retry scan:', error);
    }
  };

  return (
    <View
      style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <View style={styles.container}>
        <View style={styles.topSpacer} />

        <View style={styles.iconWrap}>
          <MaterialIcons
            name="link-off"
            size={64}
            color="#d32f2f"
          />
        </View>

        <Text style={styles.title}>{t('auditingError.title')}</Text>

        <Text style={styles.bodyPrimary}>
          {t('auditingError.description')}
        </Text>

        {/* <Text style={styles.bodyHighlight}>But don&apos;t worry, we can help you.</Text> */}

        <Text style={styles.bodySecondary}>
          {t('auditingError.verifyUrl')}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.tryAgainButton}
          onPress={onTryAgain}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.tryAgainButtonText}>{t('auditingError.tryAgain')}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}