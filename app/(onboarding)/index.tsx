import { storage, STORAGE_KEYS } from "@/lib/storage";
import styles from "@/stylesheets/onboarding-stylesheet";
import { Link, RelativePathString, useRouter } from "expo-router";
import {
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";




const Onboarding = () => {
  const router = useRouter();
  const inset = useSafeAreaInsets();



  const handleNext = async () => {
    try {
      console.log('📝 Onboarding - Setting completion status...');
      // Mark onboarding as completed and navigate to homepage
      await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
      console.log('💾 Onboarding - Storage setItem completed');

      // Verify the value was stored correctly
      const stored = await storage.getItem<boolean>(STORAGE_KEYS.ONBOARDING_COMPLETED);
      console.log('🔍 Onboarding - Verification check:', {
        key: STORAGE_KEYS.ONBOARDING_COMPLETED,
        stored: stored,
        type: typeof stored,
        isTrue: stored === true,
      });

      if (stored === true) {
        console.log('✅ Onboarding - Storage verified, navigating to tabs');
        router.replace('/(tabs)/' as RelativePathString);
      } else {
        console.error('❌ Failed to persist onboarding completion status. Stored value:', stored);
        // Still navigate even if storage fails
        router.replace('/(tabs)/' as RelativePathString);
      }
    } catch (error) {
      console.error('❌ Error saving onboarding status:', error);
      // Still navigate even if storage fails
      router.replace('/(tabs)/' as RelativePathString);
    }
  };

  return (
    <View style={{ ...styles.container, paddingTop: inset.top, paddingBottom: inset.bottom - 15, paddingHorizontal: "5%" }}>

      <Image
        source={require('../../assets/images/onboarding.png')}
        style={styles.image}
        resizeMode="contain"
      />


      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Turn Your Website Into a Sales Driving Machine
        </Text>
        <Text style={styles.subtitle}>
          Trusted by businesses who want their websites to bring in more customers.
        </Text>
      </View>



      {Platform.OS === "ios" ? (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Get Started</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.androidNextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Get Started</Text>
        </TouchableOpacity>
      )}

      <View style={styles.privacyContainer}>
        <Text style={styles.privacyPolicy}>
          By continuing you accept our <Link href={'../(profile)/privacy-policy'} style={styles.link}>Terms & Conditions</Link>
        </Text>
        <Text style={styles.privacyPolicy}>
          and <Link href={'../(profile)/privacy-policy'} style={styles.link}>Privacy Policy</Link>
        </Text>
      </View>

    </View>
  );
}

export default Onboarding;
