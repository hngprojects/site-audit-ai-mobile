import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, ScrollView, Text, View, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LANGUAGES } from '@/constants/language';
import styles from '@/stylesheets/language-screen-stylesheet';

const LanguageContent = () => {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Language</Text>
      </View>
      <ScrollView contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}>
        <Text style={styles.title}>Select your preferred language</Text>
        {LANGUAGES.map((language) => (
          <TouchableOpacity
            key={language}
            style={styles.languageItem}
            onPress={() => setSelectedLanguage(language)}
          >
            <Text style={styles.languageText}>
              {language}
            </Text>
            {selectedLanguage === language && (
              <Feather name="check" size={20} color="#FF5A3D" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.button,
          selectedLanguage ? styles.buttonActive : styles.buttonInactive,
        ]}
        disabled={!selectedLanguage}
        onPress={() => {
          Alert.alert('Success', 'Language has been changed successfully');
          router.back();
        }}
      >
        <Text
          style={[
            styles.buttonText,
            selectedLanguage ? styles.buttonTextActive : styles.buttonTextInactive,
          ]}
        >
          {selectedLanguage ? 'Continue' : 'Apply'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default function Language() {
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

  return <LanguageContent />;
}

