import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuditStore } from '@/store/audit-store';
import styles from '@/stylesheets/report-dashboard-stylesheet';
import { reportDashboardProps } from '@/type';
import { router } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';





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
  const auditResult = useAuditStore((state) => state.auditResult);

  useEffect(() => {
    if (!auditResult) {
      router.replace('/(tabs)/' as any);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [auditResult]);

  if (!auditResult || !isLoaded) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ReportDashboardContent
      domain={auditResult.domain}
      score={String(auditResult.score)}
      status={auditResult.status}
      scanDate={auditResult.scanDate}
    />
  );
}