import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import styles from '@/Stylesheets/terms-and-conditions-stylesheet';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Helper component for each section to keep the code clean
const PolicySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.sectionContainer}>
    <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
    <ThemedText style={styles.sectionBody}>{children}</ThemedText>
  </View>
);

export default function TermsAndConditionsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1C" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Terms & Conditions</ThemedText>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        <ThemedText style={styles.dateText}>
          Last updated: October 2025
        </ThemedText>

        <PolicySection title="1. Acceptance of Terms">
          By using our app, you agree to these Terms & Conditions. If you do not agree,
          please do not use the app.
        </PolicySection>

        <PolicySection title="2. About the App">
          Our app provides: Website audits, Recommendations, Fix guidance,
          Access to vetted professionals, Monitoring and email reminders.
          The app is currently free to use, but some services (such as hiring pros)
          may involve costs.
        </PolicySection>

        <PolicySection title="3. User Accounts">
          To access certain features, you may need to create an account. You agree to:
          Provide accurate information, Keep your login credentials secure, Not share your account with others.
          We may suspend accounts that violate these terms.
        </PolicySection>

        <PolicySection title="4. Use of the App">
          You agree not to: Misuse the platform, Upload harmful content,
          Attempt to access another user’s data, Reverse-engineer or disrupt the app.
        </PolicySection>

        <PolicySection title="5. Website Audits & Recommendations">
          Our audits are generated based on automated tools and best-practice standards.
          We do not guarantee: That your website will reach a certain score,
          That fixes will lead to specific business results, That insights are error-free.
          You use the information at your own discretion.
        </PolicySection>

        <PolicySection title="6. Hiring Pros">
          When you hire a pro through the app: You engage directly with the professional,
          We are not responsible for the pro’s work quality, timings, or outcomes,
          Payment and terms between you and the pro may be subject to additional agreements.
          We only act as a connector, not a party to the working relationship.
        </PolicySection>

        <PolicySection title="7. Intellectual Property">
          All app content, branding, UI, illustrations, and features are owned by us.
          You may not copy, reproduce, or distribute them without permission.
        </PolicySection>

        <PolicySection title="8. Limitation of Liability">
          We are not liable for: Loss of data, Business losses, Errors in audit results,
          Issues caused by third-party professionals, Any indirect or consequential damages.
          Your use of the app is at your own risk.
        </PolicySection>

        <PolicySection title="9. Termination">
          We may suspend or terminate your account if you: Break these terms,
          Abuse the platform, Violate security rules. You may stop using the app at any time.
        </PolicySection>

        <PolicySection title="10. Governing Law">
          These Terms are governed by the laws of The United States of America.
          Any disputes will be handled under those laws.
        </PolicySection>

        <PolicySection title="11. Contact">
          <ThemedText style={styles.sectionBody}>For questions, email us at: </ThemedText>
          <ThemedText style={styles.contactEmail}>privacy@sitelytics.ai</ThemedText>
        </PolicySection>
      </ScrollView>
    </SafeAreaView>
  );
}
