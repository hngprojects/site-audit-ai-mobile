import DeleteConfirmationSheet from "@/components/delete-confirmation-sheet";
import EditUrlSheet from "@/components/edit-url-sheet";
import { useSitesStore } from "@/store/sites-store";
import styles from "@/stylesheets/report-screen-stylesheet";
import { ReportItemProps, Status } from "@/type";
import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
  url: string;
  onDelete: () => void;
  onEdit: () => void;
  onPress: () => void;
}

const SwipeableRow: React.FC<SwipeableRowProps> = ({ item, url, onDelete, onEdit, onPress }) => {
  const swipeableRef = React.useRef<React.ComponentRef<typeof ReanimatedSwipeable>>(null);

  const renderRightActions = (_progress: any, _dragX: any) => (
    <View style={styles.rightActions}>
      <TouchableOpacity style={styles.editAction} onPress={() => {
        swipeableRef.current?.close();
        onEdit();
      }}>
        <MaterialIcons name="edit" size={20} color="#fff" />
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteAction} onPress={() => {
        swipeableRef.current?.close();
        onDelete();
      }}>
        <MaterialIcons name="delete" size={20} color="#494949" />
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const handleMenuPress = () => {
    swipeableRef.current?.openRight();
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      friction={2}
      overshootRight={false}
    >
      <View style={styles.swipeableContent}>
        <TouchableOpacity style={styles.reportCard} onPress={onPress} activeOpacity={0.7}>
          <View style={styles.cardContent}>
            <View style={styles.cardLeft}>
              <Text style={styles.urlText} numberOfLines={1}>{url}</Text>
              <Text style={styles.scanDateText}>{item.scanDate}</Text>
            </View>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={handleMenuPress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons name="more-vert" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </ReanimatedSwipeable>
  );
};

const ReportsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = React.useState("");
  const [deleteSheetVisible, setDeleteSheetVisible] = useState(false);
  const [editSheetVisible, setEditSheetVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ siteId: string; url: string } | null>(null);
  const [itemToEdit, setItemToEdit] = useState<{ siteId: string; url: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  
  const { sites, isLoading, fetchSites, deleteSite, createSite } = useSitesStore();

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

  const getStatusFromScore = (score?: number): Status => {
    if (!score) return "Warning";
    if (score >= 80) return "Good";
    if (score >= 50) return "Warning";
    return "Critical";
  };

  const mapSiteToReportItem = (site: typeof sites[0]) => {
    const url = site.root_url || '';
    const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '') || 'N/A';
    return {
      siteId: site.id,
      url: site.root_url || '',
      domain,
      score: 0,
      status: getStatusFromScore(undefined),
      scanDate: formatDate(site.created_at),
      onPress: () => {},
    };
  };

  const reportData = sites
    .filter((site) => site.status !== 'deleted')
    .map(mapSiteToReportItem);

  const filteredData = reportData.filter(item =>
    item.domain.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (siteId: string, url: string) => {
    setItemToDelete({ siteId, url });
    setDeleteSheetVisible(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteSite(itemToDelete.siteId).catch((error) => {
        Alert.alert('Error', error instanceof Error ? error.message : 'Failed to delete report');
      });
      setItemToDelete(null);
    }
  };

  const closeDeleteSheet = () => {
    setDeleteSheetVisible(false);
    setItemToDelete(null);
  };

  const handleEdit = (item: typeof filteredData[0]) => {
    setItemToEdit({ siteId: item.siteId, url: item.url });
    setEditSheetVisible(true);
  };

  const handleEditConfirm = async (newUrl: string) => {
    if (!itemToEdit) return;

    setIsEditing(true);
    try {
      // First, mark the old site as inactive (delete)
      await deleteSite(itemToEdit.siteId);
      
      // Then, create the new site
      await createSite(newUrl);
      
      // Refresh the sites list
      await fetchSites();
      
      // Close the sheet
      setEditSheetVisible(false);
      setItemToEdit(null);
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update URL. Please try again.'
      );
    } finally {
      setIsEditing(false);
    }
  };

  const closeEditSheet = () => {
    setEditSheetVisible(false);
    setItemToEdit(null);
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
                  url={item.url}
                  onDelete={() => handleDelete(item.siteId, item.url)}
                  onEdit={() => handleEdit(item)}
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

        <View style={[styles.bottomButtonContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <TouchableOpacity 
            style={styles.startNewScanButton}
            onPress={() => router.push('/(tabs)/')}
            activeOpacity={0.8}
          >
            <Text style={styles.startNewScanText}>Start New Scan</Text>
          </TouchableOpacity>
        </View>

        <DeleteConfirmationSheet
          visible={deleteSheetVisible}
          onClose={closeDeleteSheet}
          onConfirm={confirmDelete}
          url={itemToDelete?.url}
        />

        <EditUrlSheet
          visible={editSheetVisible}
          onClose={closeEditSheet}
          onConfirm={handleEditConfirm}
          currentUrl={itemToEdit?.url || ''}
          isLoading={isEditing}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default ReportsScreen;