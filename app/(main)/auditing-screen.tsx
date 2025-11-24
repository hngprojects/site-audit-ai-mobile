import { useAuditInfoStore } from '@/store/audit-website-details-store';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
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



  useEffect(() => {
  const timer = setTimeout(() => {
    
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
  }, 5000);

  return () => clearTimeout(timer); 
}, [router,domain,status,score,scanDate,]);


  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={{
            fontFamily: "RethinkSans-Bold",
            fontSize: 30,
            color: "#000"
          }}>
            Scanning Website...
          </Text>
          <Text style={{
            fontFamily: "RethinkSans-SemiBold",
            fontSize: 14,
            marginTop: 11,
            color: "#000"
          }}>
            {domain}
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ff5a3d" />
        </View>
        <View style={styles.content}>
          {/* <Image source={require('@/assets/images/auditing-screen-image.png')} style={styles.image} /> */}
          <Text style={{
            color: "#000",
            fontFamily: "RethinkSans-Medium",
            fontSize: 14
          }}>
            Hang tight, Takes about 30&ndash;60 seconds
          </Text>
          <View style={styles.progress}>
            {/* implement progress bar here */}
            <Text>0%</Text>
          </View>
          <View style={styles.footer}>
            {/* implement process messages hers */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default AuditingScreen