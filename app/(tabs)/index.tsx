import { startScan } from "@/actions/scan-actions";
import AuditResultCard from "@/components/auditResultCard";
import EmptyState from "@/components/homeScreenEmptyState";
import { getUnreadCount } from "@/service/notifications";
import { useAuthStore } from "@/store/auth-store";
import { useSitesStore } from "@/store/sites-store";
import type { ScanEvent } from "@/store/useScanStore";
import { useScanStore } from "@/store/useScanStore";
import styles from "@/stylesheets/homeScreenStylesheet";
import { useTranslation } from "@/utils/translations";
import { normalizeUrl, validateWebsiteUrl } from "@/utils/url-validation";
import { Octicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";





export default function HomeScreen() {
  const { t } = useTranslation();

  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [urlAvailable, setUrlAvailable] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const { isAuthenticated } = useAuthStore();
  const { sites, isLoading, fetchSites } = useSitesStore();

  const fetchUnreadCount = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
        setUnreadCount(0);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchSites();
    fetchUnreadCount();
  }, [fetchSites, fetchUnreadCount]);



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

      useScanStore.getState().reset();

      let hasNavigated = false;

      const scanResponse = await startScan(
        normalizedUrl,
        (event, data) => {
          console.log('[HomeScreen] SSE callback received:', {
            event,
            eventType: typeof event,
            hasData: !!data,
            dataKeys: data ? Object.keys(data) : [],
            jobId: data?.job_id,
            progress: data?.progress,
            currentStoreState: {
              jobId: useScanStore.getState().jobId,
              currentEvent: useScanStore.getState().currentEvent,
              progress: useScanStore.getState().progress,
            },
          });

          if (event === 'scan_error' || event === 'scan_failed') {
            console.log('[HomeScreen] Scan error detected, navigating to error screen');
            const errorJobId = data.job_id || useScanStore.getState().jobId;

            setWebsiteUrl('');
            setIsCreating(false);

            router.replace({
              pathname: "/(main)/auditing-error-screen",
              params: {
                url: normalizedUrl,
                jobId: errorJobId || '',
              },
            });
            return;
          }

          try {
            useScanStore.getState().updateFromEvent(event as ScanEvent, data);
            console.log('[HomeScreen] Store updated successfully:', {
              newCurrentEvent: useScanStore.getState().currentEvent,
              newProgress: useScanStore.getState().progress,
            });
          } catch (error) {
            console.error('[HomeScreen] Error updating store:', error);
          }

          if (data.job_id && !useScanStore.getState().jobId) {
            console.log('[HomeScreen] Setting initial job_id in store:', data.job_id);
            useScanStore.getState().setInitial(data.job_id, normalizedUrl);

            if (!hasNavigated) {
              hasNavigated = true;
              setWebsiteUrl('');
              setIsCreating(false);

              console.log('[HomeScreen] Navigating to auditing screen immediately');
              router.push({
                pathname: "/(main)/auditing-screen",
                params: {
                  url: normalizedUrl,
                  jobId: data.job_id,
                },
              });
            }
          }
        }
      );

      if (!hasNavigated && scanResponse.job_id) {
        if (!useScanStore.getState().jobId) {
          useScanStore.getState().setInitial(scanResponse.job_id, normalizedUrl);
        }

        setWebsiteUrl('');
        setIsCreating(false);

        router.push({
          pathname: "/(main)/auditing-screen",
          params: {
            url: normalizedUrl,
            jobId: scanResponse.job_id,
          },
        });
      }
    } catch (error) {
      setUrlAvailable(false);
      setErrorMessage(error instanceof Error ? error.message : t('home.failedToStart'));
    } finally {
      setIsCreating(false);
    }
  };


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

  const inputBorderColor = useMemo(() => (!urlAvailable ? "#d32f2f" : "#C7C8C9"), [urlAvailable]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {isAuthenticated && (
          <TouchableOpacity style={styles.notificationContainer} onPress={() => router.push('/(main)/notifications')}>
            <View>
              <Octicons name="bell" size={24} color="black" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount.toString()}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}


        <View style={styles.headingSection}>
          <Text style={styles.title}>{t('home.title')}</Text>
          <Text style={styles.sub}>
            {t('home.subtitle')}
          </Text>
        </View>


        {Platform.OS === "ios" ?
          (
            <View style={[styles.inputPlaceholder, { borderColor: inputBorderColor }]}>
              <MaterialCommunityIcons
                name="web" size={24}
                color="#A0A0A0"
                style={styles.webIcon}
              />
              <TextInput
                placeholder={t('home.enterUrl')}
                placeholderTextColor={"#A0A0A0"}
                style={styles.placeholderText}
                value={websiteUrl}
                onChangeText={handleUrlChange}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>
          ) :
          (
            <View style={[styles.androidInputPlaceholder, { borderColor: inputBorderColor }]}>
              <MaterialCommunityIcons
                name="web" size={24}
                color="#A0A0A0"
                style={styles.webIcon}
              />
              <TextInput
                placeholder={t('home.enterUrl')}
                placeholderTextColor={"#A0A0A0"}
                style={styles.androidPlaceholderText}
                value={websiteUrl}
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
            <Text style={styles.runButtonText}>{t('home.startScan')}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>{t('home.recentAudits')}</Text>

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
                  {t('home.tip')}
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
