import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import styles from '../../Stylesheets/profile-stylesheet';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onClose, onConfirm }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.logoutModalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.logoutModalContent}>
              <View style={styles.logoutIconContainer}>
                <Feather name="trash-2" size={24} color="#FF5A3D" />
              </View>
              <Text style={styles.logoutModalTitle}>Logout?</Text>
              <Text style={styles.logoutModalMessage}>
                Are you sure you want to log out?
              </Text>
              <View style={styles.logoutModalButtons}>
                <TouchableOpacity
                  style={styles.logoutModalNoButton}
                  onPress={onClose}
                >
                  <Text style={styles.logoutModalNoButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.logoutModalYesButton}
                  onPress={onConfirm}
                >
                  <Text style={styles.logoutModalYesButtonText}>Yes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LogoutModal;