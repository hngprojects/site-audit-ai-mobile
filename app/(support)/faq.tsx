import { Collapsible } from '@/components/ui/collapsible';
import { FAQ_DATA } from '@/constants/faq';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../Stylesheets/faq-stylesheet';

const FAQContent = () => {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number>(-1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <Text style={styles.headerText}>FAQ</Text>
      </View>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.content}>
          {FAQ_DATA.map((item, index) => (
            <Collapsible
              key={index}
              title={item.question}
              isFirst={index === 0}
              isLast={index === FAQ_DATA.length - 1}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? -1 : index)}
            >
              <Text style={styles.answerText}>{item.answer}</Text>
            </Collapsible>
          ))}
        </View>
        <View style={styles.contactSection}>
          <Text style={styles.confusedText}>Still Confused?</Text>
          <Text style={styles.contactText}>Contact Us</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function FAQ() {
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

  return <FAQContent />;
}

