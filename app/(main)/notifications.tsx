import { ThemedText } from '@/components/themed-text';
import type { Notification } from '@/service/notifications';
import { deleteNotification, getNotifications, markAsRead } from '@/service/notifications';
import styles from '@/stylesheets/notifications-stylesheet';
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Platform, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const renderRightActions = (_progress: any, _dragX: any) => (
    <TouchableOpacity style={styles.rightAction} onPress={() => onDelete(item.id)}>
      <MaterialIcons name="delete" size={22} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <ReanimatedSwipeable
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
              <Ionicons name="notifications-outline" size={24} color="blue" />
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
    </ReanimatedSwipeable>
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
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not mark notification as read',
      });
    }
  };

  const handleDelete = async (id: string) => {
    // For confirmation dialogs, we'll keep using Alert for now as Toast doesn't support user interaction
    // But we can show a toast after deletion
    try {
      const ok = await deleteNotification(id);
      if (ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Notification deleted successfully',
        });
      }
    } catch (e) {
      console.error('Delete notification error', e);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not delete notification',
      });
    }
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
      {Platform.OS === "ios" ? 
      (
        <>
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
      </>
      ) : (
        <>
        <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <ThemedText style={styles.androidheaderTitle} type="title" >Notification</ThemedText>
        <TouchableOpacity style={styles.markAllButton} onPress={markAllRead} >
          <ThemedText style={styles.markAllTextAndroid}>Mark all as read</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.searchMargin}>
        <View style={styles.androidSearchContainer}>
          <MaterialIcons name="search" size={18} color="#9BA1A6" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Search" placeholderTextColor="#C7C8C9" style={styles.searchInput} />
        </View>
      </View>
      </>
      )}

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
                <Image source={require('@/assets/images/no-message-bell.png')} style={styles.emptyIcon} />
              </View>
              <ThemedText type="subtitle" style={{ marginTop: 12 }}>No message yet</ThemedText>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
