import { deleteMultipleScans, getScanHistory, getScanSummary } from '@/actions/scan-actions';
import DeleteConfirmationSheet from '@/components/delete-confirmation-sheet';
import styles from '@/stylesheets/history-stylesheet';
import {
  getHistoryBySiteUrl,
  getJobIdsFromHistory,
  transformHistoryItemForUI,
  type HistoryItemForUI,
} from '@/utils/history-utils';
import { useTranslation } from '@/utils/translations';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SectionList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const SkeletonCard = () => (
  <View style={styles.skeletonCard}>
    <View style={styles.skeletonLeft}>
      <View style={[styles.skeletonText, { width: 200, height: 16, marginBottom: 8 }]} />
      <View style={[styles.skeletonText, { width: 120, height: 14, marginBottom: 6 }]} />
      <View style={[styles.skeletonText, { width: 100, height: 12 }]} />
    </View>
    <View style={styles.skeletonRight}>
      <View style={[styles.skeletonText, { width: 60, height: 12 }]} />
    </View>
  </View>
);

const HistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const siteUrl = Array.isArray(params.url) ? params.url[0] : params.url || '';

  const getSiteName = (url: string): string => {
    if (!url) return 'Site';
    const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('.')[0];
    return domain.charAt(0).toUpperCase() + domain.slice(1).toLowerCase();
  };

  const siteName = getSiteName(siteUrl);

  const [search, setSearch] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [historyItems, setHistoryItems] = useState<HistoryItemForUI[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatMonthHeader = React.useCallback((date: Date) =>
    date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), []);

  const formatDateHeader = React.useCallback((date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);

    if (dateToCheck.getTime() === today.getTime()) return 'Today';
    if (dateToCheck.getTime() === yesterday.getTime()) return 'Yesterday';

    const weekday = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${weekday}. ${month} ${date.getDate().toString().padStart(2, '0')}`;
  }, []);

  // Fetch history data and scores
  useEffect(() => {
    const fetchHistoryData = async () => {
      if (!siteUrl) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Fetch all history
        const allHistory = await getScanHistory();

        // Filter by site URL
        const siteHistory = getHistoryBySiteUrl(allHistory, siteUrl);

        if (siteHistory.length === 0) {
          setHistoryItems([]);
          setIsLoading(false);
          return;
        }

        // Get job IDs for score fetching
        const jobIds = getJobIdsFromHistory(siteHistory);

        // Fetch scores for all history items
        const scoreMapLocal = new Map<string, number>();
        await Promise.all(
          jobIds.map(async (jobId) => {
            try {
              const summary = await getScanSummary(jobId);
              scoreMapLocal.set(jobId, summary.website_score);
            } catch (error) {
              console.error(`Failed to fetch score for job ${jobId}:`, error);
              // Continue even if one score fails
            }
          })
        );

        // Transform history items with scores
        const transformedItems = siteHistory.map((item) =>
          transformHistoryItemForUI(item, scoreMapLocal)
        );

        setHistoryItems(transformedItems);
      } catch (error) {
        console.error('Failed to fetch history:', error);
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: 'Failed to load scan history. Please try again.',
        });
        setHistoryItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoryData();
  }, [siteUrl, t]);

  const groupedData = useMemo(() => {
    const searchTerm = search.toLowerCase();
    const filtered = historyItems.filter(item =>
      item.url.toLowerCase().includes(searchTerm) ||
      item.scanDate.toLowerCase().includes(searchTerm) ||
      (item.score !== undefined && item.score.toString().includes(searchTerm))
    );

    const sorted = [...filtered].sort((a, b) => b.date.getTime() - a.date.getTime());
    const monthGroups = new Map<string, Map<string, HistoryItemForUI[]>>();

    sorted.forEach(item => {
      const monthKey = formatMonthHeader(item.date);
      const dateKey = formatDateHeader(item.date);
      if (!monthGroups.has(monthKey)) monthGroups.set(monthKey, new Map());
      const dateMap = monthGroups.get(monthKey)!;
      if (!dateMap.has(dateKey)) dateMap.set(dateKey, []);
      dateMap.get(dateKey)!.push(item);
    });

    return Array.from(monthGroups.entries()).flatMap(([monthTitle, dateMap]) =>
      Array.from(dateMap.entries()).map(([dateTitle, items]) => ({
        title: `${monthTitle}|${dateTitle}`,
        monthTitle,
        dateTitle,
        data: items
      }))
    );
  }, [search, historyItems, formatMonthHeader, formatDateHeader]);

  const allItemIds = useMemo(() => new Set(groupedData.flatMap(section => section.data.map(item => item.id))), [groupedData]);
  const isAllSelected = selectedItems.size > 0 && selectedItems.size === allItemIds.size;

  const toggleSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      if (newSet.size === 0) setIsSelectionMode(false);
      return newSet;
    });
  };

  const handleSelectButton = () => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
    } else if (isAllSelected) {
      setSelectedItems(new Set());
      setIsSelectionMode(false);
    } else {
      setSelectedItems(new Set(allItemIds));
    }
  };

  const getSelectButtonText = () => {
    if (!isSelectionMode) return t('common.select');
    if (isAllSelected) return t('common.unselect');
    return t('history.selectAll');
  };

  const handleDelete = () => {
    if (selectedItems.size === 0) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedItems.size === 0) return;

    setShowDeleteModal(false);
    setIsDeleting(true);

    try {
      // Get the job IDs for selected items
      const selectedJobIds = historyItems
        .filter(item => selectedItems.has(item.id))
        .map(item => item.jobId);

      const result = await deleteMultipleScans(selectedJobIds);

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: t('common.success'),
          text2: `${result.deleted.length} scan(s) deleted successfully`,
        });

        // Remove deleted items from local state
        setHistoryItems(prev => prev.filter(item => !selectedItems.has(item.id)));
      } else {
        // Some deletions failed
        if (result.deleted.length > 0) {
          Toast.show({
            type: 'info',
            text1: 'Partial Success',
            text2: `${result.deleted.length} deleted, ${result.failed.length} failed`,
          });

          // Remove successfully deleted items from local state
          const deletedJobIdSet = new Set(result.deleted);
          setHistoryItems(prev => prev.filter(item => !deletedJobIdSet.has(item.jobId)));
        } else {
          Toast.show({
            type: 'error',
            text1: t('common.error'),
            text2: 'Failed to delete scans. Please try again.',
          });
        }
      }
    } catch (error) {
      console.error('Delete error:', error);
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : 'Failed to delete scans',
      });
    } finally {
      setIsDeleting(false);
      setSelectedItems(new Set());
      setIsSelectionMode(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const hasSelectedItems = selectedItems.size > 0;

  const handleBackPress = () => {
    if (isSelectionMode) {
      setIsSelectionMode(false);
      setSelectedItems(new Set());
    } else {
      router.back();
    }
  };

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
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.siteName} numberOfLines={1} ellipsizeMode="tail">
              {siteName}
            </Text>
            <TouchableOpacity onPress={handleSelectButton} disabled={isLoading}>
              <Text style={[styles.selectButton, isLoading && { opacity: 0.5 }]}>
                {getSelectButtonText()}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={24} color="#c0c0c0ff" />
            <TextInput
              placeholder={t('common.search')}
              placeholderTextColor="#9CA3AF"
              style={styles.searchText}
              onChangeText={setSearch}
              value={search}
              editable={!isLoading}
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
              <View style={styles.separator} />
              <SkeletonCard />
            </View>
          ) : (
            <SectionList
              sections={groupedData}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[styles.listWrap, isSelectionMode && styles.listWrapWithButton]}
              showsVerticalScrollIndicator={false}
              renderSectionHeader={({ section }) => {
                const sectionIndex = groupedData.findIndex(s => s.title === section.title);
                const showMonthHeader = sectionIndex === 0 || groupedData[sectionIndex - 1].monthTitle !== section.monthTitle;
                return (
                  <View>
                    {showMonthHeader && (
                      <View style={styles.monthHeader}>
                        <Text style={styles.monthHeaderText}>{section.monthTitle}</Text>
                      </View>
                    )}
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionHeaderText}>{section.dateTitle}</Text>
                    </View>
                  </View>
                );
              }}
              renderItem={({ item }) => {
                const isSelected = selectedItems.has(item.id);
                return (
                  <TouchableOpacity
                    style={styles.historyCard}
                    onLongPress={() => {
                      if (!isSelectionMode) {
                        setIsSelectionMode(true);
                        setSelectedItems(new Set([item.id]));
                      }
                    }}
                    onPress={() => {
                      if (isSelectionMode) {
                        toggleSelection(item.id);
                      } else {
                        // Navigate to report dashboard
                        router.push({
                          pathname: '/(reports)/report-dashboard',
                          params: {
                            jobId: item.jobId,
                            url: item.url,
                          },
                        });
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    {isSelectionMode && (
                      <TouchableOpacity
                        style={styles.checkboxContainer}
                        onPress={() => toggleSelection(item.id)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        {isSelected ? (
                          <Ionicons name="checkbox" size={24} color="#FF5A3D" />
                        ) : (
                          <MaterialCommunityIcons name="checkbox-blank-outline" size={24} color="#BBBCBC" />
                        )}
                      </TouchableOpacity>
                    )}
                    <View style={[styles.cardLeft, isSelectionMode && styles.cardLeftWithCheckbox]}>
                      <Text style={styles.urlText} numberOfLines={1}>{item.url}</Text>
                      {item.score !== undefined ? (
                        <Text style={styles.scoreText}>Score: {item.score}/100</Text>
                      ) : (
                        <Text style={styles.scoreText}>Score: Loading...</Text>
                      )}
                      <Text style={styles.scanDateText}>Scan Date: {item.scanDate}</Text>
                    </View>
                    <View style={styles.cardRight}>
                      <Text style={styles.scanTimeText}>{item.scanTime}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              SectionSeparatorComponent={() => <View style={styles.sectionSeparator} />}
              ListFooterComponent={<View style={styles.footerSpacer} />}
              ListEmptyComponent={
                <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                  <Text style={{ color: '#9CA3AF', fontSize: 14 }}>
                    {t('history.noHistory')}
                  </Text>
                </View>
              }
            />
          )}
          {isSelectionMode && (
            <View style={[styles.deleteButtonContainer, { paddingBottom: insets.bottom }]}>
              <TouchableOpacity
                style={[styles.deleteButton, (!hasSelectedItems || isDeleting) && styles.deleteButtonDisabled]}
                onPress={handleDelete}
                disabled={!hasSelectedItems || isDeleting}
                activeOpacity={0.8}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={[styles.deleteButtonText, !hasSelectedItems && styles.deleteButtonTextDisabled]}>
                    {t('common.delete')} {hasSelectedItems && `(${selectedItems.size})`}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Delete Confirmation Sheet */}
          <DeleteConfirmationSheet
            visible={showDeleteModal}
            onClose={cancelDelete}
            onConfirm={confirmDelete}
          />
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default HistoryScreen;

