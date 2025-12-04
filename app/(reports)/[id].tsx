import { getScanIssues } from '@/actions/scan-actions';
import type { IssuesResult } from '@/lib/scan-service';
import { useSelectedIssuesStore } from '@/store/audit-summary-selected-issue-store';
import { useAuditInfoStore } from '@/store/audit-website-details-store';
import styles, { reportColors } from '@/stylesheets/single-issue-detail-screen-stylesheet';
import { Status } from '@/type';
import { useTranslation } from '@/utils/translations';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';




const SingleIssueDetailScreen = () => {
    const { t } = useTranslation();
    const inset = useSafeAreaInsets();
    const router = useRouter();

    const { getAuditInfo, setAuditInfo } = useAuditInfoStore();
    const { addIssue, setFullIssuesData } = useSelectedIssuesStore();

    const [issuesData, setIssuesData] = useState<IssuesResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { domain, status, score, scanDate } = getAuditInfo();

    const params = useLocalSearchParams();
    const categoryKey = Array.isArray(params.id) ? params.id[0] : params.id;
    const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;

    const category = issuesData?.categories.find(cat => cat.key === categoryKey);

    useEffect(() => {
        const fetchIssues = async () => {
            if (!jobId) {
                setError('Job ID is required');
                setIsLoading(false);
                return;
            }

            try {
                const result = await getScanIssues(jobId);
                setIssuesData(result);
                setFullIssuesData(result); // Save full data to store

                // Update audit info with overall data
                setAuditInfo({
                    domain: domain || '', // Keep existing domain
                    status: result.website_score >= 80 ? 'Good' : result.website_score >= 50 ? 'Warning' : 'Critical',
                    score: String(result.website_score),
                    scanDate: new Date(result.scan_date).toLocaleDateString(),
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load issue details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchIssues();
    }, [jobId, setAuditInfo, domain]);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error || !category) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ textAlign: 'center', color: 'red' }}>
                    {error || 'Category not found'}
                </Text>
            </View>
        );
    }

    const title = category.title;
    const description = category.description;
    const categoryScore = category.score;
    const businessBenefits = category.business_impact;
    const suggestions = category.suggestion;
    const problems = category.problems;


    const statusColor = (s: Status) =>
        s === "Critical" ? reportColors.scoreLow :
        s === "Good" ? reportColors.scoreHigh :
        reportColors.scoreMedium;



    const numericScore = categoryScore;

    const scoreStatus =
      numericScore <= 49 ? "Critical" :
      numericScore <= 69 ? "Warning" :
      "Good";

    const bgColor =
      scoreStatus === "Good"
        ? "rgba(14, 164, 114, 0.2)"
        : scoreStatus === "Warning"
        ? "rgba(255, 155, 46, 0.2)"
        : "rgba(215, 45, 45, 0.2)";

    const fgColor =
      scoreStatus === "Good"
        ? "#0EA472"
        : scoreStatus === "Warning"
        ? "#FF9B2E"
        : "#D72D2D";

    const progressWidth = `${numericScore}%`;


const hireAPro = () => {
  try {
    addIssue({
      id: categoryKey,
      title: title,
      score: String(categoryScore),
      status: scoreStatus,
      description: description,
    });

    //navigate to  fix/hire professional
    router.push("/(hireRequest)/hire-request");
  } catch (error) {
    console.log(error)
  }
}




  return (
    <View style={{
        paddingTop: inset.top - 30, 
        paddingBottom: inset.bottom - 10,
        backgroundColor: "#fff",
        flex: 1
    }}>
        <ScrollView>
        <View style={{position: 'relative', marginBottom: 20, paddingHorizontal: 20, paddingTop: 10, marginTop: 35,}}>
            <TouchableOpacity
                onPress={() => router.back()}
                style={{position: 'absolute', left: 20, zIndex: 1}}
            >
                <Ionicons name="arrow-back-sharp" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>{t('issueDetail.auditSummary')}</Text>
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
                  onPress={() => router.push({ pathname: '/(main)/auditing-screen', params: { url: domain, isReRun: 'true' } })}
                >
                  <AntDesign name="reload" size={15} color="red" />
                  <Text style={{color: "red", alignItems: "center", ...styles.domainText, fontSize: 13}}>{t('issueDetail.reRunAudit')}</Text>
                </TouchableOpacity>
            </View>
            
                    
            <View style={{paddingHorizontal: 25, marginVertical: 5, marginTop: 15}}>
            <Text style={[
                styles.scoreText, 
                { color: statusColor(status as Status) 
                }]}>
                    {score}
                </Text>
                <Text 
                    style={{
                        ...styles.cardLabel, 
                        color: "#000"
                    }}>
                        {t('issueDetail.websiteScore')}
                    </Text>
                <Text style={{
                    ...styles.cardLabel, 
                    color: "#dfdfdfff", 
                    marginTop: 5}}>
                        {t('issueDetail.scanDate')}: {scanDate}
                </Text>
                <Text style={{
                    color: "#000", 
                    fontFamily: "RethinkSans-Medium", 
                    fontSize: 13, 
                    marginTop: 20, 
                }}>
                    {status === "low" ? t('reportDashboard.statusCritical') : 
                    status === "high" ? t('reportDashboard.statusGood') : 
                    t('reportDashboard.statusWarning')}
                </Text>
        </View>

            <View style={{
               ...styles.cardSection
            }}
            >

  {/* Issue Title */}
  <Text style={{
    ...styles.cardTitle
  }}>
    {title}
  </Text>

  <Text style={styles.cardDescription}>
    {description}
  </Text>

  {/* Mini Score Row */}
  <View style={{
    ...styles.usabilitySection
  }}>
    <Text style={{
      ...styles.usabilityText
    }}>
      {categoryKey === 'usability' ? t('issueDetail.userExperience') : categoryKey === 'performance' ? t('issueDetail.performance') : t('issueDetail.seo')}
    </Text>

    <View style={{
      ...styles.miniscoreBackground, backgroundColor: bgColor
    }}>
      <Text style={{
        ...styles.miniscoreText, color: fgColor
      }}>
        {categoryScore}/100
      </Text>
    </View>
  </View>

  {/**Progress Bar */}

 <View style={[styles.progressBarBackground, { backgroundColor: bgColor }]}>
 <View
   style={[styles.progressBarForeground, { width: progressWidth as any, backgroundColor: fgColor }]}
 />
</View>





  {/* WHAT THIS WOULD DO SECTION */}
  <Text style={{
    ...styles.whatThisWillDoTitle
  }}>
    {t('issueDetail.whatThisWouldDo')}
  </Text>

  <Text style={{
    ...styles.whatThisWillDoText
  }}>
    {businessBenefits.length > 0 ? businessBenefits.map((benefit: string, index: number) => (
      `• ${benefit}${index < businessBenefits.length - 1 ? '\n' : ''}`
    )).join('') : t('issueDetail.defaultBenefits')}
  </Text>

  {/* PROBLEMS */}
  <Text style={{
    ...styles.problemsTitle
  }}>
    {t('issueDetail.problems')}
  </Text>

  <View style={{...styles.problemDetailsContainer }}>
    {problems.map((problem, index) => (
      <View key={index} style={{ ...styles.problemDetailInnerContainer }}>
        <View style={{...styles.warningIconBackground, backgroundColor: "rgba(232, 153, 25, 0.3)"}}>
            <FontAwesome name="warning" size={12} color="#E89919" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            ...styles.problemText,
            fontFamily: "RethinkSans-Bold",
            fontSize: 14,
            marginBottom: 4
          }}>
            {problem.title}
          </Text>
          <Text style={{
            ...styles.problemText,
            fontFamily: "RethinkSans-Regular",
            fontSize: 13
          }}>
            {problem.description}
          </Text>
        </View>
      </View>
    ))}
  </View>

  {/* SUGGESTIONS */}
  <Text style={{
    ...styles.suggestionTitle
  }}>
    {t('issueDetail.suggestions')}
  </Text>

  <Text style={{
    ...styles.suggestionText
  }}>
    {suggestions.map((suggestion, index) => (
      `• ${suggestion}${index < suggestions.length - 1 ? '\n' : ''}`
    )).join('')}
  </Text>

  {/* Continue Button */}
  <TouchableOpacity
    onPress={hireAPro} 
    style={{
      ...styles.continueButton
    }}
  >
    <Text style={{
     ...styles.continueButtonText
    }}>
      {t('issueDetail.continue')}
    </Text>
  </TouchableOpacity>

</View>

        </ScrollView>
    </View>
  )
}

export default SingleIssueDetailScreen