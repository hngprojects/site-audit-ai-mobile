import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { reportDashboardProps } from '@/type';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import styles from '../../Stylesheets/report-dashboard-stylesheet';





const ReportDashboardContent = ({ domain, score, status, scanDate }: reportDashboardProps) => (
  <ThemedView style={styles.container}>
    <ThemedText type="title">Report Dashboard</ThemedText>
    <ThemedText>This is the report dashboard placeholder.</ThemedText>
    <ThemedText>{domain}</ThemedText>
    <ThemedText>{score}</ThemedText>
    <ThemedText>{status}</ThemedText>
    <ThemedText>{scanDate}</ThemedText>
  </ThemedView>
);

export default function ReportDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);

  
const params = useLocalSearchParams();

const {domain, score, status, scanDate} = params;



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

 return (
  <ReportDashboardContent
    domain={domain as string}
    score={score as string}
    status={status as string}
    scanDate={scanDate as string}
  />
);}