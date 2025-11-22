import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CONTACT_SUPPORT_DATA } from '@/constants/contact-support';
import styles from '@/stylesheets/contact-support-stylesheet';

const getIconName = (title: string) => {
  switch (title) {
    case 'Live Chat':
      return 'message-circle';
    case 'Email Support':
      return 'mail';
    case 'Phone Support':
      return 'phone';
    case 'Send a Message':
      return 'send';
    default:
      return 'help-circle';
  }
};

const ContactSupportContent = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Contact Support</Text>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}
      >
        <View style={styles.content}>
          <Text style={styles.title}>How can we help?</Text>
          {CONTACT_SUPPORT_DATA.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.supportItem}
              onPress={() => {
                if (item.title === 'Live Chat') {
                  router.push('/(support)/live-chat-support');
                } else if (item.title === 'Email Support') {
                  router.push('/(support)/email-support');
                } else if (item.title === 'Phone Support') {
                  router.push('/(support)/phone-support');
                } else if (item.title === 'Send a Message') {
                  router.push('/(support)/send-message');
                }
              }}
            >
              <View style={styles.supportItemLeft}>
                <Feather name={getIconName(item.title)} size={24} color="#1A2373" />
                <View style={styles.supportTextContainer}>
                  <Text style={styles.supportTitle}>{item.title}</Text>
                  <Text style={styles.supportDescription}>{item.description}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color="#1A2373" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function ContactSupport() {
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

  return <ContactSupportContent />;
}
