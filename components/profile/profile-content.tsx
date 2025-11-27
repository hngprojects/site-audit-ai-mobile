import LogoutModal from '@/components/profile/logout-modal';
import { biometricService } from '@/lib/biometric-service';
import { useAuthStore } from '@/store/auth-store';
import styles from '@/stylesheets/profile-stylesheet';
import type { User } from '@/type';
import { getFullImageUrl } from '@/utils/image-url';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Platform, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ProfileContentProps {
  user: User | null;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ user }) => {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [loadingBiometric, setLoadingBiometric] = useState(true);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [emailReportsEnabled, setEmailReportsEnabled] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

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

  const handleBiometricToggle = async (value: boolean) => {
    if (!biometricAvailable) {
      Alert.alert(
        'Biometrics Not Available',
        Platform.OS === 'ios'
          ? 'Face ID is not available on this device. Please set up Face ID in your device settings.'
          : 'Fingerprint authentication is not available on this device. Please set up fingerprint in your device settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      if (value) {
        // Enable biometrics - authenticate first to ensure it works
        const result = await biometricService.authenticate(
          Platform.OS === 'ios'
            ? 'Enable Face ID login'
            : 'Enable fingerprint login'
        );

        if (result.success) {
          await biometricService.enable();
          setBiometricEnabled(true);
          Alert.alert(
            'Biometrics Enabled',
            Platform.OS === 'ios'
              ? 'Face ID login has been enabled. Your credentials will be saved securely.'
              : 'Fingerprint login has been enabled. Your credentials will be saved securely.',
            [{ text: 'OK' }]
          );
        } else if (result.error === 'user_cancel') {
          // User cancelled, do nothing
          return;
        } else {
          Alert.alert(
            'Authentication Failed',
            'Biometric authentication failed. Please try again.',
            [{ text: 'OK' }]
          );
        }
      } else {
        // Disable biometrics
        await biometricService.disable();
        setBiometricEnabled(false);
        Alert.alert(
          'Biometrics Disabled',
          'Biometric login has been disabled and saved credentials have been removed.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error toggling biometric:', error);
      Alert.alert(
        'Error',
        'Failed to update biometric settings. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.profileContent}>
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
            <View style={styles.editIconContainer}>
              <Feather name="edit-2" size={16} color="white" />
            </View>
          </View>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>
              {user?.fullName || 'User Name'}
            </Text>
            <Text style={styles.userEmail}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.accountSettingsContainer}>
        <View style={styles.settingsList}>
          <Text style={styles.sectionHeading}>Account</Text>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(profile)/edit-profile')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="user" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Edit Profile</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsList}>
          <Text style={styles.sectionHeading}>Security</Text>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(profile)/change-password')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="lock" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Change Password</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
          {biometricAvailable && (
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Feather name="shield" size={20} color="#1A2373" />
                <Text style={styles.settingsItemText}>
                  Biometrics
                </Text>
              </View>
              {loadingBiometric ? (
                <View style={{ width: 51, height: 31 }} />
              ) : (
                <View>
                  <Switch
                    value={biometricEnabled}
                    onValueChange={handleBiometricToggle}
                    trackColor={{ false: '#767577', true: '#FF5A3D' }}
                    thumbColor="#ffffff"
                  />
                </View>
              )}
            </View>
          )}
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(profile)/privacy-policy')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="file-text" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsList}>
          <Text style={styles.sectionHeading}>Preferences</Text>
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Feather name="bell" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Push Notifications</Text>
            </View>
            <View>
              <Switch
                value={pushNotificationsEnabled}
                onValueChange={setPushNotificationsEnabled}
                trackColor={{ false: '#767577', true: '#FF5A3D' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
          {/* <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Feather name="mail" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Email Reports</Text>
            </View>
            <Switch
              value={emailReportsEnabled}
              onValueChange={setEmailReportsEnabled}
              trackColor={{ false: '#767577', true: '#FF5A3D' }}
              thumbColor="#ffffff"
            />
          </View> */}
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(settings)/language')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="globe" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Language</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsList}>
          <Text style={styles.sectionHeading}>Help & Support</Text>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(support)/faq')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="help-circle" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>FAQ</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(support)/contact-support')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="message-circle" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Contact Support</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem} onPress={() => router.push('/(account)/delete-account-choice-selection')}>
            <View style={styles.settingsItemLeft}>
              <Feather name="trash-2" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Delete Account</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={handleLogoutPress}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>

      <LogoutModal
        visible={logoutModalVisible}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </SafeAreaView>
  );
};

export default ProfileContent;

