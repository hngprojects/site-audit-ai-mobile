import { authService, MIN_PASSWORD_LENGTH } from '@/lib/auth-service';
import { getNewPasswordStyles } from "@/Stylesheets/newPasswordStylesheet";
import { useResetPasswordEmailStore } from '@/zustardStore/resetPasswordEmailStore';
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from '@/constants/theme';

export default function NewPassword() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme() ?? 'light';
  const styles = getNewPasswordStyles(colorScheme);
  const colors = Colors[colorScheme];

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
            setError("Passwords do not match");
            setLoading(false);
            return;   
        }

        if (password === "" || confirmPassword === "") {
            setMismatchedPassword(true);
            setError("Please enter your desired password");
            setLoading(false);
            return;   
        }

        if (password.length < MIN_PASSWORD_LENGTH) {
            setMismatchedPassword(true);
            setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
            setLoading(false);
            return;
        }

        if (!email || !otpToken) {
            setError("Missing email or verification token. Please start the process again.");
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
            Alert.alert('Error', errorMessage);
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
                <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
      
            <Text style={styles.headerText}>
                New Password
            </Text>
                  
        </View>

      <Text style={styles.subTitle}>
        Your new password must be different from the previous one.
      </Text>

  
   
        <Text style={styles.label}>
            Password
        </Text>
      
            <View style={{
                ...styles.input,
                borderColor: mismatchedPassword ? colors.tint : colors.icon,
                }}
            >
                  <TextInput
                      placeholder="***********"
                      style={styles.passwordTextInput}
                      placeholderTextColor={colors.placeholder}
                      value={password}
                      onChangeText={x => setPassword(x)}
                      secureTextEntry={secureTextEntry}
                  />
      
                  {secureTextEntry ? 
                      <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                          <Feather name="eye-off" size={24} color={colors.icon} />
                      </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                      <Feather name="eye" size={24} color={colors.icon} />
                  </TouchableOpacity>
                  }
      
            </View>


        <Text style={styles.label}>
            Confirm Password
        </Text>
      
            <View style={{
                ...styles.input,
                borderColor: mismatchedPassword ? colors.tint : colors.icon,
                }} 
            >
                  <TextInput
                      placeholder="***********"
                      style={styles.passwordTextInput}
                      placeholderTextColor={colors.placeholder}
                      value={confirmPassword}
                      onChangeText={x => setConfirmPassword(x)}
                      secureTextEntry={secureTextEntry}
                  />
      
                  {secureTextEntry ? 
                      <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                          <Feather name="eye-off" size={24} color={colors.icon} />
                      </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                      <Feather name="eye" size={24} color={colors.icon} />
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
                    color={colors.tint} 
                    style={{marginTop: 20}} 
                />
            ) : (
                <TouchableOpacity
                    style={styles.resetBtn}
                    onPress={Reset}
                >
                    <Text style={styles.resetBtnText}>Reset</Text>
                </TouchableOpacity>
            )}
    </View>
  );
}