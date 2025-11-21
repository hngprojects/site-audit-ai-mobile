import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Image,
  Keyboard,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../Stylesheets/profile-stylesheet';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
  const [slideAnim] = useState(new Animated.Value(0));
  const router = useRouter();
  const inset = useSafeAreaInsets();

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

  const handleGoogleLogin = () => {
    console.log('Google login pressed');
    onClose();
  };

  const handleAppleLogin = () => {
    console.log('Apple login pressed');
    onClose();
  };

  const handleSignUp = () => {
    router.push('/(auth)/sign-up');
    // Don't close modal here - let it close when user successfully authenticates
  };

  const handleSignIn = () => {
    router.push('/(auth)/sign-in');
    // Don't close modal here - let it close when user successfully authenticates
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const handleOverlayPress = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY }],
                  paddingBottom: inset.bottom + 20,
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.dragHandle} />
              </View>

              <View style={styles.logoContainer}>
                <Image
                  source={require('../../assets/imgs/logo-variant-2.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGoogleLogin}
                >
                  <Image
                    source={require('../../assets/images/google.png')}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleAppleLogin}
                >
                  <Image
                    source={require('../../assets/images/apple.png')}
                    style={styles.appleIcon}
                  />
                  <Text style={styles.socialButtonText}>Continue with Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleSignUp}
                >
                  <Image
                    source={require('../../assets/images/Envelope.png')}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.emailButtonSecondaryText}>Sign up with email</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleSignIn}
                >
                  <Image
                    source={require('../../assets/images/Envelope.png')}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.emailButtonSecondaryText}>Sign in with email</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  By Signing up, you will be getting a 24/7 website Monitoring and weekly updates on your websites
                </Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AuthModal;

