import { getScanResult } from '@/actions/scan-actions';
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
import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const RequestForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { issues, addIssue, clearIssues, availableIssues, setIssues } = useSelectedIssuesStore();
  const { auditInfo, getAuditInfo } = useAuditInfoStore();
  const { user } = useAuthStore();
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get job_id from route params
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId || '';

  // Get website from audit info store
  const website = auditInfo?.domain || getAuditInfo()?.domain || '';

  // Fetch scan result if availableIssues is empty and we have a jobId
  useEffect(() => {
    const fetchScanResult = async () => {
      // If we already have available issues, don't fetch
      if (availableIssues.length > 0 || !jobId) {
        return;
      }

      try {
        setIsLoading(true);
        const result = await getScanResult(jobId);

        // Set available issues from scan result
        setIssues(result.issues.map(issue => ({
          id: issue.id,
          title: issue.title,
          score: String(issue.score),
          status: result.status || 'Warning',
          description: issue.description,
        })));
      } catch (error) {
        console.error('Failed to fetch scan result:', error);
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: t('requestForm.loadScanError'),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScanResult();
  }, [jobId, availableIssues.length, setIssues, t]);

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
        text2: t('requestForm.noIssues'),
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

    if (!website) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('requestForm.websiteRequired'),
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
      // Map selected issues to category array (using issue IDs)
      const selectedCategories = issues.map(issue => issue.id);

      // Submit request form
      await requestFormService.submitRequestForm({
        user_id: user.id,
        job_id: jobId,
        website: website,
        selected_category: selectedCategories,
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

  // Show loading state
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
          {availableIssues.map((issue) => {
            // Determine status based on score
            const scoreNum = parseInt(issue.score || '0', 10);
            const issueStatus = scoreNum >= 80 ? 'Good' : scoreNum >= 50 ? 'Warning' : 'Critical';

            return (
              <IssueCard
                key={issue.id}
                id={issue.id}
                title={issue.title}
                score={issue.score || '0'}
                description={issue.description}
                status={issueStatus}
                onPressDetails={() =>
                  router.push({
                    pathname: "/[id]",
                    params: {
                      id: issue.id,
                      title: issue.title,
                      score: issue.score || '0',
                      description: issue.description,
                      status: issueStatus,
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
    </SafeAreaView>
  );
};

export default RequestForm;
