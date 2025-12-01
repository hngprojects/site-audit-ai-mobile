import IssueCard from '@/components/issue-card';
import { LoadingButton } from '@/components/ui/loading-button';
import { useAuth } from '@/hooks/use-auth';
import { apiClient } from '@/lib/api-client';
import { useSelectedIssuesStore } from '@/store/audit-summary-selected-issue-store';
import { useAuditInfoStore } from '@/store/audit-website-details-store';
import styles from '@/stylesheets/hire-request-stylesheet';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const RequestForm = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { issues, addIssue, clearIssues, availableIssues } = useSelectedIssuesStore();
    const { user } = useAuth();
    const { getAuditInfo } = useAuditInfoStore();
    const [additionalNotes, setAdditionalNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
    const { domain } = getAuditInfo();

    const isAllSelected = issues.length === availableIssues.length;

    const handleToggleSelect = () => {
        if (isAllSelected) {
            clearIssues();
        } else {
            availableIssues.forEach(issue => addIssue(issue));
        }
    };

    const handleSubmit = async () => {
        if (issues.length === 0) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: 'No issues selected',
            });
            return;
        }
        if (!user?.id || !jobId || !domain) {
            Alert.alert('Error', 'Missing required information');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                user_id: user.id,
                job_id: jobId,
                website: domain,
                selected_category: issues.map(issue => issue.id),
            };
            await apiClient.post('/api/v1/request-form/', payload);
            router.push('/confirmation-screen');
        } catch (error) {
            console.error('Submit error:', error);
            Alert.alert('Error', 'Failed to submit request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="#1A2373" />
                </TouchableOpacity>
                <Text style={styles.headerText}>Request Form</Text>
                <TouchableOpacity style={styles.selectButton} onPress={handleToggleSelect}>
                    <Text style={styles.selectButtonText}>{isAllSelected ? 'Deselect' : 'Select'}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                <Text style={styles.mainTitle}>
                  Confirm your review
                </Text>
                <Text style={styles.subtitle}>
                  Need professional support? Sitelytics connects you with experts who’ll review at no cost. Expect a message from a Sitelytics expert within 24 hours.
                </Text>
                <View style={styles.issuesContainer}>
                  {availableIssues.map((issue) => (
                    <IssueCard
                      key={issue.id}
                      id={issue.id}
                      title={issue.title}
                      score={issue.score}
                      description={issue.description}
                      status="Good" // Default status, IssueCard calculates based on score
                      onPressDetails={() =>
                        router.push({
                          pathname: "/[id]",
                          params: {
                            id: issue.id,
                            title: issue.title,
                            score: issue.score,
                            description: issue.description,
                            status: "Good",
                          },
                        })
                      }
                    />
                  ))}
                </View>
                <Text style={styles.additionalNotesLabel}>Additional Notes</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Tell us more about your specific need"
                  value={additionalNotes}
                  onChangeText={setAdditionalNotes}
                  multiline
                />
                <LoadingButton
                    text="Submit Request"
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