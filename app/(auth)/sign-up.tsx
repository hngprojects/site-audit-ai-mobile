
import styles from '@/Stylesheets/sign-up-stylesheet';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const SignUp = () => {
    const router = useRouter();
    const inset = useSafeAreaInsets();

    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

  return (
    <View
      style={{
        paddingTop: inset.top,
        paddingBottom: inset.bottom,
        ...styles.container,
      }}
    >
      <Image
        source={require('../../assets/images/icon.png')}
        style={{
          width: 140,
          resizeMode: 'contain',
          alignSelf: 'center',
          ...styles.logo,
        }}
      />

      <Text style={{ ...styles.createAccountTitle }}>Create your account</Text>

      <Text style={{ ...styles.textInputLabel }}>Full Name</Text>

      <TextInput
        placeholder="Enter your full name"
        style={styles.textInput}
        placeholderTextColor="#dfdfdfff"
        value={fullName}
        onChangeText={x => setFullName(x)}
      />

      <Text style={{ ...styles.textInputLabel }}>Email</Text>

      <TextInput
        placeholder="user@gmail.com"
        style={styles.textInput}
        placeholderTextColor="#dfdfdfff"
        value={email}
        onChangeText={x => setEmail(x)}
      />

      <Text style={{ ...styles.textInputLabel }}>Password</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="user@gmail.com"
          style={styles.passwordTextInput}
          placeholderTextColor="#dfdfdfff"
          value={Password}
          onChangeText={x => setPassword(x)}
          secureTextEntry={secureTextEntry}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            <Feather name="eye-off" size={24} color="#9ba1ab" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            <Feather name="eye" size={24} color="#9ba1ab" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.signUpButton}
        onPress={() => router.replace('/notifications' as any)}
      >
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.continueWithSection}>
        <View style={styles.Line} />

        <Text style={styles.continueText}>Or continue with</Text>

        <View style={styles.Line} />
      </View>

      <TouchableOpacity style={styles.SocialSIgninButton}>
        <Image
          source={require('../../assets/images/google.png')}
          style={{
            height: 25,
            width: 25,
          }}
        />

        <Text style={styles.Google}>Continue with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.AppleSocialSIgninButton}>
        <Image
          source={require('../../assets/images/apple.png')}
          style={{
            height: 35,
            width: 35,
          }}
        />

        <Text style={styles.Google}>Continue with Apple</Text>
      </TouchableOpacity>

      <View style={styles.SignInContainer}>
        <Text style={styles.existingAccountText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in' as any)}>
          <Text style={styles.SignIN}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default SignUp

