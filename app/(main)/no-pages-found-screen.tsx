import styles from '@/stylesheets/pages-result-stylesheet';
import { useTranslation } from '@/utils/translations';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NoPagesFoundScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const route = useRoute();
  const params = route.params as any;

  const url = Array.isArray(params?.url) ? params.url[0] : params?.url;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back-sharp" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discovery</Text>
      </View>

      <View style={styles.content}>
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
        }}>
          <View style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: "#e3e7ecff",
            borderRadius: 25,
            padding: 3,
            paddingHorizontal: 10,
            alignContent: "center",
          }}>
            <Feather name="link-2" size={15} color="blue" />
            <Text style={{ ...styles.domainText, alignItems: "center", color: "blue", fontSize: 10, }}>{url}/</Text>
          </View>
        </View>

        <View style={styles.noPagesContainer}>
          <Text style={styles.noPagesTitle}>No additional pages found</Text>
          <Text style={styles.noPagesSubtitle}>
            We couldn't find additional pages on your website. This might be because:
          </Text>
          <View style={styles.reasonsList}>
            <Text style={styles.reasonText}>• Your site only has one page</Text>
            <Text style={styles.reasonText}>• Pages aren't linked from the homepage</Text>
            <Text style={styles.reasonText}>• Your site uses complex navigation</Text>
          </View>

          <Text style={styles.whatYouCanDoTitle}>What you can do:</Text>

          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {/* TODO: Navigate to manual URL entry */}}
            >
              <Text style={styles.actionButtonText}>Manually enter page URLs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push({ pathname: '/(reports)/audit-summary-first', params: { url: url } })}
            >
              <Text style={styles.actionButtonText}>Continue to fix homepage issues</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.actionButtonText}>Return to Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => router.push({ pathname: '/(reports)/audit-summary-first', params: { url: url } })}
            >
              <Text style={styles.primaryButtonText}>View Result of Current Scan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NoPagesFoundScreen;
