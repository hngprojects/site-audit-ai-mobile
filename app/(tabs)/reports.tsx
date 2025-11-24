import ReportCard from "@/components/report-card";
import styles from "@/stylesheets/report-screen-stylesheet";
import { ReportItemProps } from "@/type";
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

const INITIAL_DATA: ReportItemProps[] = [
  {
    domain: "www.fashionsense.com",
    score: 50,
    status: "low",
    scanDate: "Nov 5, 2025",
    onPress: () => {},
  },
  {
    domain: "www.techgate.com",
    score: 86,
    status: "high",
    scanDate: "Nov 3, 2025",
     onPress: () => {},
  },
  {
    domain: "www.cosmos.com",
    score: 40,
    status: "low",
    scanDate: "Oct 30, 2025",
     onPress: () => {},
  },
];

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
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = useState<ReportItemProps[]>(INITIAL_DATA);

  const router = useRouter();

  const filteredData = data.filter(item =>
    item.domain.toLowerCase().includes(search.toLowerCase())
  ) || data;

  const handleDelete = (domain: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this report?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        setData(prevData => prevData.filter(item => item.domain !== domain));
      } },
    ]);
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
            keyExtractor={(item) => item.domain}
            contentContainerStyle={styles.listWrap}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <SwipeableRow
                item={item}
                onDelete={() => handleDelete(item.domain)}
                onPress={() => router.push({
                  pathname: "../(reports)/report-dashboard", 
                  params: {
                    domain: item.domain,
                    score: String(item.score),
                    status: item.status,
                    scanDate: item.scanDate
                  }
                })}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={<View style={styles.footerSpacer} />}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default ReportsScreen;