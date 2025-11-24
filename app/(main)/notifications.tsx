import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, TouchableOpacity, Alert, Animated, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import styles from '@/stylesheets/notifications-stylesheet';
import { getNotifications, markAsRead, deleteNotification } from '@/service/notifications';
import type { Notification } from '@/service/notifications';
import { Swipeable } from 'react-native-gesture-handler';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SkeletonCard = () => (
  <View style={[styles.card, styles.skeletonCard]}>
    <View style={styles.cardLeft}>
      <View style={[styles.skeletonText, { width: 180, height: 14 }]} />
      <View style={[styles.skeletonMessage, { width: 220, height: 12 }]} />
    </View>
    <View style={styles.cardRight}>
      <View style={[styles.skeletonTime, { width: 36, height: 12 }]} />
    </View>
  </View>
);

const NotificationItem = ({ item, onMarkRead, onDelete }: { item: Notification; onMarkRead: (id: string) => void; onDelete: (id: string) => void }) => {
  const renderRightActions = (_progress: Animated.AnimatedInterpolation<number>, _dragX: Animated.AnimatedInterpolation<number>) => (
    <TouchableOpacity style={styles.rightAction} onPress={() => onDelete(item.id)}>
      <MaterialIcons name="delete" size={22} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Swipeable
      renderRightActions={renderRightActions}
      friction={2}
      overshootRight={false}
    >
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardTouchable}
          activeOpacity={0.8}
          onPress={() => onMarkRead(item.id)}
        >
          <View style={styles.itemIconContainer}>
            <Image
              source={item.logoThumbnail}
              style={styles.itemIcon}
            />
          </View>

          <View style={styles.cardContent}>
            <View style={styles.titleRow}>
              <ThemedText
                type="defaultSemiBold"
                style={[styles.titleText, { color: item.unread ? '#111' : '#9f9f9fff' }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}
              </ThemedText>

              <ThemedText
                style={[
                  styles.time,
                  { marginLeft: 8, color: item.unread ? '#111' : '#666' },
                ]}
              >
                {item.time}
              </ThemedText>
            </View>

            <ThemedText
              style={[
                styles.message,
                styles.messageText,
                { color: item.unread ? '#444' : '#888' },
              ]}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.message}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
};

export default function NotificationsScreen() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Notifications load error', error);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markAllRead = async () => {
    try {
      // update local state since backend is dummy
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch (e) {
      console.error('Mark all read error', e);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      const ok = await markAsRead(id);
      if (ok) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
      }
    } catch (e) {
      console.error('Mark read error', e);
      Alert.alert('Error', 'Could not mark notification as read');
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this notification?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          const ok = await deleteNotification(id);
          if (ok) setNotifications((prev) => prev.filter((n) => n.id !== id));
        } catch (e) {
          console.error('Delete notification error', e);
          Alert.alert('Error', 'Could not delete notification');
        }
      } },
    ]);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText  type="title">Notification</ThemedText>
        <View style={styles.loadingPadding}>
          <SkeletonCard />
          <View style={{ height: 8 }} />
          <SkeletonCard />
          <View style={{ height: 8 }} />
          <SkeletonCard />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle} type="title" >Notification</ThemedText>
        <TouchableOpacity style={styles.markAllButton} onPress={markAllRead} >
          <ThemedText style={styles.markAllText}>Mark all as read</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.searchMargin}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={18} color="#9BA1A6" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Search" placeholderTextColor="#C7C8C9" style={styles.searchInput} />
        </View>
      </View>

      {error ? (
        <View style={styles.errorPadding}>
          <ThemedText>{error}</ThemedText>
          <TouchableOpacity onPress={load} style={{ marginTop: 12 }}>
            <ThemedText>Try again</ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={notifications.filter((n) => (
            !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase())
          ))}
          keyExtractor={(i) => i.id}
          renderItem={({ item }) => <NotificationItem item={item} onMarkRead={handleMarkRead} onDelete={handleDelete} />}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Image source={require('@/assets/images/bell.png')} style={styles.emptyIcon} />
              </View>
              <ThemedText type="subtitle" style={{ marginTop: 12 }}>No message yet</ThemedText>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
