import { getScanHistory, getScanSummary } from "@/actions/scan-actions";
import styles from "@/stylesheets/report-screen-stylesheet";
import { ReportItemProps } from "@/type";
import {
  getUniqueSitesWithLatestScan,
  transformUniqueSiteToReportItem,
  type ReportItemFromHistory,
} from "@/utils/history-utils";
import { useTranslation } from "@/utils/translations";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from 'react-native-toast-message';

const SkeletonCard = () => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonLeft}>
      <View style={[styles.skeletonText, { width: 200, height: 16, marginBottom: 12 }]} />
      <View style={[styles.skeletonText, { width: 150, height: 14, marginBottom: 8 }]} />
      <View style={[styles.skeletonText, { width: 120, height: 12 }]} />
    </View>
    <View style={styles.skeletonRight}>
      <View style={[styles.skeletonText, { width: 100, height: 14 }]} />
    </View>
  </View>
);

interface ReportRowProps {
  item: ReportItemProps;
  url: string;
  onPress: () => void;
}

const ReportRow: React.FC<ReportRowProps> = ({ item, url, onPress }) => {
  return (
    <TouchableOpacity style={styles.reportCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <Text style={styles.urlText} numberOfLines={1}>{url}</Text>
          <Text style={styles.scanDateText}>{item.scanDate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ReportsScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportItemFromHistory[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);

        // Fetch all history
        const allHistory = await getScanHistory();
        console.log('Fetched history count:', allHistory.length);
        console.log('Raw history data:', JSON.stringify(allHistory, null, 2));

        if (allHistory.length === 0) {
          console.log('No history found');
          setReportData([]);
          setIsLoading(false);
          return;
        }

        // Get unique sites with latest scan
        const uniqueSites = getUniqueSitesWithLatestScan(allHistory);
        console.log('Unique sites count:', uniqueSites.length);

        if (uniqueSites.length === 0) {
          console.log('No unique sites found');
          setReportData([]);
          setIsLoading(false);
          return;
        }

        // Get job IDs for score fetching (only for latest scans)
        const jobIds = uniqueSites.map(site => site.latestScan.id);
        console.log('Job IDs to fetch scores for:', jobIds.length);

        // Fetch scores for all unique sites
        const scoreMap = new Map<string, number>();
        await Promise.all(
          jobIds.map(async (jobId) => {
            try {
              const summary = await getScanSummary(jobId);
              scoreMap.set(jobId, summary.website_score);
            } catch (error) {
              console.error(`Failed to fetch score for job ${jobId}:`, error);
              // Continue even if one score fails
            }
          })
        );

        console.log('Score map size:', scoreMap.size);

        // Transform to report items
        const transformedItems = uniqueSites.map((site) =>
          transformUniqueSiteToReportItem(site, scoreMap)
        );

        console.log('Transformed items count:', transformedItems.length);
        console.log('Sample transformed item:', transformedItems[0]);

        setReportData(transformedItems);
      } catch (error) {
        console.error('Failed to fetch report data:', error);
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: error instanceof Error ? error.message : 'Failed to load reports. Please try again.',
        });
        setReportData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportData();
  }, [t]);

  const filteredData = React.useMemo(() => {
    try {
      const filtered = reportData.filter(item => {
        const domain = (item.domain || '').toString();
        const url = (item.url || '').toString();
        const searchTerm = (search || '').toString();
        return domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
          url.toLowerCase().includes(searchTerm.toLowerCase());
      });
      console.log('Filtered data count:', filtered.length, 'from', reportData.length);
      return filtered;
    } catch (error) {
      console.error('Error filtering search results:', error);
      // Return all data if filtering fails
      return reportData;
    }
  }, [reportData, search]);

  // Note: Delete and edit functionality removed since we're working with scan history
  // History data is read-only


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View
          style={[
            styles.container,
            { paddingTop: insets.top, paddingBottom: insets.bottom },
          ]}
        >
          <View style={styles.headerWrap}>
            <Text style={styles.title}>{t('reports.title')}</Text>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color="#c0c0c0ff" />
            <TextInput
              placeholder={t('common.search')}
              placeholderTextColor="#9CA3AF"
              style={styles.searchText}
              onChangeText={x => setSearch(x)}
              value={search}
            />
          </View>


          {isLoading ? (
            <View style={styles.listWrap}>
              <SkeletonCard />
              <View style={styles.separator} />
              <SkeletonCard />
              <View style={styles.separator} />
              <SkeletonCard />
              <View style={styles.separator} />
              <SkeletonCard />
            </View>
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item.jobId || item.siteId}
              contentContainerStyle={styles.listWrap}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const reportItem: ReportItemProps = {
                  domain: item.domain,
                  score: item.score,
                  status: item.status,
                  scanDate: item.scanDate,
                  onPress: () => {
                    // Navigate to history page
                    router.push({
                      pathname: "/(reports)/history",
                      params: {
                        url: item.url,
                      }
                    });
                  },
                };
                return (
                  <ReportRow
                    item={reportItem}
                    url={item.url}
                    onPress={reportItem.onPress}
                  />
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListFooterComponent={<View style={styles.footerSpacer} />}
              ListEmptyComponent={
                <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                  <Text style={{ color: '#9CA3AF', fontSize: 14 }}>{t('reports.noReports')}</Text>
                </View>
              }
            />
          )}

          <View style={[styles.bottomButtonContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            <TouchableOpacity
              style={styles.startNewScanButton}
              onPress={() => router.push('/(tabs)/')}
              activeOpacity={0.8}
            >
              <Text style={styles.startNewScanText}>{t('reports.startNewScan')}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default ReportsScreen;