import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SignIn = () => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ headerShown: false });

    })
    
  return (
    <View style = {{
        paddingTop: inset.top, 
        paddingBottom: inset.bottom,
        backgroundColor: "#fff",
        flex: 1,
        paddingHorizontal: '5%'
    }}>
      <Text>signIn</Text>
    </View>
  )
}

export default SignIn