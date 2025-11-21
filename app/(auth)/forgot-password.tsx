import { authService } from '@/lib/auth-service';
import styles from '@/Stylesheets/forgot-password-stylesheet';
import { useResetPasswordEmailStore } from '@/zustardStore/resetPasswordEmailStore';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ForgotPassword = () => {
    const router = useRouter();
    const inset = useSafeAreaInsets();

    const [email, setEmail] = useState<string>('');
    const [verificationEmail, setVerificationEmail] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { setPasswordRecoveryEmail } = useResetPasswordEmailStore();

    const sendingResetCode = async () => {
        setError(null);
        setLoading(true);

        if (!email.trim()) {
            setError('Please enter your email address.');
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address.');
            setLoading(false);
            return;
        }

        try {
            await authService.forgotPassword(email.trim());
            setPasswordRecoveryEmail(email.trim());
            setVerificationEmail(true);
        } catch (error: any) {
            console.error("Error sending reset code:", error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred while sending the reset code. Please try again.';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    }

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
            Enter your email and we&apos;ll send you a mail to reset your password.
        </Text>
      
      
        <Text style={{...styles.textInputLabel}}>
            Email
        </Text>
      
        <TextInput
            placeholder="user@gmail.com"
            style={[
                styles.textInput,
                error && { borderColor: '#ff5a3d' }
            ]}
            placeholderTextColor="#dfdfdfff"
            value={email}
            onChangeText={(text) => {
                setEmail(text);
                setError(null);
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
        />

        {error && (
            <Text style={styles.errorText}>{error}</Text>
        )}

            {loading ? (
                <ActivityIndicator 
                    size="large" 
                    color="#ff5a3d" 
                    style={{marginTop: 20}} 
                />
            ) : (
                <TouchableOpacity 
                    onPress={sendingResetCode}
                    style={styles.continueButton}>
                        <Text style={styles.continueText}>
                            Continue
                        </Text>
                </TouchableOpacity>
            )}
        </>
        )}

        {verificationEmail && (
            <View style = {styles.VerificationContainer}>
                <View style={styles.outerGlowCircle} />
                <View style={styles.glowCircle} />
                 <Feather name="mail" size={40} color="#d32f2f" style={styles.Icon}/>

                 <Text style={{
                    ...styles.checkyourmail}}>
                    Check your email
                 </Text>
                 <Text style={styles.subText}>
                    We&apos;ve sent a password code to your email 
                    address, pls check your inbox
                 </Text>

                
                    <TouchableOpacity 
                        onPress={() => router.push('/(auth)/otp-verification')}
                        style={[styles.continueButton, Platform.OS === 'ios' ? {marginTop: 220 } : {marginTop: 140 }]}
                    >
                            <Text style={styles.continueText}>
                                Continue
                            </Text>
                    </TouchableOpacity>
            </View>

            
        )}

      
    </View>
  )
}

export default ForgotPassword

