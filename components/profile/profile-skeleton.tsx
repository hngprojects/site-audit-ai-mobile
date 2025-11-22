import ProfileHeader from '@/components/profile/profile-header';
import { Skeleton } from '@/components/ui/skeleton';
import styles from '@/stylesheets/profile-stylesheet';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileSkeleton: React.FC = () => {
  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <ProfileHeader text="Profile" />

        <SafeAreaView edges={['top']} style={styles.profileContent}>
          {/* Profile Picture Section */}
          <View style={styles.profilePictureContainer}>
            <View style={styles.profileInfoContainer}>
              <View style={styles.avatarContainer}>
                <Skeleton width={70} height={70} borderRadius={35} />
              </View>
              <View style={styles.userInfoContainer}>
                <Skeleton width={150} height={20} style={{ marginBottom: 8 }} />
                <Skeleton width={200} height={14} />
              </View>
            </View>
          </View>

          {/* Settings Sections */}
          <View style={styles.accountSettingsContainer}>
            {/* Account Section */}
            <View style={styles.settingsList}>
              <Skeleton width={80} height={16} style={{ marginBottom: 12 }} />
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Skeleton width={20} height={20} borderRadius={4} />
                  <Skeleton width={100} height={16} style={{ marginLeft: 12 }} />
                </View>
              </View>
            </View>

            {/* Security Section */}
            <View style={styles.settingsList}>
              <Skeleton width={80} height={16} style={{ marginBottom: 12 }} />
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Skeleton width={20} height={20} borderRadius={4} />
                  <Skeleton width={120} height={16} style={{ marginLeft: 12 }} />
                </View>
              </View>
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Skeleton width={20} height={20} borderRadius={4} />
                  <Skeleton width={180} height={16} style={{ marginLeft: 12 }} />
                </View>
                <Skeleton width={50} height={30} borderRadius={15} />
              </View>
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Skeleton width={20} height={20} borderRadius={4} />
                  <Skeleton width={100} height={16} style={{ marginLeft: 12 }} />
                </View>
              </View>
            </View>

            {/* Preferences Section */}
            <View style={styles.settingsList}>
              <Skeleton width={100} height={16} style={{ marginBottom: 12 }} />
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Skeleton width={20} height={20} borderRadius={4} />
                  <Skeleton width={140} height={16} style={{ marginLeft: 12 }} />
                </View>
                <Skeleton width={50} height={30} borderRadius={15} />
              </View>
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Skeleton width={20} height={20} borderRadius={4} />
                  <Skeleton width={100} height={16} style={{ marginLeft: 12 }} />
                </View>
                <Skeleton width={50} height={30} borderRadius={15} />
              </View>
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Skeleton width={20} height={20} borderRadius={4} />
                  <Skeleton width={80} height={16} style={{ marginLeft: 12 }} />
                </View>
              </View>
            </View>

            {/* Help & Support Section */}
            <View style={styles.settingsList}>
              <Skeleton width={120} height={16} style={{ marginBottom: 12 }} />
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Skeleton width={20} height={20} borderRadius={4} />
                  <Skeleton width={50} height={16} style={{ marginLeft: 12 }} />
                </View>
              </View>
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Skeleton width={20} height={20} borderRadius={4} />
                  <Skeleton width={130} height={16} style={{ marginLeft: 12 }} />
                </View>
              </View>
              <View style={styles.settingsItem}>
                <View style={styles.settingsItemLeft}>
                  <Skeleton width={20} height={20} borderRadius={4} />
                  <Skeleton width={110} height={16} style={{ marginLeft: 12 }} />
                </View>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <Skeleton width={100} height={20} style={{ marginTop: 24, alignSelf: 'center' }} />
        </SafeAreaView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileSkeleton;

