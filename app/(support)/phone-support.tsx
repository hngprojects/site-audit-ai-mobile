import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, ScrollView, Text, View, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../../stylesheets/phone-support-stylesheet';

const PhoneSupportContent = () => {
  const router = useRouter();

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Phone Support</Text>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}
      >
        <View style={styles.content}>
          

          <View style={styles.section}>
            <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Support Line</Text>
            <Text style={styles.status}>Open Now</Text></View>
            
            <Text style={styles.phoneNumber}>+1 (800) 123-4567</Text>
            <TouchableOpacity style={styles.callButton} onPress={() => handleCall('+18001234567')}>
              <Text style={styles.callButtonText}>Call Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sales Inquiries</Text>
            <Text style={styles.phoneNumber}>+1 (800) 243-4430</Text>
            <TouchableOpacity style={styles.callButtonSecondary} onPress={() => handleCall('+18002434430')}>
              <Text style={styles.callButtonTextSecondary}>Call Now</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionHours}>
            <Text style={styles.sectionTitleHours}>Support Hours</Text>
            <Text style={styles.hoursText}>
              Monday - Friday: 9:00 AM - 6:00 PM EST{'\n'}
              Saturday - Sunday: 10:00 AM - 4:00 PM EST
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function PhoneSupport() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <PhoneSupportContent />;
}