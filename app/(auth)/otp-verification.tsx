import { resendResetToken } from '@/actions/auth-actions';
import styles from "@/stylesheets/otpVerificationStylesheet";
import { useTranslation } from '@/utils/translations';
import { useResetPasswordEmailStore } from "@/zustardStore/resetPasswordEmailStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import Toast from 'react-native-toast-message';
import { OtpInput } from "react-native-otp-entry";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const OTPVerification = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [otpCode, setOtpCode] = useState<string>('');
  const [otpFilled, setOtpFilled] = useState<boolean>(false);
  const [invalidOtp, setInvalidOtp] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [resending, setResending] = useState<boolean>(false);
  

  const emailWeSentYourCode = useResetPasswordEmailStore((state) => state.passwordRecoveryEmail);
  const setOtpToken = useResetPasswordEmailStore((state) => state.setOtpToken);

  const confirmCode = () => {
    setLoading(true);
    try {
        setOtpToken(otpCode);
        router.push("./new-password")
        
    } catch (error) {
        console.error('Error in confirmCode:', error);
        setInvalidOtp(true)
        setOtpFilled(false)
    } finally {
        setLoading(false);
    }
  }

  const handleResend = async () => {
    if (!emailWeSentYourCode) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('otp.emailNotFound'),
      });
      return;
    }

    setResending(true);
    try {
      await resendResetToken(emailWeSentYourCode);
      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: t('otp.codeResent'),
      });
      setOtpCode('');
      setOtpFilled(false);
      setInvalidOtp(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('otp.resendError');
      Toast.show({
        type: 'error',
        text1: t('common.error'),
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
                {t('otp.verification')}
            </Text>
            
        </View>


      <Text style={styles.subTitle}>
        {t('otp.codeSent')}{" "}
        <Text style={styles.email}>{emailWeSentYourCode}</Text>. {t('otp.enterCode')}
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
            {t('otp.invalidCode')}
        </Text>
      )}

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
            {t('otp.didntReceive')}
        </Text>
        <TouchableOpacity 
          onPress={handleResend}
          disabled={resending}
        >
             <Text style={styles.resend}>
               {resending ? t('otp.resending') : t('otp.resend')}
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
              {t('common.continue')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}


export default  OTPVerification;
