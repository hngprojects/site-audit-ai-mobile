import styles from "@/Stylesheets/passwordResetSuccessStylesheet";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from "expo-router";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ResetSuccess() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <View style={styles.glowCircle} />
      <View style={styles.glowCircleInner} />
      <FontAwesome6 
        name="check" 
        size={40} 
        color="#125228" 
        style={Platform.OS === 'ios' ? {...styles.iconios} : {...styles.icon}}
      />


      <Text style={styles.title}>Password Reset Successful</Text>
      <Text style={styles.subTitle}>
        Your password has been updated, you can now sign in with your new
        password.
      </Text>

   
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => router.replace("./sign-in")}
      >
        <Text style={styles.continueBtnText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}
