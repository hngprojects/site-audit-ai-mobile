
import styles from '@/stylesheets/auditing-screen-stylesheet';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuditingScreen = () => {
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