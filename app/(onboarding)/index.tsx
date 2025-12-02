import { storage, STORAGE_KEYS } from "@/lib/storage";
import styles from "@/stylesheets/onboarding-stylesheet";
import { Link, RelativePathString, useRouter } from "expo-router";
import React from "react";
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
   
      // Mark onboarding as completed and navigate to homepage
      await storage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
      router.replace('/(tabs)/' as RelativePathString);

  };

  return (
    <View style={{...styles.container, paddingTop: inset.top, paddingBottom: inset.bottom - 15, paddingHorizontal: "5%"}}>

      <TouchableOpacity
      onPress={handleNext}
        style={styles.skipButton}
       >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

     
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
            Trusted by business owners who wants more profitable website conversion
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
          By continuing you accept our <Link href={'../(profile)/privacy-policy'}style={styles.link}>Privacy Policy</Link> 
        </Text>
      </View>
            
    </View>
  );
}

export default Onboarding;
