import AuthModal from '@/components/auth/auth-modal';
import LogoutModal from '@/components/profile/logout-modal';
import { useAuth } from '@/hooks/use-auth';
import styles from '@/stylesheets/profile-stylesheet';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';

const Profile = () => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const isAuthenticated = true;
  const isInitialized = true;
  const user = null;
  const [modalVisible, setModalVisible] = useState(false);

  // Check auth state when screen comes into focus (e.g., when navigating back from auth screens)
  useFocusEffect(
    useCallback(() => {
      if (isInitialized && !isAuthenticated) {
        setModalVisible(true);
      } else if (isAuthenticated) {
        setModalVisible(false);
      }
    }, [isAuthenticated, isInitialized])
  );

  // Show modal if user is not authenticated when component mounts or auth state changes
  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      setModalVisible(true);
    } else if (isAuthenticated) {
      setModalVisible(false);
    }
  }, [isAuthenticated, isInitialized]);

  const closeModal = () => {
    // Only allow closing if user is authenticated
    if (isAuthenticated) {
      setModalVisible(false);
    }
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Don't render profile content if not authenticated - show modal instead
  if (!isAuthenticated) {
    return <AuthModal visible={modalVisible} onClose={closeModal} />;
  }

  // Render profile content when authenticated
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <TabHeader text="Profile" />
        <ProfileContent user={user} />
      </ScrollView>
    </SafeAreaView>
  );
};
export default Profile;
const TabHeader = ({ text, back }: { text: string; back?: boolean }) => {
  return (
    <View style={styles.tabHeader}>
      <Text style={styles.tabHeaderText}>
        {text}
      </Text>
    </View>
  );
};
const ProfileContent = ({ user }: { user: any }) => {
   const router = useRouter();
   const { signOut } = useAuthStore();
   const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
   const [pushNotificationsEnabled, setPushNotificationsEnabled] = React.useState(true);
   const [emailReportsEnabled, setEmailReportsEnabled] = React.useState(false);
   const [logoutModalVisible, setLogoutModalVisible] = React.useState(false);

   const handleLogoutPress = () => {
     setLogoutModalVisible(true);
   };

   const handleLogoutConfirm = async () => {
     try {
       await signOut();
       setLogoutModalVisible(false);
       // Navigation will be handled by the auth state change
     } catch (error) {
       console.error('Logout failed:', error);
       setLogoutModalVisible(false);
     }
   };

   const handleLogoutCancel = () => {
     setLogoutModalVisible(false);
   };

   return (
    <View style={styles.profileContent}>
      {/* profile picture with user info  */}
      <View style={styles.profilePictureContainer}>
        <View style={styles.profileInfoContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder} />
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
      {/* Account Settings */}
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
    </View>
  );
};