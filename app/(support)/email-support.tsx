import { supportService } from '@/lib/support-service';
import styles from '@/stylesheets/email-support-stylesheet';
import { useTranslation } from '@/utils/translations';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const EmailSupportContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState('user@gmail.com');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = async () => {
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('emailSupport.emailRequired'),
      });
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('emailSupport.invalidEmail'),
      });
      return;
    }

    if (!trimmedSubject) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('emailSupport.subjectRequired'),
      });
      return;
    }

    if (!trimmedMessage) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('emailSupport.messageRequired'),
      });
      return;
    }

    setIsLoading(true);
    try {
      await supportService.sendEmail({
        email: trimmedEmail,
        subject: trimmedSubject,
        message: trimmedMessage,
      });
      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: t('emailSupport.sentSuccess'),
      });
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : t('emailSupport.sendError'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t('emailSupport.title')}</Text>
        </View>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}
        >
        <View style={styles.content}>
          {/* <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>Send us an email and we will respond within 24 hours</Text> */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('emailSupport.yourEmail')}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t('emailSupport.emailPlaceholder')}
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('emailSupport.subject')}</Text>
            <TextInput
              style={styles.input}
              value={subject}
              onChangeText={setSubject}
              placeholder={t('emailSupport.subjectPlaceholder')}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>{t('emailSupport.message')}</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={message}
              onChangeText={setMessage}
              placeholder={t('emailSupport.messagePlaceholder')}
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.sendButtonText}>{t('emailSupport.sendMessage')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default function EmailSupport() {
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

  return <EmailSupportContent />;
}
