import styles from "@/stylesheets/auditing-error-screen-stylesheet";
import { useTranslation } from '@/utils/translations';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
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
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;

  const onTryAgain = () => {
    // Navigate back to auditing screen to retry the scan
    router.replace({
      pathname: '/(main)/auditing-screen',
      params: {
        url: url || '',
        jobId: jobId || '',
        isReRun: 'true',
      },
    });
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
        >
          <Text style={styles.tryAgainButtonText}>{t('auditingError.tryAgain')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}