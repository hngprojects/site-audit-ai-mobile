import { useAuthStore } from '@/store/auth-store';
import { useTranslation } from '@/utils/translations';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import styles from '../../stylesheets/delete-account-final-confirmation-stylesheet';

const DeleteAccountFinalConfirmationContent = () => {
  const router = useRouter();
  const { deleteAccount, isLoading } = useAuthStore();
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleYes = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      // Navigate to confirmation screen after successful deletion
      router.replace('/(account)/deletion-confirmation-screen');
    } catch (error) {
      setIsDeleting(false);
      const errorMessage = error instanceof Error ? error.message : t('deleteAccount.deleteError');
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: errorMessage,
      });
    }
  };

  const handleNo = () => {
    // Go back to verification
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>We have verified your account and will proceed with deletion.</Text>

        <Text style={styles.description}>
          This is your last chance to cancel. You won&lsquo;t be able to recover your account once deleted and will need to create a new account if you ever wish to return.

        </Text >
        <Text style={styles.description}> Are you sure you want to delete your account?</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.yesButton, (isDeleting || isLoading) && styles.yesButtonDisabled]}
            onPress={handleYes}
            disabled={isDeleting || isLoading}
          >
            {isDeleting || isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.yesButtonText}>Yes</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.noButton}
            onPress={handleNo}
            disabled={isDeleting || isLoading}
          >
            <Text style={styles.noButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default function DeleteAccountFinalConfirmation() {
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

  return <DeleteAccountFinalConfirmationContent />;
}