import AuthModal from '@/components/auth/auth-modal';
import ProfileContent from '@/components/profile/profile-content';
import ProfileEmptyState from '@/components/profile/profile-empty-state';
import ProfileHeader from '@/components/profile/profile-header';
import ProfileSkeleton from '@/components/profile/profile-skeleton';
import { useAuth } from '@/hooks/use-auth';
import styles from '@/stylesheets/profile-stylesheet';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isInitialized && !isAuthenticated) {
        setModalVisible(true);
      } else if (isAuthenticated) {
        setModalVisible(false);
      }
    }, [isAuthenticated, isInitialized])
  );

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      setModalVisible(true);
    } else if (isAuthenticated) {
      setModalVisible(false);
    }
  }, [isAuthenticated, isInitialized]);

  const closeModal = () => {
    setModalVisible(false);
  };

  if (!isInitialized) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <SafeAreaView edges={['top']} style={styles.container}>
        <ScrollView
          style={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          <ProfileHeader text="Profile" />
          {isAuthenticated && user ? (
            <ProfileContent user={user} />
          ) : (
            <ProfileEmptyState />
          )}
        </ScrollView>
      </SafeAreaView>
      <AuthModal visible={modalVisible && !isAuthenticated} onClose={closeModal} />
    </>
  );
};

export default Profile;