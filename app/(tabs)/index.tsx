import { startScan } from "@/actions/scan-actions";
import AuditResultCard from "@/components/auditResultCard";
import EmptyState from "@/components/homeScreenEmptyState";
import { useAuthStore } from "@/store/auth-store";
import { useSitesStore } from "@/store/sites-store";
import styles from "@/stylesheets/homeScreenStylesheet";
import { getPersistentDeviceInfo } from "@/utils/device-id";
import { normalizeUrl, validateWebsiteUrl } from "@/utils/url-validation";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from "@expo/vector-icons/Octicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";




export default function HomeScreen() {
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [urlAvailable, setUrlAvailable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const { isAuthenticated } = useAuthStore();
  const { sites, isLoading, fetchSites, createSite } = useSitesStore();

  useEffect(() => {
    fetchSites();

    const testDeviceId = async () => {
      const info = await getPersistentDeviceInfo();
      console.log(" DEVICE INFO:", info);
    };

    testDeviceId();

  }, [fetchSites]);



  const handleUrlChange = (text: string) => {
    setWebsiteUrl(text);
    if (!urlAvailable || errorMessage) {
      setUrlAvailable(true);
      setErrorMessage('');
    }
  };

  const RunAudit = async () => {
    const validation = validateWebsiteUrl(websiteUrl);

    if (!validation.isValid) {
      setUrlAvailable(false);
      setErrorMessage(validation.error);
      return;
    }

    setUrlAvailable(true);
    setErrorMessage('');
    setIsCreating(true);

    try {
      const trimmedUrl = websiteUrl.trim();
      const normalizedUrl = normalizeUrl(trimmedUrl);
      console.log(normalizedUrl);
      if (isAuthenticated) {
        const site = await createSite(normalizedUrl);
        console.log(site);
      }
      const scanResponse = await startScan(normalizedUrl);

      setWebsiteUrl('');

      router.push({
        pathname: "/(main)/auditing-screen",
        params: {
          url: normalizedUrl,
          jobId: scanResponse.job_id,
        },
      });
    } catch (error) {
      setUrlAvailable(false);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to start scan. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  const formatTimeAgo = (dateString?: string): string => {
    if (!dateString) return '0';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    return diffInHours.toString();
  };

  const getStatusFromScore = (score?: number): "Passed" | "Average" | "Failed" => {
    if (!score) return "Average";
    if (score >= 80) return "Passed";
    if (score >= 50) return "Average";
    return "Failed";
  };

  return (
    <SafeAreaView
      style={styles.container}>

      <TouchableOpacity style={styles.notificationContainer} onPress={() => router.push('/(main)/notifications')}>
        <Octicons name="bell" size={24} color="black" />
      </TouchableOpacity>


      <View style={styles.headingSection}>
        <Text style={styles.title}>Improve your website with a quick scan</Text>
        <Text style={styles.sub}>
          Quick AI review with clear action steps
        </Text>
      </View>


      {Platform.OS === "ios" ?
        (
          <View style={[styles.inputPlaceholder, { borderColor: !urlAvailable ? "#d32f2f" : "#C7C8C9", }]}>
            <MaterialCommunityIcons
              name="web" size={15}
              color="#A0A0A0"
              style={styles.webIcon}
            />
            <TextInput
              placeholder="Enter your website URL"
              placeholderTextColor={"#A0A0A0"}
              style={styles.placeholderText}
              value={websiteUrl ? websiteUrl.toLowerCase() : ''}
              onChangeText={handleUrlChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
        ) :
        (
          <View style={[styles.androidInputPlaceholder, { borderColor: !urlAvailable ? "#d32f2f" : "#C7C8C9", }]}>
            <MaterialCommunityIcons
              name="web" size={15}
              color="#A0A0A0"
              style={styles.webIcon}
            />
            <TextInput
              placeholder="Enter your website URL"
              placeholderTextColor={"#A0A0A0"}
              style={styles.androidPlaceholderText}
              value={websiteUrl ? websiteUrl.toLowerCase() : ''}
              onChangeText={handleUrlChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
        )}

      {!urlAvailable && errorMessage && (
        <Text style={styles.invalidLink}>{errorMessage}</Text>
      )}



      <TouchableOpacity
        onPress={RunAudit}
        style={styles.runButton}
        disabled={isCreating}
      >
        {isCreating ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.runButtonText}>Start Scan</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Recent audits</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#F04438" />
          </View>
        ) : sites.length === 0 ? (
          <>
            <EmptyState />

            <View style={styles.tipBox}>
              <View style={styles.buldIcon}>
                <MaterialCommunityIcons name="lightbulb-on-10" size={24} color="black" />
              </View>
              <Text style={styles.tipText}>
                Join 2000+ business owners who have improved their sales with Sitelytics
              </Text>
            </View>
          </>
        ) : (
          sites
            .filter((site) => site.status !== 'deleted')
            .map((site) => (
              <AuditResultCard
                key={site.id}
                url={site.root_url}
                status={getStatusFromScore(undefined)}
                score="0"
                time={formatTimeAgo(site.created_at)}
              />
            ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>



    </SafeAreaView>
  );
}
