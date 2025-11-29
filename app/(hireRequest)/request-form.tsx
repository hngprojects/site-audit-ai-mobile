import styles from '@/stylesheets/hire-request-stylesheet';
import IssueCard from '@/components/issue-card';
import { useSelectedIssuesStore } from '@/store/audit-summary-selected-issue-store';
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
              text1: 'Error',
              text2: 'No issues selected',
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
                <Text style={styles.additionalNotesLabel}>Additional Notes</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Tell us more about your specific need"
                  value={additionalNotes}
                  onChangeText={setAdditionalNotes}
                  multiline
                />
                <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
                    <Text style={styles.primaryButtonText}>Submit Request</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default RequestForm;