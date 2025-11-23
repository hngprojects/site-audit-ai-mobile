import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, View, TouchableOpacity, Alert, Animated, TextInput, Image } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import styles from '@/stylesheets/notifications-screen-stylesheet';
import { getNotifications, markAsRead, deleteNotification } from '@/service/notifications';
import type { Notification } from '@/service/notifications';
import { Swipeable } from 'react-native-gesture-handler';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const SkeletonCard = () => (
  <View style={[styles.card, { opacity: 0.6, backgroundColor: '#f2f2f2' }]}>
    <View style={styles.cardLeft}>
      <View style={{ width: 180, height: 14, backgroundColor: '#e0e0e0', borderRadius: 6, marginBottom: 8 }} />
      <View style={{ width: 220, height: 12, backgroundColor: '#e9e9e9', borderRadius: 6 }} />
    </View>
    <View style={styles.cardRight}>
      <View style={{ width: 36, height: 12, backgroundColor: '#e0e0e0', borderRadius: 6 }} />
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
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: 12,
            paddingVertical: 10,
          }}
          activeOpacity={0.8}
          onPress={() => onMarkRead(item.id)}
        >
          <View
            style={{
              padding: 12,
              backgroundColor: '#edededff',
              borderRadius: 100,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image
              source={require('@/assets/images/bell.png')}
              style={styles.itemIcon}
            />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <ThemedText
                type="defaultSemiBold"
                style={{ color: item.unread ? '#111' : '#9f9f9fff', flex: 1 }}
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
                { marginTop: 6, color: item.unread ? '#444' : '#888' },
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
      <ThemedView style={styles.container}>
        <ThemedText  type="title">Notification</ThemedText>
        <View style={{ paddingTop: 16 }}>
          <SkeletonCard />
          <View style={{ height: 8 }} />
          <SkeletonCard />
          <View style={{ height: 8 }} />
          <SkeletonCard />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity  style={{ padding: 8 }}>
           <MaterialIcons name="arrow-back" size={18} color="#595959ff" />
        </TouchableOpacity>
        <ThemedText style={{color: '#111' ,fontSize:24}} type="title" >Notification</ThemedText>
        <TouchableOpacity onPress={markAllRead} >
          <ThemedText style={{ color: '#FF6A45' }}>Mark all as read</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={{ marginTop: 12 }}>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={18} color="#9BA1A6" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Search" style={styles.searchInput} />
        </View>
      </View>

      {error ? (
        <View style={{ paddingTop: 16 }}>
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
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32, flexGrow: 1 }}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24 }}>
              <View
                style={{
                  padding: 12,
                  paddingHorizontal: 16,
                  backgroundColor: '#edededc1',
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image source={require('@/assets/images/bell.png')} style={styles.emptyIcon} />
              </View>
              <ThemedText type="subtitle" style={{ marginTop: 12 }}>No message yet</ThemedText>
            </View>
          )}
        />
      )}
    </ThemedView>
  );
}
