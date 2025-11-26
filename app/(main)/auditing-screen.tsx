import { useAuditInfoStore } from '@/store/audit-website-details-store';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const AuditingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { setAuditInfo } = useAuditInfoStore();
  const domain = Array.isArray(params.url) ? params.url[0] : params.url;
  //simulating random score between 30 and 100 as scan score
  const randomScore = Math.floor(Math.random() * (100 - 30 + 1)) + 30;

  //simulating scan status based on score
  const getStatusFromScore = (score: number) => {
    if (score >= 30 && score <= 49) return "Critical";
    if (score >= 50 && score <= 69) return "Warning";
    return "Good";
  };

  //simulating current date the scan was issued
  const getFormattedDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return now.toLocaleDateString("en-US", options);
  };


  const score = randomScore.toString();
  const status = getStatusFromScore(randomScore);

  const scanDate = getFormattedDate();

  const { url } = useLocalSearchParams<{ url: string }>();
  const websiteUrl = url || '';
  const [progress, setProgress] = useState(0);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 5 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      setAuditInfo({
        domain,
        status,
        score,
        scanDate,
      });
      router.replace({
        pathname: "../(reports)/report-dashboard",
        params: {
          domain,
          status,
          score,
          scanDate,
        },
      });
    }
  }, [progress, domain, status, score, scanDate, setAuditInfo, router]);

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress, animatedWidth]);

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