import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from "react";
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../Stylesheets/auditing-error-screen-stylesheet";


export default function WebsiteDown() {
  const insets = useSafeAreaInsets();

  const onRequestHelp = () => {
    // TODO: add help function
    console.log("Request Help tapped");
  };

  const onTryAgain = () => {
    // TODO: re-run check / refresh
    console.log("Try Again tapped");
  };

  return (
    <View
      style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      
      <View style={styles.container}>
        
        <View style={styles.topSpacer} />

        
        <View style={styles.iconWrap}>
            <MaterialIcons 
                name="link-off" 
                size={64} 
                color="#d32f2f" 
            />
        </View>

       
        <Text style={styles.title}>Oops! Website is down</Text>

       
        <Text style={styles.bodyPrimary}>
          The site you&apos;re trying to visit is temporarily offline or having technical problems.
        </Text>

        <Text style={styles.bodyHighlight}>But don&apos;t worry, we can help you.</Text>

        <Text style={styles.bodySecondary}>
          Work with our dedicated experts at HNG who can fix this very fast!
        </Text>

       
        <View style={styles.buttonGroup}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={onRequestHelp} 
            >
            <Text style={styles.primaryButtonText}>Request Help</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={onTryAgain} 
            >
            <Text style={styles.secondaryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}