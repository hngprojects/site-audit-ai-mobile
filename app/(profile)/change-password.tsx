import { resetPassword } from '@/actions/auth-actions';
import { useAuth } from '@/hooks/use-auth';
import { handleAuthError } from '@/lib/auth-error-handler';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../Stylesheets/change-password-stylesheet';

const ChangePasswordContent = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{currentPassword?: string; newPassword?: string; confirmPassword?: string}>({});

  const validateForm = () => {
    const newErrors: {currentPassword?: string; newPassword?: string; confirmPassword?: string} = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validateForm() || !token) return;

    setIsLoading(true);
    try {
      await resetPassword(token, currentPassword, newPassword);

      Alert.alert(
        'Success',
        'Password has been changed successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      const wasLoggedOut = await handleAuthError(error);
      if (wasLoggedOut) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please sign in again.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update password. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Change Password</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Current Password</Text>
              <TextInput
                style={[styles.input, errors.currentPassword && styles.inputError]}
                value={currentPassword}
                onChangeText={(text: string) => {
                  setCurrentPassword(text);
                  if (errors.currentPassword) setErrors({...errors, currentPassword: undefined});
                }}
                placeholder="Enter current password"
                placeholderTextColor="#B9B9B9"
                secureTextEntry={true}
              />
              {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <TextInput
                style={[styles.input, errors.newPassword && styles.inputError]}
                value={newPassword}
                onChangeText={(text: string) => {
                  setNewPassword(text);
                  if (errors.newPassword) setErrors({...errors, newPassword: undefined});
                }}
                placeholder="Enter new password"
                placeholderTextColor="#B9B9B9"
                secureTextEntry={true}
              />
              {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm New Password</Text>
              <TextInput
                style={[styles.input, errors.confirmPassword && styles.inputError]}
                value={confirmPassword}
                onChangeText={(text: string) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors({...errors, confirmPassword: undefined});
                }}
                placeholder="Confirm new password"
                placeholderTextColor="#B9B9B9"
                secureTextEntry={true}
              />
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdatePassword}
              disabled={isLoading}
            >
              <Text style={styles.updateButtonText}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function ChangePassword() {
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

  return <ChangePasswordContent />;
}

