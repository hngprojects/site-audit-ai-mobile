import styles from '@/stylesheets/signInStylesheet';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SignIn = () => {
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();
    const router = useRouter();
        
      const [email, setEmail] = useState<string>('');
      const [Password, setPassword] = useState<string>('');
      const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
      const [IncorrectPassword, setIncorrectPassword] = useState<boolean>(false);
      const [loading, setloading] = useState<boolean>(false);


      const handleSignIn = () => {
        setloading(true);
        
        if (!email) {
            alert("Please enter your email.");
            setloading(false);
            return;
        }


        if (!Password) {
            alert("Please enter your password ");
            setloading(false);
            return;
        }
        
        
        try {
             router.replace("./(tabs)/"); 
            
        } catch (error: any) {

            console.error("Sign-in error:", error);

            if(error.code === 'AUTH_INVALID_CREDENTIALS'){
                alert("The email or password you entered is incorrect. Please try again.");
                setIncorrectPassword(true);
                return;
            }

            alert("An error occurred during sign-in. Please try again.");

        } finally {
            setloading(false);
        }

      }


    useEffect(() => {
        navigation.setOptions({ headerShown: false });
          
    }, [navigation])
    
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
                  Sign in to your account
              </Text>
      
      
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
      
            <View style={{
                borderColor: IncorrectPassword ? "#ff5a3d" : "#babec6",
                ...styles.passwordContainer
                }}>
                  <TextInput
                      placeholder="***********"
                      style={styles.passwordTextInput}
                      placeholderTextColor="#dfdfdfff"
                      value={Password}
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
      
              {IncorrectPassword && (
                <Text style={styles.incorrectPassword}> 
                  The password you entered is incorrect. Please try again
                </Text>
              )}

              <TouchableOpacity 
              onPress={() => router.push('/forgotPassword')}
              style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {loading ? (
                <ActivityIndicator 
                    size="large" 
                    color="#ff5a3d" 
                    style={{marginTop: 20}} 
                />
              ) : (
                
                <TouchableOpacity 
                    onPress={handleSignIn}
                    style={styles.signUpButton}>
                        <Text style={styles.signUpText}>
                            Sign in
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
      
              <View style={styles.SignUpContainer}>
                  <Text style = {styles.existingAccountText}>
                      Don&apos;t have an account?
                  </Text>
                  <TouchableOpacity onPress={() => router.push("./signUp")}>
                      <Text style= {styles.SignUp}>Sign Up</Text>
                  </TouchableOpacity>
              </View>
        </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default SignIn