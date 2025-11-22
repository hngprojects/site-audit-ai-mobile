import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, ScrollView, Text, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '../../stylesheets/send-message-stylesheet';

const SendMessageContent = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('user@gmail.com');
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');

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
      setNameError('Please enter your full name');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!trimmedEmail) {
      setEmailError('Please enter your email address');
      hasError = true;
    } else if (!isValidEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!trimmedMessage) {
      setMessageError('Please enter your message');
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Send Message</Text>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Need Help?</Text>
          <Text style={styles.subtitle}>We&lsquo;d love to hear from you. Send us a message and we&lsquo;ll respond within 24 hours.</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => { setName(text); setNameError(''); }}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => { setEmail(text); setEmailError(''); }}
              placeholder="user@gmail.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.messageInput]}
              value={message}
              onChangeText={(text) => { setMessage(text); setMessageError(''); }}
              placeholder="How can we help you?"
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {messageError ? <Text style={styles.errorText}>{messageError}</Text> : null}
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendButtonText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
