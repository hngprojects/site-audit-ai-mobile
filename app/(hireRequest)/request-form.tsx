import styles from '@/stylesheets/hire-request-stylesheet';
import IssueCard from '@/components/issue-card';
import { useSelectedIssuesStore } from '@/store/audit-summary-selected-issue-store';
import { useTranslation } from '@/utils/translations';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const ISSUE_LIST = [
    {
        id: "Loading-speed",
        title: "Loading speed",
        score: String(Math.floor(Math.random() * 71) + 30),
        description:
            "Your website takes longer than average to load, which can affect user experience and SEO.",
    },
    {
        id: "Mobile-friendly",
        title: "Mobile Friendly",
        score: String(Math.floor(Math.random() * 71) + 30),
        description:
            "Your website takes longer than average to load, which can affect user experience and SEO.",
    },
    {
        id: "Visibility",
        title: "Visibility",
        score: String(Math.floor(Math.random() * 71) + 30),
        description:
            "Your website takes longer than average to load, which can affect user experience and SEO.",
    },
];

const RequestForm = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { issues, addIssue, clearIssues } = useSelectedIssuesStore();
    const [additionalNotes, setAdditionalNotes] = useState('');

    const isAllSelected = issues.length === ISSUE_LIST.length;

    const handleToggleSelect = () => {
        if (isAllSelected) {
            clearIssues();
        } else {
            ISSUE_LIST.forEach(issue => addIssue(issue));
        }
    };

    const handleSubmit = () => {
        if (issues.length === 0) {
            Toast.show({
              type: 'error',
              text1: t('common.error'),
              text2: t('requestForm.noIssues'),
            });
            return;
        }
        // Handle form submission with issues and additionalNotes
        router.push('/confirmation-screen');
    };

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
                  {ISSUE_LIST.map((issue) => (
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
                <Text style={styles.additionalNotesLabel}>{t('requestForm.additionalNotes')}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={t('requestForm.placeholder')}
                  value={additionalNotes}
                  onChangeText={setAdditionalNotes}
                  multiline
                />
                <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                    <Text style={styles.primaryButtonText}>{t('requestForm.submitRequest')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RequestForm;