import { LANGUAGES, useLanguageStore } from '@/store/language-store';
import { useTranslation } from '@/utils/translations';
import styles from '@/stylesheets/language-screen-stylesheet';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import type { LanguageCode } from '@/store/language-store';

const LanguageContent = () => {
  const router = useRouter();
  const { selectedLanguage, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [localSelected, setLocalSelected] = useState<LanguageCode | null>(selectedLanguage);

  useEffect(() => {
    setLocalSelected(selectedLanguage);
  }, [selectedLanguage]);

  const handleLanguageSelect = (languageCode: LanguageCode) => {
    setLocalSelected(languageCode);
  };

  const handleSave = () => {
    if (localSelected) {
      setLanguage(localSelected);
      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: t('language.changed'),
      });
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{t('language.title')}</Text>
      </View>
      <ScrollView contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}>
        <Text style={styles.title}>{t('language.select')}</Text>
        {LANGUAGES.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={styles.languageItem}
            onPress={() => handleLanguageSelect(language.code)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.languageText}>
                {language.name}
              </Text>
              {language.nativeName !== language.name && (
                <Text style={[styles.languageText, { fontSize: 14, color: '#9CA3AF', marginTop: 2 }]}>
                  {language.nativeName}
                </Text>
              )}
            </View>
            {localSelected === language.code && (
              <Feather name="check" size={20} color="#FF5A3D" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[
          styles.button,
          localSelected ? styles.buttonActive : styles.buttonInactive,
        ]}
        disabled={!localSelected}
        onPress={handleSave}
      >
        <Text
          style={[
            styles.buttonText,
            localSelected ? styles.buttonTextActive : styles.buttonTextInactive,
          ]}
        >
          {localSelected ? t('common.continue') : t('common.apply')}
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

