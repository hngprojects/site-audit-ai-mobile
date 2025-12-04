import { getScanSummary } from '@/actions/scan-actions';
import IssueCard from '@/components/issue-card';
import { LoadingButton } from '@/components/ui/loading-button';
import { requestFormService } from '@/lib/request-form-service';
import { useSelectedIssuesStore } from '@/store/audit-summary-selected-issue-store';
import { useAuditInfoStore } from '@/store/audit-website-details-store';
import { useAuthStore } from '@/store/auth-store';
import styles from '@/stylesheets/hire-request-stylesheet';
import { useTranslation } from '@/utils/translations';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const RequestForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { issues, addIssue, clearIssues, availableIssues, setIssues, fullIssuesData } = useSelectedIssuesStore();
  const { auditInfo, getAuditInfo } = useAuditInfoStore();
  const { user } = useAuthStore();
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get job_id from route params
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId || '';


  // Load categories from store if available, otherwise fetch
  useEffect(() => {
    const loadCategories = async () => {
      // If we already have available issues, don't fetch
      if (availableIssues.length > 0 || !jobId) {
        return;
      }

      // Check if we have full issues data in store
      if (fullIssuesData && fullIssuesData.categories) {
        // Convert categories to issues format for selection
        const categoriesFromStore = fullIssuesData.categories.map(category => ({
          id: category.key, // Use category key as ID
          title: category.title,
          score: String(category.score),
          status: category.key,
          description: category.description,
        }));
        setIssues(categoriesFromStore);
        return;
      }

      // Fallback: fetch from API
      try {
        setIsLoading(true);
        const result = await getScanSummary(jobId);

        // Convert categories to issues format for selection
        const categoriesFromApi = result.categories.map(category => ({
          id: category.key, // Use category key as ID
          title: category.title,
          score: String(category.score),
          status: category.key,
          description: category.short_description,
        }));
        setIssues(categoriesFromApi);
      } catch (error) {
        console.error('Failed to load categories:', error);
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: t('requestForm.loadScanError'),
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [jobId, availableIssues.length, setIssues, fullIssuesData, t]);

  const isAllSelected = issues.length === availableIssues.length && availableIssues.length > 0;

  const handleToggleSelect = () => {
    if (isAllSelected) {
      clearIssues();
    } else {
      // Add all issues from available issues
      availableIssues.forEach((issue) => {
        addIssue(issue);
      });
    }
  };

  const handleSubmit = async () => {
    if (issues.length === 0) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('requestForm.noCategories'),
      });
      return;
    }

    // Validate required data
    if (!user?.id) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('requestForm.pleaseSignIn'),
      });
      return;
    }

    if (!jobId) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('requestForm.jobIdRequired'),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Map selected categories to category keys
      const selectedCategories = issues.map(category => category.id);

      // Submit request form
      await requestFormService.submitRequestForm({
        user_id: user.id,
        job_id: jobId,
        issues: selectedCategories,
        additional_notes: additionalNotes,
      });

      // Show success message
      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: t('requestForm.submitSuccess'),
      });

      // Navigate to confirmation screen
      router.push('/confirmation-screen');
    } catch (error) {
      console.error('Error submitting request form:', error);
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : t('requestForm.submitError'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t('requestForm.title')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1A2373" />
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if no issues available
  if (!availableIssues || availableIssues.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t('requestForm.title')}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ textAlign: 'center', fontSize: 16, color: '#666' }}>
            {t('requestForm.noScanResults')}
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 20 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>{t('requestForm.goBack')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t('requestForm.title')}</Text>
          <TouchableOpacity style={styles.selectButton} onPress={handleToggleSelect}>
            <Text style={styles.selectButtonText}>{isAllSelected ? t('requestForm.deselect') : t('requestForm.select')}</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.mainTitle}>
          {t('requestForm.confirmReview')}
        </Text>
        <Text style={styles.subtitle}>
          {t('requestForm.subtitle')}
        </Text>
        <View style={styles.issuesContainer}>
          {availableIssues.map((category) => {
            // Determine status based on score
            const scoreNum = parseInt(category.score || '0', 10);
            const categoryStatus = scoreNum >= 80 ? 'Good' : scoreNum >= 50 ? 'Warning' : 'Critical';

            return (
              <IssueCard
                key={category.id}
                id={category.id}
                title={category.title}
                score={category.score || '0'}
                description={category.description}
                status={categoryStatus}
                onPressDetails={() =>
                  router.push({
                    pathname: "/[id]",
                    params: {
                      id: category.id,
                      jobId: jobId,
                    },
                  })
                }
              />
            );
          })}
        </View>
        <Text style={styles.additionalNotesLabel}>{t('requestForm.additionalNotes')}</Text>
        <TextInput
          style={styles.textInput}
          placeholder={t('requestForm.placeholder')}
          value={additionalNotes}
          onChangeText={setAdditionalNotes}
          multiline
        />
        <LoadingButton
          text={t('requestForm.submitRequest')}
          onPress={handleSubmit}
          loading={isSubmitting}
          buttonStyle={styles.primaryButton}
          textStyle={styles.primaryButtonText}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RequestForm;

