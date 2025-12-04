import { authService, MIN_PASSWORD_LENGTH } from '@/lib/auth-service';
import { useAuthStore } from '@/store/auth-store';
import styles from '@/stylesheets/change-password-stylesheet';
import { useTranslation } from '@/utils/translations';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const ChangePasswordContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { token } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ currentPassword?: string; newPassword?: string; confirmPassword?: string }>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: { currentPassword?: string; newPassword?: string; confirmPassword?: string } = {};

    if (!currentPassword.trim()) {
      newErrors.currentPassword = t('changePassword.currentRequired');
    }

    if (!newPassword.trim()) {
      newErrors.newPassword = t('changePassword.newRequired');
    } else if (newPassword.length < MIN_PASSWORD_LENGTH) {
      newErrors.newPassword = t('changePassword.minLength').replace('{min}', String(MIN_PASSWORD_LENGTH));
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = t('changePassword.confirmRequired');
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = t('changePassword.passwordsDontMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validateForm() || !token) return;

    setIsLoading(true);
    try {
      await authService.resetPassword(currentPassword, newPassword, token);

      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: t('changePassword.updated'),
      });
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : t('changePassword.updateError'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}
        >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t('changePassword.title')}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('changePassword.currentPassword')}</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, errors.currentPassword && styles.inputError]}
                  value={currentPassword}
                  onChangeText={(text: string) => {
                    setCurrentPassword(text);
                    if (errors.currentPassword) setErrors({ ...errors, currentPassword: undefined });
                  }}
                  placeholder={t('changePassword.enterCurrent')}
                  placeholderTextColor="#B9B9B9"
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name={showCurrentPassword ? 'eye' : 'eye-off'} size={20} color="#9ba1ab" />
                </TouchableOpacity>
              </View>
              {errors.currentPassword && <Text style={styles.errorText}>{errors.currentPassword}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('changePassword.newPassword')}</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, errors.newPassword && styles.inputError]}
                  value={newPassword}
                  onChangeText={(text: string) => {
                    setNewPassword(text);
                    if (errors.newPassword) setErrors({ ...errors, newPassword: undefined });
                  }}
                  placeholder={t('changePassword.enterNew')}
                  placeholderTextColor="#B9B9B9"
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name={showNewPassword ? 'eye' : 'eye-off'} size={20} color="#9ba1ab" />
                </TouchableOpacity>
              </View>
              {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('changePassword.confirmPassword')}</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.input, errors.confirmPassword && styles.inputError]}
                  value={confirmPassword}
                  onChangeText={(text: string) => {
                    setConfirmPassword(text);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                  }}
                  placeholder={t('changePassword.confirmNew')}
                  placeholderTextColor="#B9B9B9"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Feather name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#9ba1ab" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.updateButton, isLoading && styles.updateButtonDisabled]}
              onPress={handleUpdatePassword}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.updateButtonText}>{t('changePassword.updatePassword')}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default function ChangePassword() {
  const [isLoaded, setIsLoaded] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{t('common.loading')}</Text>
      </View>
    );
  }

  return <ChangePasswordContent />;
}

