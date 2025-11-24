import styles from '@/stylesheets/hire-request-stylesheet';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HireRequest = () => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();
    
    useEffect(() => {
    navigation.setOptions({
        headerShown: false
    });
}, [navigation]);


  return (
    <View style={{...styles.container,
        paddingTop: inset.top,
        paddingBottom: inset.bottom
    }}>
      <Text style={styles.title}>
        This is the hire request screen.
        </Text>
    </View>
  )
}

export default HireRequest