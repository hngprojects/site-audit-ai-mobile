import LogoutModal from '@/components/profile/logout-modal';
import ProfilePhotoSheet from '@/components/profile/profile-photo-sheet';
import { biometricService } from '@/lib/biometric-service';
import { profileService } from '@/lib/profile-service';
import { useAuthStore } from '@/store/auth-store';
import { useEmailReportsStore } from '@/store/email-reports-store';
import styles from '@/stylesheets/profile-stylesheet';
import type { User } from '@/type';
import { getFullImageUrl } from '@/utils/image-url';
import { useTranslation } from '@/utils/translations';
import { Feather, Fontisto } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Platform, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

interface ProfileContentProps {
  user: User | null;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ user }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { signOut } = useAuthStore();
  const { frequency } = useEmailReportsStore();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [loadingBiometric, setLoadingBiometric] = useState(true);
  // const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false);
  const { token } = useAuthStore();

  const getFrequencyLabel = () => {
    if (!frequency) return null;
    const labels: Record<string, string> = {
      weekly: t('emailReports.weekly'),
      monthly: t('emailReports.monthly'),
      quarterly: t('emailReports.quarterly'),
      never: t('emailReports.never'),
    };
    return labels[frequency] || null;
  };

  // Load biometric status
  useEffect(() => {
    const loadBiometricStatus = async () => {
      try {
        const available = await biometricService.isAvailable();
        const enabled = await biometricService.isEnabled();
        setBiometricAvailable(available);
        setBiometricEnabled(enabled);
      } catch (error) {
        console.error('Error loading biometric status:', error);
      } finally {
        setLoadingBiometric(false);
      }
    };

    loadBiometricStatus();
  }, []);

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await signOut();
      setLogoutModalVisible(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setLogoutModalVisible(false);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false);
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Toast.show({
          type: 'warning',
          text1: t('editProfile.permissionsRequired'),
          text2: t('editProfile.cameraPermission'),
        });
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission || !token) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.fileSize && asset.fileSize > 3 * 1024 * 1024) {
          Toast.show({
            type: 'error',
            text1: t('common.error'),
            text2: t('editProfile.imageSizeError'),
          });
          return;
        }
        await uploadImage(asset.uri);
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('editProfile.takePhotoError'),
      });
    }
  };

  const handleChoosePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission || !token) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.fileSize && asset.fileSize > 3 * 1024 * 1024) {
          Toast.show({
            type: 'error',
            text1: t('common.error'),
            text2: t('editProfile.imageSizeError'),
          });
          return;
        }
        await uploadImage(asset.uri);
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('editProfile.selectImageError'),
      });
    }
  };

  const uploadImage = async (imageUri: string) => {
    if (!token) return;

    try {
      const imageUrl = await profileService.uploadProfileImage(imageUri, token);
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          profileImage: imageUrl,
        };
        useAuthStore.setState({ user: updatedUser });
      }
      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: t('editProfile.profilePhotoUpdated'),
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : t('editProfile.uploadError'),
      });
    }
  };

  const handleDeletePhoto = async () => {
    if (!token) return;

    try {
      await profileService.deleteProfileImage(token);
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          profileImage: undefined,
        };
        useAuthStore.setState({ user: updatedUser });
      }
      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: t('editProfile.photoDeleted'),
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : t('editProfile.deletePhotoError'),
      });
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (!biometricAvailable) {
      Toast.show({
        type: 'warning',
        text1: t('auth.biometricLoginFailed'),
        text2: Platform.OS === 'ios'
          ? t('editProfile.faceIdNotAvailable')
          : t('editProfile.biometricNotAvailable'),
      });
      return;
    }

    try {
      if (value) {
        // Enable biometrics - authenticate first to ensure it works
        const result = await biometricService.authenticate(
          Platform.OS === 'ios'
            ? t('editProfile.enableFaceId')
            : t('editProfile.enableBiometric')
        );

        if (result.success) {
          await biometricService.enable();
          setBiometricEnabled(true);
          Toast.show({
            type: 'success',
            text1: t('profile.biometric'),
            text2: Platform.OS === 'ios'
              ? t('editProfile.faceIdEnabled')
              : t('editProfile.biometricEnabled'),
          });
        } else if (result.error === 'user_cancel') {
          // User cancelled, do nothing
          return;
        } else {
          Toast.show({
            type: 'error',
            text1: t('auth.biometricLoginFailed'),
            text2: t('editProfile.biometricFailed'),
          });
        }
      } else {
        // Disable biometrics
        await biometricService.disable();
        setBiometricEnabled(false);
        Toast.show({
          type: 'success',
          text1: t('profile.biometric'),
          text2: t('editProfile.biometricDisabled'),
        });
      }
    } catch (error) {
      console.error('Error toggling biometric:', error);
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('editProfile.biometricUpdateError'),
      });
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.profileContent}>
      {user && (
        <View style={styles.profilePictureContainer}>
          <View style={styles.profileInfoContainer}>
            <View style={styles.avatarContainer}>
              {user?.profileImage && user.profileImage.trim() ? (
                <Image
                  source={{ uri: getFullImageUrl(user.profileImage) || '' }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>
                    {user?.fullName && user.fullName.trim()
                      ? user.fullName
                        .trim()
                        .split(' ')
                        .filter(n => n.length > 0)
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                      : user?.email && user.email.trim()
                        ? user.email[0].toUpperCase()
                        : 'U'}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.editIconContainer}
                onPress={() => setPhotoSheetVisible(true)}
                activeOpacity={0.7}
              >
                <Feather name="edit-2" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                {user?.fullName || 'User Name'}
              </Text>
              <Text style={styles.userEmail} numberOfLines={1} ellipsizeMode="tail">
                {user?.email || 'user@example.com'}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.accountSettingsContainer}>
        <View style={styles.settingsList}>
          <Text style={styles.sectionHeading}>{t('profile.account')}</Text>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(profile)/edit-profile')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="user" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>{t('profile.edit')}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsList}>
          <Text style={styles.sectionHeading}>{t('profile.security')}</Text>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(profile)/change-password')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="lock" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>{t('profile.changePassword')}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
          {biometricAvailable && (
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="shield" size={20} color="#1A2373" />
                <Text style={styles.settingsItemText}>
                  {t('profile.biometrics')}
                </Text>
              </View>
              {loadingBiometric ? (
                <View style={{ width: 51, height: 31 }} />
              ) : (
                <Switch
                  value={biometricEnabled}
                  onValueChange={handleBiometricToggle}
                  trackColor={{ false: '#767577', true: '#FF5A3D' }}
                  thumbColor="#ffffff"
                />
              )}
            </View>
          )}
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(profile)/privacy-policy')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="file-text" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>{t('profile.privacy')}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsList}>
          <Text style={styles.sectionHeading}>{t('profile.preferences')}</Text>
          {/* <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Feather name="bell" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={setPushNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#FF5A3D' }}
              thumbColor="#ffffff"
            />
          </View> */}
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(settings)/email-reports')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="mail" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>{t('profile.emailReports')}</Text>
            </View>
            <View style={styles.settingsItemRight}>
              {getFrequencyLabel() && (
                <Text style={styles.frequencyText}>{getFrequencyLabel()}</Text>
              )}
              <Feather name="chevron-right" size={16} color="#1A2373" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(settings)/language')}>
            <View style={styles.settingsItemLeft}>
              <Fontisto name="language" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>{t('profile.language')}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsList}>
          <Text style={styles.sectionHeading}>{t('profile.helpSupport')}</Text>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(support)/faq')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="help-circle" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>{t('profile.faq')}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(support)/contact-support')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="message-circle" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>{t('profile.contactSupport')}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(account)/delete-account-choice-selection')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="trash-2" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>{t('profile.deleteAccount')}</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleLogoutPress}>
        <Text style={styles.logoutText}>{t('profile.logoutConfirm')}</Text>
      </TouchableOpacity>

      <LogoutModal
        visible={logoutModalVisible}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />

      <ProfilePhotoSheet
        visible={photoSheetVisible}
        onClose={() => setPhotoSheetVisible(false)}
        onTakePhoto={handleTakePhoto}
        onChoosePhoto={handleChoosePhoto}
        onDeletePhoto={handleDeletePhoto}
        hasPhoto={!!(user?.profileImage && user.profileImage.trim())}
      />
    </SafeAreaView>
  );
};

export default ProfileContent;

