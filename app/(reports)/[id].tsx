import { useSelectedIssuesStore } from '@/store/audit-summary-selected-issue-store';
import { useAuditInfoStore } from '@/store/audit-website-details-store';
import styles, { reportColors } from '@/stylesheets/single-issue-detail-screen-stylesheet';
import { Status } from '@/type';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';




const SingleIssueDetailScreen = () => {
    const inset = useSafeAreaInsets();
    const router = useRouter();

    const { getAuditInfo } = useAuditInfoStore();
    const { addIssue, availableIssues } = useSelectedIssuesStore();

    const { domain, status, score, scanDate,} = getAuditInfo();

    const params = useLocalSearchParams();

    const { id, businessBenefits: _businessBenefits, impactMessage: _impactMessage } = params;

    const businessBenefitsStr = Array.isArray(_businessBenefits) ? _businessBenefits[0] : _businessBenefits;
    const impactMessageStr = Array.isArray(_impactMessage) ? _impactMessage[0] : _impactMessage;

    const issue = useMemo(() => availableIssues.find(iss => iss.id === id), [availableIssues, id]);

    const title = issue?.title || 'Unknown';
    const miniscore = issue?.score || '0';
    const description = issue?.description || 'No description';
    const ministatus = issue?.status || 'Warning';

    const businessBenefits = businessBenefitsStr ? JSON.parse(businessBenefitsStr) : [];
    const impactMessage = impactMessageStr || '';

    console.log(id, ministatus)


    const statusColor = (s: Status) =>
        s === "Critical" ? reportColors.scoreLow :
        s === "Good" ? reportColors.scoreHigh :
        reportColors.scoreMedium;



        // Suppose numericScore is between 0-100
const scoreStr = Array.isArray(miniscore) ? miniscore[0] : miniscore;
const numericScore = parseInt(scoreStr, 10);

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
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
const rawTitle = Array.isArray(params.title) ? params.title[0] : params.title;
const rawMiniScore = Array.isArray(params.score) ? params.score[0] : params.score;
const rawMiniStatus = Array.isArray(params.status) ? params.status[0] : params.status;
const rawDescription = Array.isArray(params.description) ? params.description[0] : params.description;

  try {
    addIssue({
      id: rawId,
      title: rawTitle,
      score: rawMiniScore,
      status: rawMiniStatus,
      description: rawDescription,
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
                  onPress={() => router.push({ pathname: '/(main)/auditing-screen', params: { url: domain, isReRun: 'true' } })}
                >
                  <AntDesign name="reload" size={15} color="red" />
                  <Text style={{color: "red", alignItems: "center", ...styles.domainText, fontSize: 13}}>Re-run audit</Text>
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
                        Website Score
                    </Text>
                <Text style={{
                    ...styles.cardLabel, 
                    color: "#dfdfdfff", 
                    marginTop: 5}}>
                        Scan Date: {scanDate}
                </Text>
                <Text style={{
                    color: "#000", 
                    fontFamily: "RethinkSans-Medium", 
                    fontSize: 13, 
                    marginTop: 20, 
                }}>
                    {status === "low" ? "Your website is performing poorly. Immediate improvements are needed to enhance user experience and SEO." : 
                    status === "high" ? "Great job! Your website is performing well. Keep up the good work to maintain and further enhance user experience and SEO. Fix the issues below to make it even better."  : 
                    "Your website has an average performance. There is room for improvement to boost user experience and SEO." }
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
      {ministatus === 'UX' ? 'User Experience' : ministatus === 'Performance' ? 'Performance' : 'SEO'}
    </Text>

    <View style={{
      ...styles.miniscoreBackground, backgroundColor: bgColor
    }}>
      <Text style={{
        ...styles.miniscoreText, color: fgColor
      }}>
        {miniscore}/100
      </Text>
    </View>
  </View>

  {/**Progress Bar */}

 <View style={[styles.progressBarBackground, { backgroundColor: bgColor }]}>
  <View
    style={[styles.progressBarForeground, { width: progressWidth, backgroundColor: fgColor }]}
  />
</View>





  {/* WHAT THIS WOULD DO SECTION */}
  <Text style={{
    ...styles.whatThisWillDoTitle
  }}>
    WHAT this would do to your business
  </Text>

  <Text style={{
    ...styles.whatThisWillDoText
  }}>
    {businessBenefits.length > 0 ? businessBenefits.map((benefit: string, index: number) => (
      `• ${benefit}${index < businessBenefits.length - 1 ? '\n' : ''}`
    )).join('') : '• Lower conversions for your website\n• Poor user experience\n• People leaving your website early'}
  </Text>

  {/* PROBLEMS */}
  <Text style={{
    ...styles.problemsTitle
  }}>
    Problems
  </Text>

  <View style={{...styles.problemDetailsContainer }}>
    <View style={{ ...styles.problemDetailInnerContainer }}>
        <View style={{...styles.warningIconBackground, backgroundColor: "rgba(232, 153, 25, 0.3)"}}>
            <FontAwesome name="warning" size={12} color="#E89919" />
        </View>
      
      <Text style={{
        ...styles.problemText
      }}>
        {ministatus === 'UX' ? 'Issues with user interface and navigation' :
         ministatus === 'Performance' ? 'Slow loading times and performance bottlenecks' :
         'Problems with search engine optimization'}
      </Text>
    </View>

    <View style={{ ...styles.problemDetailInnerContainer }}>

      
      <View style={{...styles.warningIconBackground, backgroundColor: "rgba(232, 153, 25, 0.3)"}}>
            <FontAwesome name="warning" size={12} color="#E89919" />
        </View>

      <Text style={{
        ...styles.problemText
      }}>
        Missing features may drive customers away.
      </Text>
    </View>

    <View style={{...styles.problemDetailInnerContainer }}>


      <View style={{...styles.warningIconBackground, backgroundColor: "rgba(232, 153, 25, 0.3)"}}>
            <FontAwesome name="warning" size={12} color="#E89919" />
        </View>

      <Text style={{
        ...styles.problemText
      }}>
        Lack of visual hierarchy makes important content hard to notice.
      </Text>
    </View>
  </View>

  {/* SUGGESTIONS */}
  <Text style={{
    ...styles.suggestionTitle
  }}>
    Suggestions
  </Text>

  <Text style={{
    ...styles.suggestionText
  }}>
    {impactMessage || (ministatus === 'UX' ? 'Improve user interface design and navigation structure to enhance user experience.' :
     ministatus === 'Performance' ? 'Optimize images, enable compression, and improve server response times for better performance.' :
     'Fix meta tags, improve content structure, and enhance internal linking for better SEO.')}
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
      Continue
    </Text>
  </TouchableOpacity>

</View>

        </ScrollView>
    </View>
  )
}

export default SingleIssueDetailScreen