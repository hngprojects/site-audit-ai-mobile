import { ReportItemProps } from "@/type";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../../Stylesheets/report-screen-stylesheet";
import ReportCard from "../../components/report-card";



const DATA: ReportItemProps[] = [
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



const ReportsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);  

  const router = useRouter();


  const filteredData = DATA.filter(item =>
    item.domain.toLowerCase().includes(search.toLowerCase())
  ) || DATA;


  useEffect(() => {
  setLoading(true); 

  const timer = setTimeout(() => {
    setLoading(false);  
  }, 2000);

  return () => clearTimeout(timer);
}, []);


  return (
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
            <ReportCard
              domain={item.domain}
              score={item.score}
              status={item.status}
              scanDate={item.scanDate}
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
          ListFooterComponent={<View style={styles.footerSpacer} />}
        />
      )}
    </View>
  );
};

export default ReportsScreen;