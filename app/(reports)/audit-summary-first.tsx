import { submitLead } from "@/actions/leads-actions";
import { getScanSummary } from "@/actions/scan-actions";
import type { SummaryResult } from "@/lib/scan-service";
import styles, { reportColors } from "@/stylesheets/report-dashboard-stylesheet";
import { useTranslation } from "@/utils/translations";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import IssueCard from "@/components/issue-card";
import TopAlert from "@/components/top-alert";
import { useSelectedIssuesStore } from "@/store/audit-summary-selected-issue-store";
import { useAuditInfoStore } from "@/store/audit-website-details-store";
import { LeadResponse, Status } from "@/type";
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { leadService } from "../../lib/lead-generation-service";

export default function AuditSummaryFirst() {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTextInput, setModalTextInput] = useState<string>('')
  const [emptyModalTextInput, setEmptyModalTextInput] = useState<boolean>(false)
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);
  const [leadResponse, setLeadResponse] = useState<LeadResponse | null>(null)
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const router = useRouter();
  const { addIssue, clearIssues, setIssues } = useSelectedIssuesStore();

  const { issues } = useSelectedIssuesStore();

  const { setAuditInfo } = useAuditInfoStore();

  const params = useLocalSearchParams();

  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
  const url = Array.isArray(params.url) ? params.url[0] : params.url;

  const selectIssuesForReview = () => {
    // Navigate to the current report dashboard (second page)
    router.push({
      pathname: "/(reports)/report-dashboard",
      params: { jobId: jobId, url: url },
    });
  };

  const discoverNewPages = () => {
    // Navigate to page discovery screen
    router.push({
      pathname: "/(main)/page-discovery-screen",
      params: { url: url },
    });
  };

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

  const modalContinueButton = async (modalTextInput: string) => {
    if (modalTextInput.trim() === "") {
      setEmptyModalTextInput(true);
      return;
    }

    setModalLoading(true)

    try {
      const response = await submitLead(modalTextInput.trim());
      Toast.show({
        type: 'success',
        text1: t('common.success'),
        text2: response.message,
      });
      setShowModal(false);
    } catch (error) {
      try {
        const response = await leadService.createLead(modalTextInput);

        setLeadResponse(response)

        if (response.status === "success") {
          console.log("success")
          setShowModal(false);
        }
      } catch (error: any) {
        console.log("error")
        const apiError = error?.response?.data ?? null;
        console.log(apiError)
        setLeadResponse(apiError);
      }
    } finally {
      setModalLoading(false)
    }
  };

  const CATEGORIES = summaryResult?.categories || [];

  useEffect(() => {
    if (jobId) {
      const fetchResult = async () => {
        try {
          const result = await getScanSummary(jobId);
          setSummaryResult(result);

          // Set audit info for details page
          setAuditInfo({
            domain: url,
            status: result.website_score >= 80 ? 'Good' : result.website_score >= 50 ? 'Warning' : 'Critical',
            score: String(result.website_score),
            scanDate: new Date(result.scan_date).toLocaleDateString(),
          });
        } catch (error) {
          console.error('Failed to fetch scan issues:', error);
        }
      };
      fetchResult();
    }
  }, [jobId, url, setAuditInfo]);

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

        {leadResponse?.status === "success" && (
          <TopAlert message={leadResponse.message} duration={4000} />
        )}

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
          <Text style={[styles.scoreText, { color: statusColor(normalizeStatus(summaryResult ? (summaryResult.website_score >= 80 ? 'Good' : summaryResult.website_score >= 50 ? 'Warning' : 'Critical') : 'Warning')) }]}>{summaryResult?.website_score || t('common.loading')}</Text>
          <Text style={{ ...styles.cardLabel, color: "#000" }}>{t('reportDashboard.websiteScore')}</Text>
          <Text style={{ ...styles.cardLabel, color: "#dfdfdfff", marginTop: 5 }}>{t('reportDashboard.scanDate')}: {summaryResult?.scan_date ? new Date(summaryResult.scan_date).toLocaleDateString() : t('common.loading')}</Text>
          <Text style={{ color: "#000", fontFamily: "RethinkSans-Medium", fontSize: 13, marginTop: 5, }}>
            {normalizeStatus(summaryResult ? (summaryResult.website_score >= 80 ? 'Good' : summaryResult.website_score >= 50 ? 'Warning' : 'Critical') : 'Warning') === "Critical" ? t('reportDashboard.statusCritical') :
              normalizeStatus(summaryResult ? (summaryResult.website_score >= 80 ? 'Good' : summaryResult.website_score >= 50 ? 'Warning' : 'Critical') : 'Warning') === "Good" ? t('reportDashboard.statusGood') :
                t('reportDashboard.statusWarning')}
          </Text>
        </View>

        {summaryResult ? (
          <>
            <View style={{ paddingHorizontal: "5%", }}>
              {CATEGORIES.map((category: any) => (
                <IssueCard
                  key={category.key}
                  id={category.key}
                  title={category.title}
                  score={String(category.score)}
                  description={category.short_description}
                  status={normalizeStatus(summaryResult ? (summaryResult.website_score >= 80 ? 'Good' : summaryResult.website_score >= 50 ? 'Warning' : 'Critical') : 'Warning')}
                  onPressDetails={() =>
                    router.push({
                      pathname: "/[id]",
                      params: {
                        id: category.key,
                        jobId: jobId,
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

        {/* Two buttons stacked in column */}
        <View style={{ paddingHorizontal: 20, marginTop: 30, gap: 15 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#FF5A3D',
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={selectIssuesForReview}
          >
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'RethinkSans-Medium',
              textAlign: 'center'
            }}>
              Select Issues for Review
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: '#FF5A3D',
              alignItems: 'center',
            }}
            onPress={discoverNewPages}
          >
            <Text style={{
              color: '#FF5A3D',
              fontSize: 16,
              fontFamily: 'RethinkSans-Medium',
              textAlign: 'center'
            }}>
              Discover New Pages to Scan
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <Modal transparent visible={showModal} animationType="fade" onRequestClose={() => setShowModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
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
                        borderColor: emptyModalTextInput || leadResponse?.status === "error" ? "#D72D2D" : "#E5E7EB",
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

                  {leadResponse?.status === "error" && (
                    <Text style={{
                      fontFamily: "RethinkSans-Regular",
                      fontSize: 13,
                      color: "#D72D2D",
                    }}>
                      {leadResponse.message}
                    </Text>
                  )}

                  <View style={{ marginBottom: 20 }} />

                  {modalLoading ? (
                    <ActivityIndicator
                      size={"large"}
                      color={"#e24017ff"}
                      style={styles.modalActivityIndicator}
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => modalContinueButton(modalTextInput)}
                    >
                      <Text style={styles.modalButtonText}>{t('reportDashboard.gotIt')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}