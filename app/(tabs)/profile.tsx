import AuthModal from '@/components/auth/auth-modal';
import ProfileContent from '@/components/profile/profile-content';
import ProfileHeader from '@/components/profile/profile-header';
// import ProfileSkeleton from '@/components/profile/profile-skeleton';
import { useAuth } from '@/hooks/use-auth';
import styles from '@/stylesheets/profile-stylesheet';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Profile = () => {
  const { isAuthenticated, isInitialized, user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  // Create a mock user for unauthenticated users to show the profile interface
  const mockUser = {
    id: 'mock',
    fullName: '',
    email: '',
    createdAt: new Date().toISOString(),
    profileImage: undefined,
  };

  const displayUser = isAuthenticated ? user : mockUser;

  useFocusEffect(
    useCallback(() => {
      if (isInitialized && !isAuthenticated) {
        setModalVisible(true);
      } else if (isAuthenticated) {
        console.log(user);
        
        setModalVisible(false);
      }
    }, [isInitialized, isAuthenticated, user])
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
    return null;
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
          <ProfileContent user={displayUser} />
        </ScrollView>
      </SafeAreaView>
      <AuthModal visible={modalVisible && !isAuthenticated} onClose={closeModal} dismissible={false} />
    </>
  );
};

export default Profile;