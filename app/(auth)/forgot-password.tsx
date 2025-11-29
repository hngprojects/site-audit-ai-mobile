import { authService } from '@/lib/auth-service';
import styles from '@/stylesheets/forgot-password-stylesheet';
import { useTranslation } from '@/utils/translations';
import { useResetPasswordEmailStore } from '@/zustardStore/resetPasswordEmailStore';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ForgotPassword = () => {
    const { t } = useTranslation();
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
            setError(t('auth.emailRequired'));
            setLoading(false);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError(t('auth.invalidEmail'));
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
            Toast.show({
              type: 'error',
              text1: t('common.error'),
              text2: errorMessage,
            });
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
                {t('forgotPassword.title')}
            </Text>

        </View>
        <Text style={{...styles.createAccountTitle}}>
            {t('forgotPassword.description')}
        </Text>


        <Text style={{...styles.textInputLabel}}>
            {t('auth.email')}
        </Text>

        <TextInput
            placeholder={t('forgotPassword.emailPlaceholder')}
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
                            {t('forgotPassword.sendCode')}
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
                    {t('forgotPassword.checkEmail')}
                 </Text>
                 <Text style={styles.subText}>
                   {t('forgotPassword.emailSent')}
                 </Text>


                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/otp-verification')}
                        style={[styles.continueButton, Platform.OS === 'ios' ? {marginTop: 220 } : {marginTop: 140 }]}
                    >
                            <Text style={styles.continueText}>
                                {t('common.continue')}
                            </Text>
                    </TouchableOpacity>
            </View>

        )}

    </View>
  )
}

export default ForgotPassword
