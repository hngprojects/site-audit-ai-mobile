import { useAuth } from '@/hooks/use-auth';
import styles from '@/stylesheets/profile-stylesheet';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  Keyboard,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { googleAuthService } from '../../lib/google-auth-service';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  redirect?: string;
  dismissible?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, redirect, dismissible = true }) => {
  const [slideAnim] = useState(new Animated.Value(0));
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const { signInWithGoogle, signInWithApple, isLoading, isAuthenticated } = useAuth();

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

  // Close modal when user successfully authenticates
  useEffect(() => {
    if (isAuthenticated && visible) {
      if (redirect) {
        (router.push as any)({ pathname: redirect });
      } else {
        onClose();
      }
    }
  }, [isAuthenticated, visible, onClose, redirect, router]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      // Modal will close automatically when isAuthenticated becomes true
    } catch (error) {
      // Error is handled by the store and shown via Alert
      console.error('Google sign-in error:', error);
    }
  };

  const handleAppleLogin = async () => {
    try {
      await signInWithApple();
      // Modal will close automatically when isAuthenticated becomes true
    } catch (error) {
      // Error is handled by the store and shown via Alert
      console.error('Apple sign-in error:', error);
    }
  };

  const handleSignIn = () => {
    onClose();
    router.push({ pathname: '/(auth)/sign-in', params: redirect ? { redirect } : {} });
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  const handleOverlayPress = () => {
    Keyboard.dismiss();
    if (dismissible) {
      onClose();
    }
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
                {googleAuthService.isAvailable() && (
                  <TouchableOpacity
                    style={[styles.socialButton, isLoading && { opacity: 0.6 }]}
                    onPress={handleGoogleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#1c1c1c" style={{ marginRight: 12 }} />
                    ) : (
                      <Image
                        source={require('../../assets/images/google.png')}
                        style={styles.socialIcon}
                      />
                    )}
                    <Text style={styles.socialButtonText}>Continue with Google</Text>
                  </TouchableOpacity>
                )}

                {Platform.OS === "ios" && (
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
                )}


                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleSignIn}
                >
                  <Image
                    source={require('../../assets/images/Envelope.png')}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.emailButtonSecondaryText}>Continue with email</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleSignIn}
                >
                  <Image
                    source={require('../../assets/images/Envelope.png')}
                    style={styles.socialIcon}
                  />
                  <Text style={styles.emailButtonSecondaryText}>Sign in with email</Text>
                </TouchableOpacity> */}
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

