import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/utils/translations';
import styles from '@/stylesheets/history-stylesheet';

interface HistoryItem {
  id: string;
  url: string;
  score: number;
  scanDate: string;
  scanTime: string;
}

const HistoryScreen: React.FC = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  const siteUrl = Array.isArray(params.url) ? params.url[0] : params.url || '';
  const siteName = siteUrl.replace(/^https?:\/\//, '').replace(/^www\./, '') || 'Site';

  const [search, setSearch] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<'month' | 'week'>('month');

  // Mock data - replace with actual API call
  const mockHistoryData: HistoryItem[] = [
    {
      id: '1',
      url: siteUrl,
      score: 85,
      scanDate: 'Dec 15, 2024',
      scanTime: '10:30 AM'
    },
    {
      id: '2',
      url: siteUrl,
      score: 82,
      scanDate: 'Dec 10, 2024',
      scanTime: '2:15 PM'
    },
    {
      id: '3',
      url: siteUrl,
      score: 78,
      scanDate: 'Dec 5, 2024',
      scanTime: '9:45 AM'
    },
    {
      id: '4',
      url: siteUrl,
      score: 80,
      scanDate: 'Nov 28, 2024',
      scanTime: '4:20 PM'
    },
  ];

  const filteredData = useMemo(() => {
    return mockHistoryData.filter(item => {
      const searchTerm = search.toLowerCase();
      return item.url.toLowerCase().includes(searchTerm) ||
        item.scanDate.toLowerCase().includes(searchTerm);
    });
  }, [search, mockHistoryData]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#0EA472';
    if (score >= 50) return '#FF9B2E';
    return '#D72D2D';
  };

  const getScoreStatus = (score: number) => {
    if (score >= 80) return 'Good';
    if (score >= 50) return 'Warning';
    return 'Critical';
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
          {/* Header */}
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
            <TouchableOpacity style={styles.selectButton}>
              <Text style={styles.selectButtonText}>{t('common.select')}</Text>
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
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

          {/* Segments */}
          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                selectedSegment === 'month' && styles.segmentButtonActive
              ]}
              onPress={() => setSelectedSegment('month')}
            >
              <Text
                style={[
                  styles.segmentText,
                  selectedSegment === 'month' && styles.segmentTextActive
                ]}
              >
                {t('history.month')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                selectedSegment === 'week' && styles.segmentButtonActive
              ]}
              onPress={() => setSelectedSegment('week')}
            >
              <Text
                style={[
                  styles.segmentText,
                  selectedSegment === 'week' && styles.segmentTextActive
                ]}
              >
                {t('history.week')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* History List */}
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listWrap}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
                <View style={styles.cardLeft}>
                  <Text style={styles.urlText} numberOfLines={1}>
                    {item.url}
                  </Text>
                  <View style={styles.scoreRow}>
                    <View
                      style={[
                        styles.scoreBadge,
                        { backgroundColor: getScoreColor(item.score) + '20' }
                      ]}
                    >
                      <Text
                        style={[
                          styles.scoreText,
                          { color: getScoreColor(item.score) }
                        ]}
                      >
                        {item.score}
                      </Text>
                    </View>
                    <Text style={styles.scanDateText}>{item.scanDate}</Text>
                  </View>
                </View>
                <View style={styles.cardRight}>
                  <Text style={styles.scanTimeText}>{item.scanTime}</Text>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
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

