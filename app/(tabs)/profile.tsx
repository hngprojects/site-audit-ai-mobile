import AuthModal from '@/components/auth/auth-modal';
import styles from '@/stylesheets/profile-stylesheet';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.openButton}>
        <Text style={styles.openButtonText}>Open Auth Modal</Text>
      </TouchableOpacity>

      <AuthModal visible={modalVisible} onClose={closeModal} />
    </View>
  );
};

export default Profile;