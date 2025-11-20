import React from 'react';
import { Text, TouchableOpacity, View, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import styles from '@/stylesheets/profile-stylesheet';

const profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <TabHeader text="Profile" />
        <ProfileContent />
      </ScrollView>
    </SafeAreaView>
  );
};
export default profile;
const TabHeader = ({ text, back }: { text: string; back?: boolean }) => {
  return (
    <View style={styles.tabHeader}>
      <Text style={styles.tabHeaderText}>
        {text}
      </Text>
    </View>
  );
};
const ProfileContent = () => {
  const router = useRouter();
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = React.useState(true);
  const [emailReportsEnabled, setEmailReportsEnabled] = React.useState(false);

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
              Damian Amadi
            </Text>
            <Text style={styles.userEmail}>
              Damianamadi@gmail.com
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
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Feather name="globe" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Language</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsList}>
          <Text style={styles.sectionHeading}>Help & Support</Text>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Feather name="help-circle" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>FAQ</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Feather name="message-circle" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Contact Support</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Feather name="trash-2" size={20} color="#1A2373" />
              <Text style={styles.settingsItemText}>Delete Account</Text>
            </View>
            <Feather name="chevron-right" size={16} color="#1A2373" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.logoutText}>Log out</Text>
    </View>
  );
};