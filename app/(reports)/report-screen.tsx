import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import styles from '@/stylesheets/report-screen-stylesheet';
import { useTranslation } from '@/utils/translations';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

const ReportScreenContent = () => {
  const { t } = useTranslation();
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{t('reportScreen.title')}</ThemedText>
      <ThemedText>{t('reportScreen.placeholder')}</ThemedText>
    </ThemedView>
  );
};

export default function ReportScreen() {
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

  return <ReportScreenContent />;
}

