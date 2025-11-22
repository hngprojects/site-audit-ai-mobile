import AuditResultCard from "@/components/auditResultCard";
import EmptyState from "@/components/homeScreenEmptyState";
import styles from '@/stylesheets/homeScreenStylesheet';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Octicons from "@expo/vector-icons/Octicons";
import { useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";


export default function HomeScreen() {
  const inset = useSafeAreaInsets();
 // const router = useRouter();
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [urlAvailable , setUrlAvailable ] = useState<boolean>(true);
  


  const [audits] = useState([
    { url: "http://www.figma.com", status: "Passed" },
    { url: "http://www.figma.com", status: "Average" },
    { url: "http://www.figma.com", status: "Average" },
  ]);

  const RunAudit = () => {
    if(websiteUrl === "")
      return setUrlAvailable( false)
    
  }

  return (
    <SafeAreaView edges={['top']}
      style={{
        paddingTop: inset.top,
        paddingBottom: inset.bottom - 40,
        ...styles.container,
      }}
    >
     
      <TouchableOpacity style={styles.notificationContainer}>
        <Octicons name="bell" size={24} color="black" />
      </TouchableOpacity>

      
        <View style={styles.headingSection}>
          <Text style={styles.title}>Improve your website with a quick scan</Text>
          <Text style={styles.sub}>
            Quick AI review with clear action steps
          </Text>
        </View>

       
        <View style={[styles.inputPlaceholder, {borderColor: !urlAvailable ? "#d32f2f" : "#bbbcbc",}]}>
          <MaterialCommunityIcons 
            name="web" size={24} 
            color="#A0A0A0" 
            style={styles.webIcon}
          />
          <TextInput
            placeholder="Enter your website URL"
            placeholderTextColor={"#A0A0A0"}
            style={styles.placeholderText}
            onChangeText={x => setWebsiteUrl(x)}
          />
        </View>
        {!urlAvailable && (
          <Text style={styles.invalidLink}>Invalid link. Please try again</Text>
        )}

      

         <TouchableOpacity 
        onPress={RunAudit}
        style={styles.runButton}
      >
        <Image 
          source={require("../../assets/images/Logo1.png")}
          style={
            styles.runButtonImage
          }
          resizeMode="contain"
        />
        <Text style={styles.runButtonText}>Start Scan</Text>
      </TouchableOpacity>

        
        <Text style={styles.sectionTitle}>Recent audits</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
       
        {audits.length === 0 ? (
          <>
          <EmptyState />

          <View style={styles.tipBox}>
            <View style={styles.buldIcon}>
              <MaterialCommunityIcons name="lightbulb-on-10" size={24} color="black" />
            </View>
            <Text style={styles.tipText}>
              Join 2000+ business owners who have improved their sales with Sitelytics
            </Text>
          </View>
        </>
        ) : (
          audits.map((item, index) => (
            <AuditResultCard
              key={index}
              url={item.url}
              status={item.status as any}
              score="70"
              time="5"
            />
          ))
        )}

        <View style={{ height: 100 }} /> 
      </ScrollView>

   
     
    </SafeAreaView>
  );
}