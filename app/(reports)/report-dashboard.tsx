import { submitLead } from "@/actions/leads-actions";
import { getScanResult } from "@/actions/scan-actions";
import styles, { reportColors } from "@/stylesheets/report-dashboard-stylesheet";
import { useTranslation } from "@/utils/translations";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import IssueCard from "@/components/issue-card";
import { useSelectedIssuesStore } from "@/store/audit-summary-selected-issue-store";
import { useAuditInfoStore } from "@/store/audit-website-details-store";
import { Status } from "@/type";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';







export default function ReportDashboard() {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTextInput, setModalTextInput] = useState<string>('')
  const [emptyModalTextInput, setEmptyModalTextInput] = useState<boolean>(false)
  const [scanResult, setScanResult] = useState<any>(null);

  const { addIssue, clearIssues, setIssues } = useSelectedIssuesStore();

  const { issues } = useSelectedIssuesStore();

  const { setAuditInfo } = useAuditInfoStore();




  const params = useLocalSearchParams();

  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
  const url = Array.isArray(params.url) ? params.url[0] : params.url;




  const hireAPro = () => {


    try {

      if (issues.length < 1) {
        Toast.show({
          type: 'error',
          text1: t('common.error'),
          text2: t('reports.selectIssuesForPro'),
        });
        return;
      }


      //navigate to  fix/hire professional
      router.push({
        pathname: "/(hireRequest)/hire-request",
        params: jobId ? { jobId } : {},
      });
    } catch (error) {
      console.log(error)
    }
  }


  const router = useRouter();



  const statusColor = (s: Status) =>
    s === "Critical" ? reportColors.scoreLow :
      s === "Good" ? reportColors.scoreHigh :
        reportColors.scoreMedium;

  // Normalize status to match Status type
  const normalizeStatus = (status: string): Status => {
    switch (status) {
      case "Good": return "Good";
      case "Warning": return "Warning";
      case "Critical": return "Critical";
      default: return "Warning";
    }
  };


  const modalContinueButton = async () => {
    if (modalTextInput.trim() === "") {
      setEmptyModalTextInput(true);
      return;
    }

    try {
      const response = await submitLead(modalTextInput.trim());
      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: response.message,
      });
      setShowModal(false);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: 'Failed to submit email. Please try again.',
      });
    }
  };




  const ISSUE_LIST = scanResult?.issues || [];

  // Function to toggle all issues selection
  const toggleAllIssues = () => {
    const allSelected = issues.length === ISSUE_LIST.length && ISSUE_LIST.length > 0;

    if (allSelected) {
      // Unmark all - clear the store
      clearIssues();
    } else {
      // Mark all - add all issues
      ISSUE_LIST.forEach((issue: any) => {
        addIssue({
          id: issue.id,
          title: issue.title,
          score: String(issue.score),
          status: normalizeStatus(scanResult?.status || 'Warning'),
          description: issue.description,
        });
      });
    }
  }





  useEffect(() => {
    if (jobId) {
      const fetchResult = async () => {
        try {
          const result = await getScanResult(jobId);
          setScanResult(result);
          setIssues(result.issues.map(issue => ({ ...issue, score: String(issue.score) })));

          // Set audit info for details page
          setAuditInfo({
            domain: url,
            status: result.status,
            score: String(result.overall_score),
            scanDate: result.scanned_at ? new Date(result.scanned_at).toLocaleDateString() : '',
          });
        } catch (error) {
          console.error('Failed to fetch scan result:', error);
        }
      };
      fetchResult();
    }
  }, [jobId, url, setAuditInfo, setIssues]);

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

        <View style={{ position: 'relative', marginBottom: 20, paddingHorizontal: 20, paddingTop: 10, marginTop: 35, }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 20, zIndex: 1 }}
          >
            <Ionicons name="arrow-back-sharp" size={24} color="black" />
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { textAlign: 'center' }]}>{t('reportDashboard.auditSummary')}</Text>
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
            <Text style={{ ...styles.domainText, alignItems: "center", color: "blue", fontSize: 10, }}>{url}</Text>
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
            onPress={() => router.push({ pathname: '/(main)/auditing-screen', params: { url: url, isReRun: 'true' } })}
          >
            <AntDesign name="reload" size={15} color="red" />
            <Text style={{ color: "red", alignItems: "center", ...styles.domainText, fontSize: 13 }}>{t('reportDashboard.rerunAudit')}</Text>
          </TouchableOpacity>
        </View>


        <View style={{ paddingHorizontal: 25, marginVertical: 5, marginTop: 15 }}>
          <Text style={[styles.scoreText, { color: statusColor(normalizeStatus(scanResult?.status || 'Warning')) }]}>{scanResult?.overall_score || t('common.loading')}</Text>
          <Text style={{ ...styles.cardLabel, color: "#000" }}>{t('reportDashboard.websiteScore')}</Text>
          <Text style={{ ...styles.cardLabel, color: "#dfdfdfff", marginTop: 5 }}>{t('reportDashboard.scanDate')}: {scanResult?.scanned_at ? new Date(scanResult.scanned_at).toLocaleDateString() : t('common.loading')}</Text>
          <Text style={{ color: "#000", fontFamily: "RethinkSans-Medium", fontSize: 13, marginTop: 20, }}>
            {normalizeStatus(scanResult?.status || 'Warning') === "Critical" ? t('reportDashboard.statusCritical') :
              normalizeStatus(scanResult?.status || 'Warning') === "Good" ? t('reportDashboard.statusGood') :
                t('reportDashboard.statusWarning')}
          </Text>
        </View>

        {scanResult ? (
          <>
            <TouchableOpacity onPress={toggleAllIssues}>
              <Text
                style={{
                  marginLeft: "auto",
                  marginTop: 20,
                  marginBottom: 20,
                  marginRight: 20,
                  color: "blue"
                }}
              >
                {issues.length === ISSUE_LIST.length && ISSUE_LIST.length > 0 ? t('reportDashboard.unmarkAll') : t('reportDashboard.markAll')}
              </Text>
            </TouchableOpacity>

            <View style={{ paddingHorizontal: "5%", }}>
              {ISSUE_LIST.map((issue: any) => (
                <IssueCard
                  key={issue.id}
                  id={issue.id}
                  title={issue.title}
                  score={String(issue.score)}
                  description={issue.description}
                  status={normalizeStatus(scanResult?.status || 'Warning')}
                  onPressDetails={() =>
                    router.push({
                      pathname: "/[id]",
                      params: {
                        id: issue.id,
                        title: issue.title,
                        score: String(issue.score),
                        description: issue.description,
                        status: normalizeStatus(scanResult?.status || 'Warning'),
                        businessBenefits: issue.business_benefits ? JSON.stringify(issue.business_benefits) : null,
                        impactMessage: issue.impact_message || null,
                      },
                    })
                  }
                />
              ))}
            </View>
          </>
        ) : (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#F04438" />
            <Text style={{ marginTop: 10, color: '#666' }}>{t('reportDashboard.loadingResults')}</Text>
          </View>
        )}

        <View>
          <Text
            style={{ textAlign: "center", marginTop: 18, fontSize: 14, fontFamily: "RethinkSans-Medium", color: "#656566ff", }}
          >
            {t('reportDashboard.getSalesUp')}
          </Text>
        </View>



        <TouchableOpacity
          style={styles.continueBtn}
          onPress={hireAPro}
        >
          <Text style={styles.continueText}>{t('common.continue')}</Text>
        </TouchableOpacity>


        <View style={{ height: 80 }} />
      </ScrollView>


      <Modal transparent visible={showModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={{ position: "absolute", right: 5, margin: 10, paddingBottom: 15 }}
            >
              <Ionicons name="close" size={30} color="#e24017ff" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>{t('reportDashboard.modalTitle')}</Text>

            <Text style={styles.modalSubtitle}>
              {t('reportDashboard.modalSubtitle')}
            </Text>

            <View>
              <TextInput
                placeholder={t('reportDashboard.enterEmail')}
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
                {t('reportDashboard.invalidEmail')}
              </Text>
            )}

            <View style={{ marginBottom: 20 }} />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={modalContinueButton}
            >
              <Text style={styles.modalButtonText}>{t('reportDashboard.gotIt')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
