import styles from '@/Stylesheets/forgotPasswordStylesheet';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ForgotPassword = () => {
    const router = useRouter();
    const inset = useSafeAreaInsets();

        const [email, setEmail] = useState<string>('');
        const [verificationEmail, setVerificationEmail] = useState<boolean>(false)
  return (
    <View 
        style={{paddingTop: inset.top, 
            paddingBottom: inset.bottom,
            backgroundColor: "#fff",
            flex: 1,
            paddingHorizontal: "5%"
        }}
    >
        {!verificationEmail && (
        <>
        <View style= {styles.headerSection}>
            <TouchableOpacity 
            onPress={router.back}
            style={styles.backarrow}>
                 <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.headerText}>
                Forgot Password
            </Text>
            
        </View>
        <Text style={{...styles.createAccountTitle}}>
            Enter your email and we&apos;ll send you a mail to reset it
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


           <TouchableOpacity 
           onPress={() => setVerificationEmail(true)}
           style={styles.continueButton}>
            <Text style={styles.continueText}>
                Continue
            </Text>
        </TouchableOpacity>
        </>
        )}

        {verificationEmail && (
            <View style = {styles.VerificationContainer}>
                <View style={styles.glowCircle} />
                 <Feather name="mail" size={40} color="#d32f2f" style={styles.Icon}/>

                 <Text style={{
                    ...styles.checkyourmail}}>
                    Check Your Email
                 </Text>
                 <Text style={styles.subText}>
                    We&apos;ve sent a password code to your email 
                    address, pls check your inbox
                 </Text>

                
                  <TouchableOpacity 
                        style={[styles.continueButton, {marginTop: 140 }]}>
                            <Text style={styles.continueText}>
                                Continue
                            </Text>
                    </TouchableOpacity>
            </View>

            
        )}

      
    </View>
  )
}

export default ForgotPassword;