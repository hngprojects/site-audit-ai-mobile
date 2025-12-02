import { useTranslation } from '@/utils/translations';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DeleteConfirmationSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  url?: string;
}

const DeleteConfirmationSheet: React.FC<DeleteConfirmationSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  url,
}) => {
  const { t } = useTranslation();
  const [slideAnim] = useState(new Animated.Value(0));
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY }],
                  paddingBottom: insets.bottom + 20,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.dragHandle} />
                <Text style={styles.title}>{t('deleteSheet.title')}</Text>
              </View>

              <View style={styles.contentContainer}>
                <Text style={styles.subtitle}>
                  {t('deleteSheet.message')}
                </Text>
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={handleConfirm}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteButtonText}>{t('deleteSheet.confirm')}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#D1D5DB',
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 20,
  },
  contentContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 20,
    fontFamily: 'RethinkSans-Bold',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  cancelButton: {
    width: '100%',
    backgroundColor: '#ff5a3d',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
    color: '#FFFFFF',
  },
  deleteButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ff5a3d',
  },
  deleteButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
    color: '#ff5a3d',
  },
};

export default DeleteConfirmationSheet;

