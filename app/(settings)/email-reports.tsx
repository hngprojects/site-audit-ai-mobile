import { useEmailReportsStore, type EmailFrequency } from '@/store/email-reports-store';
import styles from '@/stylesheets/email-reports-stylesheet';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const EmailReportsContent = () => {
  const router = useRouter();
  const { frequency, setFrequency } = useEmailReportsStore();
  const [selectedFrequency, setSelectedFrequency] = useState<EmailFrequency | null>(frequency);

  useEffect(() => {
    setSelectedFrequency(frequency);
  }, [frequency]);

  const frequencies: { value: EmailFrequency; label: string }[] = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'never', label: 'Never' },
  ];

  const handleSave = () => {
    if (selectedFrequency) {
      setFrequency(selectedFrequency);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Email report frequency has been updated successfully',
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
        <Text style={styles.headerText}>Email Reports</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Schedule automated reports</Text>
        <Text style={styles.description}>Control how often you receive email reports</Text>

        <View style={styles.optionsGroup}>
          {frequencies.map((frequency, index) => (
            <View key={frequency.value}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setSelectedFrequency(frequency.value)}
              >
                <Text style={styles.optionText}>{frequency.label}</Text>
                <View style={styles.radioContainer}>
                  <View style={[
                    styles.radioButton,
                    selectedFrequency === frequency.value && styles.radioButtonSelected
                  ]}>
                    {selectedFrequency === frequency.value && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                </View>
              </TouchableOpacity>
              {index < frequencies.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              selectedFrequency ? styles.saveButtonActive : styles.saveButtonInactive,
            ]}
            disabled={!selectedFrequency}
            onPress={handleSave}
          >
            <Text style={[
              styles.saveButtonText,
              selectedFrequency ? styles.saveButtonTextActive : styles.saveButtonTextInactive,
            ]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function EmailReports() {
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

  return <EmailReportsContent />;
}

