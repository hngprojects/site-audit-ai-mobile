import styles, { reportColors } from "@/stylesheets/report-dashboard-stylesheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import IssueCard from "@/components/issue-card";
import { Status } from "@/type";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';






export default function ReportDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

const params = useLocalSearchParams();

const score = Array.isArray(params.score) ? params.score[0] : params.score;
const status = Array.isArray(params.status) ? params.status[0] : params.status;
const domain = Array.isArray(params.domain) ? params.domain[0] : params.domain;
const scanDate = Array.isArray(params.scanDate) ? params.scanDate[0] : params.scanDate;



  const router = useRouter();



  const statusColor = (s: Status) =>
    s === "low" ? reportColors.scoreLow :
    s === "high" ? reportColors.scoreHigh :
    reportColors.scoreMedium;


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 120);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={{flexDirection: 'row', alignItems: 'center', gap: 20, marginBottom: 20,  paddingHorizontal: 20, paddingTop: 10, marginTop: 35,}}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back-sharp" size={24} color="black" />
          </TouchableOpacity>
        <Text style={styles.pageTitle}>Audit Summary</Text>
        </View>

        

        
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
        }}>
         <View style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#e3e7ecff",
          borderRadius: 25,
          padding: 3,
          paddingHorizontal: 10,
          alignContent: "center",
         }}>
          <Feather name="link-2" size={15} color="blue" />
          <Text style={{...styles.domainText, alignItems: "center", color: "blue",  fontSize: 10,}}>{domain}</Text>
         </View>

         <View style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 3,
          paddingHorizontal: 10,
          alignContent: "center",
         }}>
          <AntDesign name="reload" size={15} color="red" />
          <Text style={{color: "red", alignItems: "center", ...styles.domainText, fontSize: 13}}>Re-run audit</Text>
         </View>
        </View>

        
        <View style={styles.card}>
          <Text style={[styles.scoreText, { color: statusColor(status as Status) }]}>{score}</Text>
          <Text style={{...styles.cardLabel, color: "#000"}}>Website Score</Text>
          <Text style={{...styles.cardLabel, color: "#dfdfdfff"}}>Scan Date: {scanDate}</Text>
          <Text style={{color: "#000", fontFamily: "RethinkSans-Medium", fontSize: 13, marginTop: 20, }}>
            Your website performs wewll but has several issues worth fixing
            </Text>
        </View>

        <View>
          <Text style={{marginLeft: "auto", marginTop: 20, marginBottom: 20, marginRight: 20, color: "blue"}}>Mark All</Text>
        </View>

        <View style={{paddingHorizontal: "5%",}}>

        <IssueCard 
          title="Slow loading speed"
          score={score}
          status={status}
          description="Your website takes longer than average to load, which can affect user experience and SEO."
          noIssuesLabel="No issues with loading speed."
        />
        <IssueCard 
          title="Not Mobile Friendly"
          score={score}
          status={status}
          description="Your website takes longer than average to load, which can affect user experience and SEO."
          noIssuesLabel="No issues with loading speed."
        />
        <IssueCard 
          title="Visibility"
          score={score}
          status={status}
          description="Your website takes longer than average to load, which can affect user experience and SEO."
          noIssuesLabel="No issues with loading speed."
        />
        <IssueCard 
          title="Slow loading speed"
          score={score}
          status={status}
          description="Your website takes longer than average to load, which can affect user experience and SEO."
          noIssuesLabel="No issues with loading speed."
        />
          
        </View>

        <View>
          <Text
          style={{textAlign: "center", marginTop: 12, marginBottom: 10, fontSize: 12, fontFamily: "RethinkSans-Medium", color: "#656566ff",}}
          >
            Get your sales up with a free review from an expert
          </Text>
        </View>
       
        
        
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => setShowModal(true)}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        
        <View style={{ height: 80 }} />
      </ScrollView>

    
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Your website can be better</Text>

            <Text style={styles.modalSubtitle}>
              Dont miss a chance to stay ahead. Get free website monitoring and insights
            </Text>

         <View>
            <TextInput
            placeholder="Enter Email"
            placeholderTextColor={"#dbdbdbff"}
            style={{
              color: "#000",
              borderWidth: 1.5,
              borderColor: "#E5E7EB",
              borderRadius: 5,
              padding: 10,
              marginBottom: 20,
            }}
            />

         </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
