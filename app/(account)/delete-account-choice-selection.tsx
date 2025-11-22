import React, { useState, useEffect } from 'react';
import { ActivityIndicator, TouchableOpacity, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { feedbackOptions } from '@/constants/delete-account';
import styles from '@/stylesheets/delete-account-choice-selection-stylesheet';

const DeleteAccountChoiceSelectionContent = () => {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState<string>('');

  const handleCancel = () => {
    router.back();
  };

  const handleDeleteAccount = () => {
    // Navigate to next step in deletion process
    router.push('/(account)/delete-account-verification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <ThemedText style={styles.title}>Delete Account</ThemedText>
        </View>

        {/* Warning Message */}
        <View style={styles.warningContainer}>
          
          <ThemedText style={styles.warningText}>
            Deleting your account is permanent and cannot be undone, all data and access to features will be erased. Help us improve by sharing why you're leaving, your feedback matters.
          </ThemedText>
        </View>

        {/* Feedback Options */}
        <View style={styles.feedbackContainer}>
          
          <View style={styles.optionsGroup}>
            {feedbackOptions.map((option, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.optionRow}
                  onPress={() => setSelectedReason(option)}
                >
                  <View style={styles.radioContainer}>
                    <View style={[
                      styles.radioButton,
                      selectedReason === option && styles.radioButtonSelected
                    ]}>
                      {selectedReason === option && (
                        <Feather name="check" size={16} color="#FFFFFF" />
                      )}
                    </View>
                  </View>
                  <ThemedText style={styles.optionText}>{option}</ThemedText>
                </TouchableOpacity>
                {index < feedbackOptions.length - 1 && <View style={styles.separator} />}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={selectedReason ? styles.cancelButtonSelected : styles.cancelButtonUnselected} onPress={handleCancel}>
          <ThemedText style={selectedReason ? styles.cancelButtonTextSelected : styles.cancelButtonTextUnselected}>Cancel</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={selectedReason ? styles.deleteButtonSelected : styles.deleteButtonUnselected}
          onPress={handleDeleteAccount}
          disabled={!selectedReason}
        >
          <ThemedText style={styles.deleteButtonText}>Delete Account</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function DeleteAccountChoiceSelection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return <DeleteAccountChoiceSelectionContent />;
}
