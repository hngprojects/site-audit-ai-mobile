import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import styles from '@/Stylesheets/privacy-stylesheet';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Using a common icon library

// Helper component for each section to keep the code clean
const PolicySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.sectionContainer}>
    <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    <ThemedText style={styles.sectionBody}>{children}</ThemedText>
  </View>
);

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1C" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Privacy Policy</ThemedText>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <ThemedText style={styles.dateText}>
          Last updated: October 26, 2023
        </ThemedText>

        <PolicySection title="1. Information We Collect">
          We collect: Your name, email, and website URL when you use the app or
          request a fix. Basic device and usage data to improve performance.
          Public website data for analysis only — we don’t store or modify it.
        </PolicySection>

        <PolicySection title="2. How We Use Your Information">
          We use your data to: Analyze your website and provide AI-generated
          tips. Respond to fix requests and improve our services. Communicate
          updates or reports when needed. We never sell your information.
        </PolicySection>

        <PolicySection title="3. Data Sharing">
          We only share data with: Our tech or HNG experts who help fix
          reported issues. Service providers who support app operations. All
          partners follow strict confidentiality rules.
        </PolicySection>

        <PolicySection title="4. Data Protection">
          Your data is stored securely and accessed only by authorized staff.
          While we use strong security measures, no system is 100% risk-free.
        </PolicySection>

        <PolicySection title="5. Your Rights">
          You can request to access, edit, or delete your data anytime. Email us
          at privacy@sitelytics.ai for assistance.
        </PolicySection>

        <PolicySection title="6. Updates to this Policy">
          We may update this policy as the app evolves. Any major changes will
          be shared in the app. {'\n\n'}
          Contact: {'\n'}
          privacy@sitelytics.ai {'\n'}
          www.sitelytics.ai
        </PolicySection>
      </ScrollView>
    </SafeAreaView>
  );
}
