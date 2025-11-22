import LogoutModal from '@/components/profile/logout-modal';
import { useAuthStore } from '@/store/auth-store';
import type { User } from '@/type';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheets/profile-stylesheet';

interface ProfileContentProps {
  user: User | null;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ user }) => {
  const router = useRouter();
  const { signOut } = useAuthStore();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true);
  const [emailReportsEnabled, setEmailReportsEnabled] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

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

  return (
    <SafeAreaView edges={['top']} style={styles.profileContent}>
      <View style={styles.profilePictureContainer}>
        <View style={styles.profileInfoContainer}>
          <View style={styles.avatarContainer}>
            {user?.profilePicture ? (
              <Image
                source={{ uri: user.profilePicture }}
                style={styles.avatarPlaceholder}
              />
            ) : (
              <View style={styles.avatarPlaceholder} />
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
          <View style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Feather name="shield" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Two-factor Authentication</Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: '#767577', true: '#FF5A3D' }}
              thumbColor="#ffffff"
            />
          </View>
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
            <Switch
              value={pushNotificationsEnabled}
              onValueChange={setPushNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#FF5A3D' }}
              thumbColor="#ffffff"
            />
          </View>
          <View style={styles.settingsItem}>
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
          </View>
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

