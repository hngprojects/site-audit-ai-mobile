import { getDiscoveredPages } from '@/actions/scan-actions';
import type { PageDiscoveryResult } from '@/lib/scan-service';
import styles from '@/stylesheets/pages-result-stylesheet';
import { useTranslation } from '@/utils/translations';
import { FontAwesome6 } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PagesResultScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const route = useRoute();
  const params = route.params as any;

  const url = Array.isArray(params?.url) ? params.url[0] : params?.url;

  const [discoveryResult, setDiscoveryResult] = useState<PageDiscoveryResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiscoveredPages = async () => {
      try {
        const result = await getDiscoveredPages('mock-discovery-job');
        setDiscoveryResult(result);
      } catch (error) {
        console.error('Failed to fetch discovered pages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoveredPages();
  }, []);

  const handleScanPage = (pageUrl: string) => {
    // Navigate to auditing screen with the specific page URL to scan
    router.push({
      pathname: '/(main)/auditing-screen',
      params: { url: pageUrl, isReRun: 'true' }
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F04438" />
          <Text style={styles.loadingText}>Loading discovered pages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!discoveryResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load discovered pages</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (discoveryResult.pages.length === 0) {
    // Navigate to no pages found screen
    router.replace({
      pathname: '/(main)/no-pages-found-screen',
      params: { url: url }
    });
    return null; // Return null while navigating
  }

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

      <ScrollView style={styles.content}>
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

        <Text style={styles.subtitle}>
          Scan your most important pages to make sure customers do not miss anything
        </Text>

        <View style={styles.pagesContainer}>
          {discoveryResult.pages.map((page, index) => (
            <View key={page.id} style={styles.pageCard}>
              <View style={styles.pageHeader}>
                <Text style={styles.pageName}>{page.name}</Text>
                <View style={[
                  styles.priorityBadge,
                  page.priority === 'High Priority' && styles.highPriorityBadge,
                  page.priority === 'Medium Priority' && styles.mediumPriorityBadge,
                  page.priority === 'Low Priority' && styles.lowPriorityBadge,
                ]}>
                  <Text style={[
                    styles.priorityText,
                    page.priority === 'High Priority' && styles.highPriorityText,
                    page.priority === 'Medium Priority' && styles.mediumPriorityText,
                    page.priority === 'Low Priority' && styles.lowPriorityText,
                  ]}>
                    {page.priority}
                  </Text>
                </View>
              </View>

              <Text style={styles.pageUrl}>{page.url}</Text>
              <Text style={styles.pageDescription}>{page.description}</Text>

              <TouchableOpacity onPress={() => handleScanPage(page.url)} >
                <View style={styles.scanButton}>
                  <Text style={styles.scanButtonText}>
                    Scan Page
                  </Text>
                  <FontAwesome6 name="arrow-right-long" size={18} color="#3F5BD9" style={styles.scanButtonArrow} />
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PagesResultScreen;