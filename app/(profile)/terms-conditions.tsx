import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PRIVACY_POLICY_DATA } from '@/constants/privacy-policy';
import { TERMS_CONDITIONS_DATA } from '@/constants/terms-conditions';
import styles from '@/stylesheets/privacy-policy-stylesheet';

const PrivacyPolicyContent = () => {
  const router = useRouter();

  const handleEmailPress = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsitePress = (website: string) => {
    const url = website.startsWith('http') ? website : `https://${website}`;
    Linking.openURL(url);
  };

  const renderTextWithLinks = (text: string) => {
    // Email regex pattern
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    // URL regex pattern (matches www. or http/https)
    const urlRegex = /(www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|https?:\/\/[^\s]+)/g;

    const parts: { text: string; type: 'text' | 'email' | 'url' }[] = [];
    let lastIndex = 0;

    // Find all matches
    const matches: { index: number; length: number; type: 'email' | 'url'; value: string }[] = [];

    let match;
    while ((match = emailRegex.exec(text)) !== null) {
      matches.push({ index: match.index, length: match[0].length, type: 'email', value: match[0] });
    }

    emailRegex.lastIndex = 0; // Reset regex

    while ((match = urlRegex.exec(text)) !== null) {
      matches.push({ index: match.index, length: match[0].length, type: 'url', value: match[0] });
    }

    // Sort matches by index
    matches.sort((a, b) => a.index - b.index);

    // Build parts array
    matches.forEach((match) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push({ text: text.substring(lastIndex, match.index), type: 'text' });
      }
      // Add match
      parts.push({ text: match.value, type: match.type });
      lastIndex = match.index + match.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), type: 'text' });
    }

    // If no matches, return original text
    if (parts.length === 0) {
      parts.push({ text, type: 'text' });
    }

    return (
      <Text style={styles.bulletText}>
        {parts.map((part, index) => {
          if (part.type === 'email') {
            return (
              <Text
                key={index}
                style={styles.emailHighlight}
                onPress={() => handleEmailPress(part.text)}
              >
                {part.text}
              </Text>
            );
          } else if (part.type === 'url') {
            return (
              <Text
                key={index}
                style={styles.linkText}
                onPress={() => handleWebsitePress(part.text)}
              >
                {part.text}
              </Text>
            );
          } else {
            return <Text key={index}>{part.text}</Text>;
          }
        })}
      </Text>
    );
  };

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
          <Text style={styles.headerText}>Terms & Conditions</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.lastUpdatedText}>Last updated: {PRIVACY_POLICY_DATA.lastUpdated}</Text>

          {TERMS_CONDITIONS_DATA.sections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <Text style={styles.sectionHeader}>{sectionIndex + 1}. {section.header}</Text>
              {section.listHeader && (
                <Text style={styles.listHeader}>{section.listHeader}</Text>
              )}
              <View style={styles.bulletList}>
                {section.items?.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.bulletItem}>
                    <Text style={styles.bulletPoint}>•</Text>
                    {renderTextWithLinks(item)}
                  </View>
                ))}
              </View>
            </View>
          ))}

          <View style={styles.contactSection}>
            <Text style={styles.contactHeader}>Contact:</Text>
            <TouchableOpacity onPress={() => handleEmailPress(PRIVACY_POLICY_DATA.contact.email)}>
              <Text style={[styles.contactText, styles.contactLink]}>{PRIVACY_POLICY_DATA.contact.email}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleWebsitePress(PRIVACY_POLICY_DATA.contact.website)}>
              <Text style={[styles.contactText, styles.contactLink]}>{PRIVACY_POLICY_DATA.contact.website}</Text>
            </TouchableOpacity>
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