import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AuditingScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();



  const domain = Array.isArray(params.url) ? params.url[0] : params.url;


  //simulating random score between 30 and 100 as scan score
  const randomScore = Math.floor(Math.random() * (100 - 30 + 1)) + 30;

  //simulating scan status based on score
  const getStatusFromScore = (score: number) => {
  if (score >= 30 && score <= 50) return "low";
  if (score >= 51 && score <= 69) return "medium";
  return "high"; 
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



  useEffect(() => {
    setTimeout(() => {
      // Simulate navigation to report dashboard after scan is complete
       //router.replace('../(reports)/report-dashboard');
      router.replace({
        pathname: "../(reports)/report-dashboard",
          params: {
            domain,
            status,
            score,
            scanDate,
        },
    });

    }, 5000);
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={{ flex: 1 }}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Scanning Website...</ThemedText>
          <ThemedText>{domain}</ThemedText>
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff5a3d" />
        </ThemedView>
        <ThemedView style={styles.content}>
          {/* <Image source={require('@/assets/images/auditing-screen-image.png')} style={styles.image} /> */}
          <ThemedText>Hang tight, Takes about 30–60 seconds</ThemedText>
          <ThemedView style={styles.progress}>
            {/* implement progress bar here */}
            <ThemedText>0%</ThemedText>
          </ThemedView>
          <ThemedView style={styles.footer}>
            {/* implement process messages hers */}
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  )
}

export default AuditingScreen