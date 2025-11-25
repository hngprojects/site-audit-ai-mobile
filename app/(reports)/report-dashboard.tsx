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
import { useSelectedIssuesStore } from "@/store/audit-summary-selected-issue-store";
import { Status } from "@/type";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';







export default function ReportDashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTextInput, setModalTextInput] = useState<string>('')
  const [emptyModalTextInput, setEmptyModalTextInput] = useState<boolean>(false)

  const { addIssue } = useSelectedIssuesStore();

  const { issues } = useSelectedIssuesStore();


  

const params = useLocalSearchParams();

const score = Array.isArray(params.score) ? params.score[0] : params.score;
const status = Array.isArray(params.status) ? params.status[0] : params.status;
const domain = Array.isArray(params.domain) ? params.domain[0] : params.domain;
const scanDate = Array.isArray(params.scanDate) ? params.scanDate[0] : params.scanDate;




const hireAPro = () => {


  try {
   
    if (issues.length < 1){
      return alert ("Please select the issues you want our professionals to assist you with ")
    }
   
    
    //navigate to  fix/hire professional
    router.push("/(hireRequest)/hire-request");
  } catch (error) {
    console.log(error)
  }
}


  const router = useRouter();



  const statusColor = (s: Status) =>
    s === "Critical" ? reportColors.scoreLow :
    s === "Good" ? reportColors.scoreHigh :
    reportColors.scoreMedium;
  

  const modalContinueButton = () => {
    if (modalTextInput.trim() === "") {
      setEmptyModalTextInput(true);
      return;
    }

    alert("We've sent you an email");
    setShowModal(false);
  };




    const ISSUE_LIST = [
  {
    id: "Loading-speed",
    title: "Loading speed",
    score: String(Math.floor(Math.random() * 71) + 30),
    description:
      "Your website takes longer than average to load, which can affect user experience and SEO.",
  },
  {
    id: "Mobile-friendly",
    title: "Mobile Friendly",
    score: String(Math.floor(Math.random() * 71) + 30),
    description:
      "Your website takes longer than average to load, which can affect user experience and SEO.",
  },
  {
    id: "Visibility",
    title: "Visibility",
    score: String(Math.floor(Math.random() * 71) + 30),
    description:
      "Your website takes longer than average to load, which can affect user experience and SEO.",
  },
];


// Function to add all issues to the store
   
    const addAllToSiteIssueStore = () => {
      ISSUE_LIST.forEach((issue) => {
        addIssue(issue);
      });
    }





  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 120);

    return () => clearTimeout(timer);
  }, []);


  // for modal to come-up automatically

  useEffect(() => {
  const modalTimer = setTimeout(() => {
    setShowModal(true);
  }, 7000); 

  return () => clearTimeout(modalTimer);
}, []);


  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.screenContainer]}>
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

         <TouchableOpacity
           style={{
             flexDirection: "row",
             alignItems: "center",
             gap: 10,
             padding: 3,
             paddingHorizontal: 10,
             alignContent: "center",
           }}
           onPress={() => router.push({ pathname: '/(main)/auditing-screen', params: { url: domain } })}
         >
           <AntDesign name="reload" size={15} color="red" />
           <Text style={{color: "red", alignItems: "center", ...styles.domainText, fontSize: 13}}>Re-run audit</Text>
         </TouchableOpacity>
        </View>

        
        <View style={{paddingHorizontal: 25, marginVertical: 5, marginTop: 15}}>
          <Text style={[styles.scoreText, { color: statusColor(status as Status) }]}>{score}</Text>
          <Text style={{...styles.cardLabel, color: "#000"}}>Website Score</Text>
          <Text style={{...styles.cardLabel, color: "#dfdfdfff", marginTop: 5}}>Scan Date: {scanDate}</Text>
          <Text style={{color: "#000", fontFamily: "RethinkSans-Medium", fontSize: 13, marginTop: 20, }}>
            {status === "low" ? "Your website is performing poorly. Immediate improvements are needed to enhance user experience and SEO." : 
            status === "high" ? "Great job! Your website is performing well. Keep up the good work to maintain and further enhance user experience and SEO. Fix the issues below to make it even better."  : 
            "Your website has an average performance. There is room for improvement to boost user experience and SEO." }
            </Text>
        </View>

        <TouchableOpacity onPress={addAllToSiteIssueStore}>
          <Text 
            style={{
              marginLeft: "auto", 
              marginTop: 20, 
              marginBottom: 20, 
              marginRight: 20, 
              color: "blue"
            }}
          >
            Mark All
          </Text>
        </TouchableOpacity>

        <View style={{paddingHorizontal: "5%",}}>

          {ISSUE_LIST.map((issue) => (
            <IssueCard
              key={issue.id}
              id={issue.id}
              title={issue.title}
              score={issue.score}
              description={issue.description}
              status={status}
              onPressDetails={() =>
                router.push({
                  pathname: "/[id]", 
                  params: {
                    id: issue.id,
                    title: issue.title,
                    score: issue.score,
                    description: issue.description,
                    status: status,
                  },
                })
              }
            />
          ))}

       
        </View>

        <View>
          <Text
          style={{textAlign: "center", marginTop: 18, fontSize: 14, fontFamily: "RethinkSans-Medium", color: "#656566ff",}}
          >
            Get your sales up with a free review from an expert
          </Text>
        </View>
       
        
        
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={hireAPro} 
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>

        
        <View style={{ height: 80 }} />
      </ScrollView>

    
      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <TouchableOpacity 
              onPress={() => setShowModal(false)}
              style={{ position: "absolute",  right: 5 , margin: 10, paddingBottom: 15}}
            >
              <Ionicons name="close" size={30} color="#e24017ff" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Your website can be better</Text>

            <Text style={styles.modalSubtitle}>
              Dont miss a chance to stay ahead. Get free website monitoring and insights
            </Text>

         <View>
            <TextInput
            placeholder="Enter Email"
            onChangeText={(x) => {
              setModalTextInput(x);
              if (emptyModalTextInput && x !== "") setEmptyModalTextInput(false);
            }}
            placeholderTextColor={"#dbdbdbff"}
            style={{
              color: "#000",
              borderWidth: 1.5,
             borderColor: emptyModalTextInput ? "#D72D2D" : "#E5E7EB",
              borderRadius: 5,
              padding: 10,
            }}
            />

         </View>
         {emptyModalTextInput && (
          <Text style={{
            fontFamily: "RethinkSans-Regular",
            fontSize: 13,
            color: "#D72D2D",
            
          }}>
            Pls ensure you enter a valid email address
          </Text>
         )}

         <View style={{marginBottom: 20}}/>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={modalContinueButton}
            >
              <Text style={styles.modalButtonText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
