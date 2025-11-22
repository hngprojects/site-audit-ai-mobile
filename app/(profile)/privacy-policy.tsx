import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView , TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { PRIVACY_POLICY_DATA } from '@/constants/privacy-policy';
import styles from '@/stylesheets/privacy-policy-stylesheet';

const PrivacyPolicyContent = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Privacy Policy</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.lastUpdatedText}>Last updated: {PRIVACY_POLICY_DATA.lastUpdated}</Text>

          {PRIVACY_POLICY_DATA.sections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionHeader}>{sectionIndex + 1}. {section.header}</Text>
              {section.listHeader && (
                <Text style={styles.listHeader}>{section.listHeader}</Text>
              )}
              <View style={styles.bulletList}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    {section.header === "Your Rights" && item.includes("privacy@sitelytics.ai") ? (
                      <Text style={styles.bulletText}>
                        {item.split("privacy@sitelytics.ai")[0]}
                        <Text style={styles.emailHighlight}>privacy@sitelytics.ai</Text>
                        {item.split("privacy@sitelytics.ai")[1]}
                      </Text>
                    ) : (
                      <Text style={styles.bulletText}>{item}</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.contactSection}>
            <Text style={styles.contactHeader}>Contact:</Text>
            <Text style={styles.contactText}>{PRIVACY_POLICY_DATA.contact.email}</Text>
            <Text style={styles.contactText}>{PRIVACY_POLICY_DATA.contact.website}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function PrivacyPolicy() {
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
        <Text>Loading...</Text>
      </View>
    );
  }

  return <PrivacyPolicyContent />;
}