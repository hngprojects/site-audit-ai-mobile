import AuthModal from '@/components/auth/auth-modal';
import { useAuth } from '@/hooks/use-auth';
import styles from '@/stylesheets/profile-stylesheet';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const Profile = () => {
  const { isAuthenticated, isInitialized, user } = useAuth();
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
    setModalVisible(false);
    // User can close modal and stay on profile tab
    // The profile content will show "Please sign in to view your profile"
  };

  // Show loading state while initializing
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render profile content with modal overlay when not authenticated
  return (
    <>
      <View style={styles.container}>
        <Text style={{ fontSize: 24, fontFamily: 'RethinkSans-Bold', marginBottom: 20 }}>
          Profile
        </Text>
        {isAuthenticated && user ? (
          <View>
            <Text style={{ fontSize: 16, fontFamily: 'RethinkSans-Regular', marginBottom: 10 }}>
              Email: {user.email}
            </Text>
            {user.fullName && (
              <Text style={{ fontSize: 16, fontFamily: 'RethinkSans-Regular' }}>
                Name: {user.fullName}
              </Text>
            )}
          </View>
        ) : (
          <View>
            <Text style={{ fontSize: 16, fontFamily: 'RethinkSans-Regular', marginBottom: 10 }}>
              Please sign in to view your profile
            </Text>
          </View>
        )}
      </View>
      <AuthModal visible={modalVisible && !isAuthenticated} onClose={closeModal} />
    </>
  );
};

export default Profile;