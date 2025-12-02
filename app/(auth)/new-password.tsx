import { authService, MIN_PASSWORD_LENGTH } from '@/lib/auth-service';
import styles from "@/stylesheets/newPasswordStylesheet";
import { useTranslation } from '@/utils/translations';
import { useResetPasswordEmailStore } from '@/zustardStore/resetPasswordEmailStore';
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from 'react-native-toast-message';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NewPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [mismatchedPassword, setMismatchedPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const email = useResetPasswordEmailStore((state) => state.passwordRecoveryEmail);
    const otpToken = useResetPasswordEmailStore((state) => state.otpToken);

    const Reset = async () => {
        setLoading(true);
        setError(null);
        setMismatchedPassword(false);

        if (password !== confirmPassword) {
            setMismatchedPassword(true);
            setError(t('changePassword.passwordsDontMatch'));
            setLoading(false);
            return;   
        }

        if (password === "" || confirmPassword === "") {
            setMismatchedPassword(true);
            setError(t('newPassword.passwordRequired'));
            setLoading(false);
            return;   
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            setMismatchedPassword(true);
            setError(t('changePassword.minLength').replace('{min}', String(MIN_PASSWORD_LENGTH)));
            setLoading(false);
            return;
        }

        if (!email || !otpToken) {
            setError(t('newPassword.missingCredentials'));
            setLoading(false);
            return;
        }

        try {
            await authService.verifyForgotPassword(email, otpToken, password);
            router.push("./password-reset-success");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to reset password. Please try again.';
            setError(errorMessage);
            setMismatchedPassword(true);
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
     
       <View style= {styles.headerSection}>
            <TouchableOpacity 
                onPress={router.back}
                style={styles.backarrow}
            >
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
      
            <Text style={styles.headerText}>
                {t('newPassword.title')}
            </Text>
                  
        </View>

      <Text style={styles.subTitle}>
        {t('newPassword.subtitle')}
      </Text>

  
   
        <Text style={styles.label}>
            {t('auth.password')}
        </Text>
      
            <View style={{
                ...styles.input,
                borderColor: mismatchedPassword ? "#d32f2f" : "#babec6",
                }}
            >
                  <TextInput
                      placeholder={t('newPassword.passwordPlaceholder')}
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


        <Text style={styles.label}>
            {t('changePassword.confirmPassword')}
        </Text>
      
            <View style={{
                ...styles.input,
                borderColor: mismatchedPassword ? "#d32f2f" : "#babec6",
                }} 
            >
                  <TextInput
                      placeholder={t('newPassword.passwordPlaceholder')}
                      style={styles.passwordTextInput}
                      placeholderTextColor="#dfdfdfff"
                      value={confirmPassword}
                      onChangeText={x => setConfirmPassword(x)}
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

            {error && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )}

            {loading ? (
                 <ActivityIndicator 
                    size="large" 
                    color="#ff5a3d" 
                    style={{marginTop: 20}} 
                />
            ) : (
                <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={Reset}
                >
                    <Text style={styles.resetBtnText}>{t('newPassword.reset')}</Text>
                </TouchableOpacity>
            )}
    </View>
  );
}
