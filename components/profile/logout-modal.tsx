import { useTranslation } from '@/utils/translations';
import styles from '@/stylesheets/profile-stylesheet';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutModal: React.FC<LogoutModalProps> = ({ visible, onClose, onConfirm }) => {
  const { t } = useTranslation();
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.logoutModalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.logoutModalContent}>
              <View style={styles.logoutIconContainer}>
                <Feather name="trash-2" size={24} color="#FF5A3D" />
              </View>
              <Text style={styles.logoutModalTitle}>{t('profile.logoutConfirmationTitle')}</Text>
              <Text style={styles.logoutModalMessage}>
                {t('profile.logoutConfirmationMessage')}
              </Text>
              <View style={styles.logoutModalButtons}>
                <TouchableOpacity
                  style={styles.logoutModalNoButton}
                  onPress={onClose}
                >
                  <Text style={styles.logoutModalNoButtonText}>{t('common.no')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.logoutModalYesButton}
                  onPress={onConfirm}
                >
                  <Text style={styles.logoutModalYesButtonText}>{t('common.yes')}</Text>
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