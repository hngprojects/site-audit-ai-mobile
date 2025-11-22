
import { useAuditStore } from '@/store/audit-store';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import type { Status } from '@/type';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuditingScreen = () => {
  const { currentAudit, updateProgress, setAuditResult, clearCurrentAudit } = useAuditStore();
  const websiteUrl = currentAudit?.url || '';
  const progress = currentAudit?.progress || 0;
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!currentAudit) {
      router.replace('/(tabs)/' as any);
      return;
    }

    let currentProgress = currentAudit.progress;

    const interval = setInterval(() => {
      const increment = Math.random() * 5 + 1;
      currentProgress = Math.min(currentProgress + increment, 100);
      updateProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [currentAudit, updateProgress]);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

  useEffect(() => {
    if (progress >= 100 && currentAudit) {
      const generateScore = () => Math.floor(Math.random() * 60) + 40;
      const score = generateScore();
      const status: Status = score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low';
      const scanDate = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const domain = websiteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '');
      
      setAuditResult({
        domain,
        score,
        status,
        scanDate,
      });

      clearCurrentAudit();

      setTimeout(() => {
        router.replace({
          pathname: '/(reports)/report-dashboard',
        } as any);
      }, 500);
    }
  }, [progress, currentAudit, websiteUrl, setAuditResult, clearCurrentAudit]);

  const progressBarWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Scanning Website...</Text>
          <Text style={styles.headerUrl}>{websiteUrl}</Text>
        </View>
        <View style={styles.loadingContainer}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#ff5a3d" />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentText}>Hang tight, Takes about 30–60 seconds</Text>
          <View style={styles.progress}>
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: progressBarWidth },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Process messages here</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AuditingScreen