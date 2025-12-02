import { resendResetToken } from '@/actions/auth-actions';
import styles from "@/stylesheets/otpVerificationStylesheet";
import { useResetPasswordEmailStore } from "@/zustardStore/resetPasswordEmailStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

const OTPVerification = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();

  const [otpCode, setOtpCode] = useState<string>('');
  const [otpFilled, setOtpFilled] = useState<boolean>(false);
  const [invalidOtp, setInvalidOtp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);

  // Get mode and email from params
  const mode = params.mode as string || 'reset'; // 'reset' or 'signup'
  const emailFromParams = params.email as string;

  // Always call hooks at the top level
  const passwordRecoveryEmail = useResetPasswordEmailStore((state) => state.passwordRecoveryEmail);
  const setOtpToken = useResetPasswordEmailStore((state) => state.setOtpToken);

  const emailWeSentYourCode = mode === 'reset'
    ? passwordRecoveryEmail
    : emailFromParams;

  const confirmCode = async () => {
    setLoading(true);
    try {
      if (mode === 'reset') {
        // Password reset flow
        setOtpToken(otpCode);
        router.push("./new-password");
      } else if (mode === 'signup') {
        // Signup verification flow - verify OTP and sign in
        // TODO: Implement signup OTP verification API call
        // For now, show success message
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Email verified successfully! You can now sign in.',
        });
        // Navigate back to sign in
        setTimeout(() => {
          router.replace('/(auth)/sign-in');
        }, 2000);
      }
    } catch (error) {
        console.error('Error in confirmCode:', error);
        setInvalidOtp(true);
        setOtpFilled(false);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Invalid verification code. Please try again.',
        });
    } finally {
        setLoading(false);
    }
  }

  const handleResend = async () => {
    if (!emailWeSentYourCode) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `Email not found. Please start the ${mode === 'reset' ? 'password reset' : 'sign up'} process again.`,
      });
      return;
    }

    setResending(true);
    try {
      if (mode === 'reset') {
        await resendResetToken(emailWeSentYourCode);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Reset code has been resent to your email.',
        });
      } else if (mode === 'signup') {
        // TODO: Implement signup resend API call
        // For now, show a message
        Toast.show({
          type: 'info',
          text1: 'Info',
          text2: 'Please check your email for the verification code.',
        });
      }
      setOtpCode('');
      setOtpFilled(false);
      setInvalidOtp(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend code. Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    } finally {
      setResending(false);
    }
  }

  return (
    <TouchableWithoutFeedback
    onPress={Keyboard.dismiss}
    >
     <KeyboardAvoidingView
        behavior={"padding"}
        style={{
          ...styles.container,
          paddingTop: insets.top , 
          paddingBottom: insets.bottom - 30
        }}
      >
        <View style= {styles.headerSection}>
            <TouchableOpacity 
            onPress={router.back}
            style={styles.backarrow}>
                 <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.headerText}>
                Verification
            </Text>
            
        </View>


      <Text style={styles.subTitle}>
        We&apos;ve sent a 6-digit code to{" "}
        <Text style={styles.email}>{emailWeSentYourCode}</Text>. Enter it
        below to {mode === 'reset' ? 'reset your password' : 'verify your account'}.
      </Text>

    
      <OtpInput
        numberOfDigits={6}
        focusColor={"#FF6A45"}
        theme={{
          containerStyle: styles.otpContainer,
          pinCodeContainerStyle:{ 
            ...styles.otpBox, 
            borderColor: invalidOtp ?  "#d32f2f":"#DDD"
        },
          pinCodeTextStyle: styles.otpText, 
        }}
        onTextChange={(text) => {
          setOtpCode(text);
          setInvalidOtp(false);
        }}
        onFilled={(text) => {
          setOtpCode(text);
          setOtpFilled(true);
        }}
      />

      {invalidOtp && (
        <Text style={styles.invalidCode}>
            Invalid code, check your email and try again
        </Text>
      )}

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
            Didn&apos;t receive a code?
        </Text>
        <TouchableOpacity 
          onPress={handleResend}
          disabled={resending}
        >
             <Text style={styles.resend}>
               {resending ? 'Resending...' : 'Resend'}
             </Text>
        </TouchableOpacity>
      </View>
      

      {loading ? (
        <ActivityIndicator 
          size="large" 
          color="#ff5a3d" 
          style={{marginTop: 420}} 
        />
      ) : (
        <View style={Platform.OS === 'ios' ? {...styles.iosButtonView} : {...styles.buttonView}}>
          <TouchableOpacity
            disabled={!otpFilled}
            style={{...styles.continueBtnActive,
              backgroundColor: !otpFilled ? "#e0e1e2" : "#FF6A45",
            }}
            onPress={confirmCode}
          >
            <Text style={{...styles.continueBtnText,
                 color: !otpFilled ? "#b9b9b9" : "#FFF",
            }}>
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}


export default  OTPVerification;
