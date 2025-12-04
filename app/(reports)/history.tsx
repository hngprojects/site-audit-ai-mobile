import styles from '@/stylesheets/history-stylesheet';
import { useTranslation } from '@/utils/translations';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
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

interface HistoryItem {
  id: string;
  url: string;
  score: number;
  scanDate: string;
  scanTime: string;
  date: Date;
}

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

  const mockHistoryData = useMemo<HistoryItem[]>(() => {
    const now = new Date();
    return [
      {
        id: '1',
        url: siteUrl,
        score: 85,
        scanDate: 'Dec 15, 2024',
        scanTime: '10:30 AM',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 0)
      },
      {
        id: '2',
        url: siteUrl,
        score: 82,
        scanDate: 'Dec 10, 2024',
        scanTime: '2:15 PM',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3)
      },
      {
        id: '3',
        url: siteUrl,
        score: 78,
        scanDate: 'Dec 5, 2024',
        scanTime: '9:45 AM',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5)
      },
      {
        id: '4',
        url: siteUrl,
        score: 80,
        scanDate: 'Nov 28, 2024',
        scanTime: '4:20 PM',
        date: new Date(now.getFullYear(), now.getMonth() - 1, 28)
      },
    ];
  }, [siteUrl]);

  const groupedData = useMemo(() => {
    const searchTerm = search.toLowerCase();
    const filtered = mockHistoryData.filter(item =>
      item.url.toLowerCase().includes(searchTerm) || item.scanDate.toLowerCase().includes(searchTerm)
    );

    const sorted = [...filtered].sort((a, b) => b.date.getTime() - a.date.getTime());
    const monthGroups = new Map<string, Map<string, HistoryItem[]>>();

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
  }, [search, mockHistoryData, formatMonthHeader, formatDateHeader]);

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
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <Text style={styles.siteName} numberOfLines={1} ellipsizeMode="tail">
              {siteName}
            </Text>
            <TouchableOpacity onPress={handleSelectButton}>
              <Text style={styles.selectButton}>{getSelectButtonText()}</Text>
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
            />
          </View>

          <SectionList
            sections={groupedData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listWrap}
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
                  onPress={() => isSelectionMode && toggleSelection(item.id)}
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
                    <Text style={styles.scoreText}>Score: {item.score}/100</Text>
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
        </View>
      </KeyboardAvoidingView>
    </GestureHandlerRootView>
  );
};

export default HistoryScreen;

