import { saveToSecureStore } from '@/expoSecureStore';
import styles from '@/stylesheets/signUpStylesheet';
import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const SignUp = () => {
    const router = useRouter();
    const inset = useSafeAreaInsets();

    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
    const [loading, setloading] = useState<boolean>(false);




    const handleSignUp = async () => {
        setloading(true);
        
        if (!fullName) {
            alert("Please enter your full name.");
            setloading(false);
            return;
        }
        
        if (!email) {
            alert("Please enter your email.");
            setloading(false);
            return;
        }

        if (!password) {
            alert("Please enter your password ");
            setloading(false);
            return;
        }
        
        try {

            await saveToSecureStore("jwt", "hereItIs")
             router.replace("./(tabs)/"); 
            
        } catch (error: any) {

            console.error("Sign-up error:", error);

            alert("An error occurred during sign-up. Please try again.");

        } finally {
            setloading(false);
        }

      }



  return (
    <TouchableWithoutFeedback 
    onPress={Keyboard.dismiss}
    >
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                ...styles.container,
                paddingTop: inset.top , 
                paddingBottom: inset.bottom
            }}
        >
        <Image
            source={require('../assets/images/icon.png')}
            style={{
            width: 140,
            resizeMode: "contain",
            alignSelf: "center",
            ...styles.logo,
            }}
            
        />

        <Text style={{...styles.createAccountTitle}}>
            Create your account
        </Text>

        <Text style={{...styles.textInputLabel}}>
            Full Name
        </Text>

        <TextInput
            placeholder="Enter your full name"
            style={styles.textInput}
            placeholderTextColor="#dfdfdfff"
            value={fullName}
            onChangeText={x => setFullName(x)}
            
        />

        <Text style={{...styles.textInputLabel}}>
            Email
        </Text>

        <TextInput
            placeholder="user@gmail.com"
            style={styles.textInput}
            placeholderTextColor="#dfdfdfff"
            value={email}
            onChangeText={x => setEmail(x)}

        />

        <Text style={{...styles.textInputLabel}}>
            Password
        </Text>

        <View style={styles.passwordContainer}>
            <TextInput
                placeholder="user@gmail.com"
                style={styles.passwordTextInput}
                placeholderTextColor="#dfdfdfff"
                value={password}
                onChangeText={x => setPassword(x)}
                secureTextEntry={secureTextEntry}
            />

            {secureTextEntry ? 
                <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                    <Feather name="eye-off" size={24} color="#9ba1ab" />
                </TouchableOpacity>
            :
            <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                <Feather name="eye" size={24} color="#9ba1ab" />
            </TouchableOpacity>
            }

        </View>

        {loading ? (
            <ActivityIndicator 
                size="large" 
                color="#ff5a3d" 
                style={{marginTop: 20}} 
            />
        ) : (
            <TouchableOpacity 
                onPress={handleSignUp}
                style={styles.signUpButton} 
            >
                <Text style={styles.signUpText}>
                    Sign Up
                </Text>
            </TouchableOpacity>
        )}
        
        <View style={styles.continueWithSection}>
            <View style={styles.Line}/>

            <Text style={styles.continueText}>
                Or continue with
            </Text>

            <View style={styles.Line}/>
        </View>


         <TouchableOpacity style={styles.SocialSIgninButton}>

            <Image 
            source={require('../assets/images/google.png')}
            style={{
                height: 25,
                width: 25,
            }}
            />

            <Text style={styles.Google}>
                Continue with Google
            </Text>
        </TouchableOpacity>
        
               <TouchableOpacity style={styles.AppleSocialSIgninButton}>
      
                  <Image 
                  source={require('../assets/images/apple.png')}
                  style={{
                      height: 35,
                      width: 35,
                  }}
                  />
      
                  <Text style={styles.Google}>
                      Continue with Apple
                  </Text>
              </TouchableOpacity>

        <View style={styles.SignInContainer}>
            <Text style = {styles.existingAccountText}>
                Already have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("./signIn")}>
                <Text style= {styles.SignIN}>Sign In</Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    </TouchableWithoutFeedback >
  )
}

export default SignUp