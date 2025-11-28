import styles from "@/stylesheets/auditing-error-screen-stylesheet";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


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


        <Text style={styles.title}>Oops! URL Didn’t Load</Text>


        <Text style={styles.bodyPrimary}>
          A broken or unreachable link prevented us from scanning this website..
        </Text>

        {/* <Text style={styles.bodyHighlight}>But don&apos;t worry, we can help you.</Text> */}

        <Text style={styles.bodySecondary}>
          Please verify the URL and try once more.
        </Text>


        <View style={styles.buttonGroup}>
          {/* <TouchableOpacity
            style={styles.primaryButton}
            onPress={onRequestHelp}
          >
            <Text style={styles.primaryButtonText}>Request Help</Text>
          </TouchableOpacity> */}

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