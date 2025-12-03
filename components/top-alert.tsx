import styles from '@/stylesheets/top-alert-stylesheet';
import { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';




interface TopAlertProps {
  message: string;
  duration?: number; 
}

const TopAlert = ({ message, duration = 3000 }: TopAlertProps) => {
  const slideAnim = useRef(new Animated.Value(-100)).current; 
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Slide out after delay
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, duration);

    return () => clearTimeout(timeout);
  }, [slideAnim, opacityAnim, duration]);

  return (
    <Animated.View
      style={[
        styles.leadResponseSuccess,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <Text style={styles.leadResponseSuccessText}>{message}</Text>
    </Animated.View>
  );
};

export default TopAlert