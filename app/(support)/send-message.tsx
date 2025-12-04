import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/utils/translations';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheets/send-message-stylesheet';

const SendMessageContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');

  // Update email when user data changes
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
  }, [user?.email]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSend = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    let hasError = false;

    if (!trimmedName) {
      setNameError(t('sendMessage.nameRequired'));
      hasError = true;
    } else {
      setNameError('');
    }

    if (!trimmedEmail) {
      setEmailError(t('sendMessage.emailRequired'));
      hasError = true;
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError(t('sendMessage.invalidEmail'));
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!trimmedMessage) {
      setMessageError(t('sendMessage.messageRequired'));
      hasError = true;
    } else {
      setMessageError('');
    }

    if (hasError) {
      return;
    }

    router.push('/(support)/message-sent-confirmation');
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
          <Text style={styles.headerText}>{t('sendMessage.send')}</Text>
        </View>
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}
        >
          <View style={styles.content}>
            <Text style={styles.title}>{t('sendMessage.needHelp')}</Text>
            <Text style={styles.subtitle}>{t('sendMessage.subtitle')}</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('sendMessage.fullName')}</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={(text) => { setName(text); setNameError(''); }}
                placeholder={t('sendMessage.namePlaceholder')}
                placeholderTextColor="#999"
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('sendMessage.email')}</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={(text) => { setEmail(text); setEmailError(''); }}
                placeholder={t('sendMessage.emailPlaceholder')}
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>{t('sendMessage.message')}</Text>
              <TextInput
                style={[styles.input, styles.messageInput]}
                value={message}
                onChangeText={(text) => { setMessage(text); setMessageError(''); }}
                placeholder={t('sendMessage.helpPlaceholder')}
                placeholderTextColor="#999"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              {messageError ? <Text style={styles.errorText}>{messageError}</Text> : null}
            </View>

            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>{t('sendMessage.send')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default function SendMessage() {
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

  return <SendMessageContent />;
}
