import { emailReportsService } from '@/lib/email-reports-service';
import { useAuthStore } from '@/store/auth-store';
import { useEmailReportsStore, type EmailFrequency } from '@/store/email-reports-store';
import styles from '@/stylesheets/email-reports-stylesheet';
import { useTranslation } from '@/utils/translations';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const EmailReportsContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { frequency, setFrequency } = useEmailReportsStore();
  const { token } = useAuthStore();
  const [selectedFrequency, setSelectedFrequency] = useState<EmailFrequency | null>(frequency);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      if (!token) {
        setIsLoadingSettings(false);
        return;
      }

      try {
        const settings = await emailReportsService.getEmailReportsSettings(token);
        setFrequency(settings.email_reports_frequency);
        setSelectedFrequency(settings.email_reports_frequency);
      } catch (error) {
        // If API fails, fall back to local storage
        console.warn('Failed to load email reports settings from API:', error);
        setSelectedFrequency(frequency);
      } finally {
        setIsLoadingSettings(false);
      }
    };

    loadSettings();
  }, [token, frequency, setFrequency]);

  const frequencies: { value: EmailFrequency; label: string }[] = [
    { value: 'weekly', label: t('emailReports.weekly') },
    { value: 'monthly', label: t('emailReports.monthly') },
    { value: 'quarterly', label: t('emailReports.quarterly') },
    { value: 'never', label: t('emailReports.never') },
  ];

  const handleSave = async () => {
    if (!selectedFrequency || !token) return;

    setIsSaving(true);
    try {
      await emailReportsService.updateEmailReportsSettings(selectedFrequency, token);
      setFrequency(selectedFrequency);
      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: t('emailReports.updated'),
      });
      router.back();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : t('emailReports.updateError'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingSettings) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff5a3d" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('emailReports.title')}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{t('emailReports.subtitle')}</Text>
        <Text style={styles.description}>{t('emailReports.description')}</Text>

        <View style={styles.optionsGroup}>
          {frequencies.map((frequency, index) => (
            <View key={frequency.value}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setSelectedFrequency(frequency.value)}
                disabled={isSaving}
              >
                <Text style={styles.optionText}>{frequency.label}</Text>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioButton,
                    selectedFrequency === frequency.value && styles.radioButtonSelected
                  ]}>
                    {selectedFrequency === frequency.value && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              {index < frequencies.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (selectedFrequency && !isSaving) ? styles.saveButtonActive : styles.saveButtonInactive,
            ]}
            disabled={!selectedFrequency || isSaving}
            onPress={handleSave}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={[
                styles.saveButtonText,
                (selectedFrequency && !isSaving) ? styles.saveButtonTextActive : styles.saveButtonTextInactive,
              ]}>
                {t('common.save')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function EmailReports() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <EmailReportsContent />;
}

