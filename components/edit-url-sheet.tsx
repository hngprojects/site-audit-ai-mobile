import { useTranslation } from '@/utils/translations';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface EditUrlSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (newUrl: string) => void;
  currentUrl: string;
  isLoading?: boolean;
}

const EditUrlSheet: React.FC<EditUrlSheetProps> = ({
  visible,
  onClose,
  onConfirm,
  currentUrl,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [slideAnim] = useState(new Animated.Value(0));
  const [newUrl, setNewUrl] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (visible) {
      setNewUrl('');
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
    outputRange: [400, 0],
  });

  const handleConfirm = () => {
    if (newUrl.trim()) {
      onConfirm(newUrl.trim());
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => { }}>
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
                  <Text style={styles.title}>{t('editUrlSheet.title')}</Text>
                </View>

                <View style={styles.contentContainer}>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t('editUrlSheet.currentUrl')}</Text>
                    <TextInput
                      style={[styles.input, styles.inputReadOnly]}
                      value={currentUrl}
                      editable={false}
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>{t('editUrlSheet.newUrl')}</Text>
                    <TextInput
                      style={styles.input}
                      value={newUrl}
                      onChangeText={setNewUrl}
                      placeholder={t('editUrlSheet.enterUrl')}
                      placeholderTextColor="#9CA3AF"
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
                    />
                  </View>
                </View>

                <View style={styles.buttonsContainer}>
                  <TouchableOpacity
                    style={[styles.scanButton, isLoading && styles.buttonDisabled]}
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                    disabled={isLoading || !newUrl.trim()}
                  >
                    <Text style={styles.scanButtonText}>
                      {isLoading ? t('editUrlSheet.scanning') : t('editUrlSheet.scan')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
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
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'RethinkSans-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'RethinkSans-Regular',
    color: '#111827',
  },
  inputReadOnly: {
    backgroundColor: '#F3F4F6',
    color: '#6B7280',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  scanButton: {
    width: '100%',
    backgroundColor: '#ff5a3d',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
    color: '#FFFFFF',
  },
  cancelButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ff5a3d',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'RethinkSans-SemiBold',
    color: '#ff5a3d',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
};

export default EditUrlSheet;

