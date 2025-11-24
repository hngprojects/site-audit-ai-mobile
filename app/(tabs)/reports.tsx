import ReportCard from "@/components/report-card";
import { useSitesStore } from "@/store/sites-store";
import styles from "@/stylesheets/report-screen-stylesheet";
import { ReportItemProps } from "@/type";
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

interface SwipeableRowProps {
  item: ReportItemProps;
  onDelete: () => void;
  onPress: () => void;
}

const SwipeableRow: React.FC<SwipeableRowProps> = ({ item, onDelete, onPress }) => {
  const renderRightActions = (_progress: any, _dragX: any) => (
    <TouchableOpacity style={styles.deleteAction} onPress={() => onDelete()}>
      <MaterialIcons name="delete" size={22} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <ReanimatedSwipeable
      renderRightActions={renderRightActions}
      friction={2}
      overshootRight={false}
    >
      <View style={styles.swipeableContent}>
        <ReportCard
          domain={item.domain}
          score={item.score}
          status={item.status}
          scanDate={item.scanDate}
          onPress={onPress}
        />
      </View>
    </ReanimatedSwipeable>
  );
};

const ReportsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = React.useState("");
  const router = useRouter();
  
  const { sites, isLoading, fetchSites, deleteSite } = useSitesStore();

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusFromScore = (score?: number): "low" | "medium" | "high" => {
    if (!score) return "medium";
    if (score >= 80) return "high";
    if (score >= 50) return "medium";
    return "low";
  };

  const mapSiteToReportItem = (site: typeof sites[0]) => {
    const url = site.root_url || '';
    const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '') || 'N/A';
    return {
      siteId: site.id,
      domain,
      score: 0,
      status: getStatusFromScore(undefined),
      scanDate: formatDate(site.created_at),
      onPress: () => {},
    };
  };

  const reportData = sites
    .filter((site) => !site.deleted_at)
    .map(mapSiteToReportItem);

  const filteredData = reportData.filter(item =>
    item.domain.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (siteId: string, domain: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this report?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteSite(siteId);
        } catch (error) {
          Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete report');
        }
      } },
    ]);
  };


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        style={[
          styles.container,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <View style={styles.headerWrap}>
          <Text style={styles.title}>Report</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={24} color="#c0c0c0ff" />
          <TextInput
            placeholder="Search"
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
            keyExtractor={(item) => item.siteId}
            contentContainerStyle={styles.listWrap}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              return (
                <SwipeableRow
                  item={item}
                  onDelete={() => handleDelete(item.siteId, item.domain)}
                  onPress={() => router.push({
                    pathname: "../(reports)/report-dashboard", 
                    params: {
                      domain: item.domain,
                      score: String(item.score),
                      status: item.status,
                      scanDate: item.scanDate,
                      siteId: item.siteId,
                    }
                  })}
                />
              );
            }}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={<View style={styles.footerSpacer} />}
            ListEmptyComponent={
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <Text style={{ color: '#9CA3AF', fontSize: 14 }}>No reports found</Text>
              </View>
            }
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default ReportsScreen;