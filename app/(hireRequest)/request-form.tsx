import { getScanResult } from '@/actions/scan-actions';
import IssueCard from '@/components/issue-card';
import { requestFormService } from '@/lib/request-form-service';
import type { ScanResult } from '@/lib/scan-service';
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
  const { issues, addIssue, clearIssues } = useSelectedIssuesStore();
  const { auditInfo, setAuditInfo } = useAuditInfoStore();
  const { user } = useAuthStore();
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get job_id from route params
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId || '';

  // Get website from audit info store
  const website = auditInfo.domain || '';

  // Get real issues from scan result
  const ISSUE_LIST = scanResult?.issues || [];

  // Fetch scan result on mount
  useEffect(() => {
    const fetchScanResult = async () => {
      if (!jobId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await getScanResult(jobId);
        setScanResult(result);

        // Update audit info if not already set
        if (!auditInfo.domain && result.url) {
          setAuditInfo({
            domain: result.url,
            status: result.status,
            score: String(result.overall_score),
            scanDate: result.scanned_at ? new Date(result.scanned_at).toLocaleDateString() : '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch scan result:', error);
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: 'Failed to load scan results. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScanResult();
  }, [jobId, setAuditInfo]);

  const isAllSelected = issues.length === ISSUE_LIST.length && ISSUE_LIST.length > 0;

  const handleToggleSelect = () => {
    if (isAllSelected) {
      clearIssues();
    } else {
      // Add all issues from scan result
      ISSUE_LIST.forEach((issue) => {
        addIssue({
          id: issue.id,
          title: issue.title,
          score: String(issue.score),
          status: scanResult?.status || 'Warning',
          description: issue.description,
        });
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
        text2: 'Please sign in to submit a request',
      });
      return;
    }

    if (!website) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: 'Website URL is required',
      });
      return;
    }

    if (!jobId) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: 'Job ID is required',
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
        text2: 'Request submitted successfully',
      });

      // Navigate to confirmation screen
      router.push('/confirmation-screen');
    } catch (error) {
      console.error('Error submitting request form:', error);
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : 'Failed to submit request. Please try again.',
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
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 16 }}>Loading scan results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state if no issues available
  if (!ISSUE_LIST || ISSUE_LIST.length === 0) {
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
            No scan results available. Please run a scan first.
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, { marginTop: 20 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
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
          {ISSUE_LIST.map((issue) => {
            // Determine status based on score
            const issueStatus = issue.score >= 80 ? 'Good' : issue.score >= 50 ? 'Warning' : 'Critical';

            return (
              <IssueCard
                key={issue.id}
                id={issue.id}
                title={issue.title}
                score={String(issue.score)}
                description={issue.description}
                status={issueStatus}
                onPressDetails={() =>
                  router.push({
                    pathname: "/[id]",
                    params: {
                      id: issue.id,
                      title: issue.title,
                      score: String(issue.score),
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
        <TouchableOpacity
          style={[styles.primaryButton, isSubmitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryButtonText}>{t('requestForm.submitRequest')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RequestForm;