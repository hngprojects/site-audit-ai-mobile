import ReportCard from "@/components/report-card";
import { useAuditStore } from "@/store/audit-store";
import styles from "@/stylesheets/report-screen-stylesheet";
import { ReportItemProps } from "@/type";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Text,
  TextInput,
  View
} from "react-native";
import { GestureHandlerRootView, PanGestureHandler, State } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SwipeableRowProps {
  item: ReportItemProps;
  onDelete: () => void;
  onPress: () => void;
}

const SwipeableRow: React.FC<SwipeableRowProps> = ({ item, onDelete, onPress }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [swipeThreshold] = useState(-120);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationX, velocityX } = event.nativeEvent;

      if (translationX < swipeThreshold || velocityX < -500) {
        Animated.timing(translateX, {
          toValue: -200,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onDelete();
        });
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
      }
    }
  };

  const deleteIconOpacity = translateX.interpolate({
    inputRange: [-200, -80, 0],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const deleteIconScale = translateX.interpolate({
    inputRange: [-200, -80, 0],
    outputRange: [1, 0.8, 0.5],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.swipeableContainer}>
      <View style={styles.deleteAction}>
        <Animated.View
          style={[
            styles.deleteIconContainer,
            {
              opacity: deleteIconOpacity,
              transform: [{ scale: deleteIconScale }],
            },
          ]}
        >
          <Ionicons name="trash" size={24} color="#FFFFFF" />
        </Animated.View>
      </View>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        activeOffsetX={[-10, 10]}
      >
        <Animated.View
          style={[
            styles.swipeableContent,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <ReportCard
            domain={item.domain}
            score={item.score}
            status={item.status}
            scanDate={item.scanDate}
            onPress={onPress}
          />
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const ReportsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const auditHistory = useAuditStore((state) => state.auditHistory);
  const removeFromHistory = useAuditStore((state) => state.removeFromHistory);
  const setAuditResult = useAuditStore((state) => state.setAuditResult);

  const router = useRouter();

  const data: (ReportItemProps & { id: string })[] = auditHistory.map((item) => ({
    id: item.id,
    domain: item.domain,
    score: item.score,
    status: item.status,
    scanDate: item.scanDate,
    onPress: () => {},
  }));

  const filteredData = data.filter(item =>
    item.domain.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    removeFromHistory(id);
  };


  useEffect(() => {
  setLoading(true); 

  const timer = setTimeout(() => {
    setLoading(false);  
  }, 2000);

  return () => clearTimeout(timer);
}, []);


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
        

        {loading ? (
          <ActivityIndicator size="large" color={"#F04438"} style={{ flex: 1, justifyContent: "center", alignItems: "center" }} />
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => (item as any).id || item.domain}
            contentContainerStyle={styles.listWrap}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <SwipeableRow
                item={item}
                onDelete={() => handleDelete((item as any).id)}
                onPress={() => {
                  const auditResult = auditHistory.find(a => a.domain === item.domain);
                  if (auditResult) {
                    setAuditResult(auditResult);
                    router.push({
                      pathname: "../(reports)/report-dashboard",
                    } as any);
                  }
                }}
              />
            )}
            ListFooterComponent={<View style={styles.footerSpacer} />}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default ReportsScreen;