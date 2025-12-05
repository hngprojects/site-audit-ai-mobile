import { getScanStatus, startScan } from '@/actions/scan-actions';
import WaveCircle from '@/components/animated-wave-circle';
import { useAuditStore } from '@/store/website-domain';
import styles from '@/stylesheets/auditing-screen-stylesheet';
import { useTranslation } from '@/utils/translations';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const AuditingScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams();
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;
  const url = Array.isArray(params.url) ? params.url[0] : params.url;
  const fromReports = params.fromReports === 'true';

  const { setDomain } = useAuditStore();

  const websiteUrl = url || '';
  const [progress, setProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState<string>('queued');
  const [completedSteps, setCompletedSteps] = useState<number>(0);
  const [caretVisible, setCaretVisible] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  
  

  // Scanning checklist items with appropriate icons
  const scanSteps = [
    { text: t('auditing.analyzing'), icon: 'search', iconSet: 'FontAwesome' as const },
    { text: t('auditing.scanningContent'), icon: 'description', iconSet: 'MaterialIcons' as const },
    { text: t('auditing.checkingSpeed'), icon: 'speed', iconSet: 'MaterialIcons' as const },
    { text: t('auditing.findingLinks'), icon: 'link', iconSet: 'FontAwesome' as const }
  ];

  useEffect(() => {
    setDomain(websiteUrl)
    // If we have a jobId, poll for existing scan status
    if (jobId) {
      let statusInterval: NodeJS.Timeout;

      const pollStatus = async () => {
        try {
          const statusResponse = await getScanStatus(jobId);
          setScanStatus(statusResponse.status);
          setProgress(statusResponse.progress_percent);

          // Update completed steps based on real progress from API
          const stepProgress = (statusResponse.progress_percent / 100) * scanSteps.length;
          
          setCompletedSteps(Math.floor(stepProgress));
          

          if (statusResponse.status === 'completed') {
            setProgress(100); // Ensure progress shows 100% on completion
            setCompletedSteps(scanSteps.length); // Mark all steps complete
            clearInterval(statusInterval);

            // Small delay to show completion before navigation
            setTimeout(() => {
              router.replace({
                pathname: "../(reports)/report-dashboard",
                params: {
                  jobId,
                  url: websiteUrl,
                },
              });
            }, 1000);
          } else if (statusResponse.status === 'failed') {
            clearInterval(statusInterval);

            // Redirect to error screen when scan fails
            setTimeout(() => {
              router.replace({
                pathname: "/(main)/auditing-error-screen",
                params: {
                  url: websiteUrl,
                  jobId,
                },
              });
            }, 1000);
          }
        } catch (error) {
          console.error('Failed to poll scan status:', error);
        }
      };

      // Poll status immediately and then every 15 seconds
      pollStatus();
      statusInterval = Number(setInterval(pollStatus, 15000));

      return () => {
        clearInterval(statusInterval);
      };
    }
    // If we have a URL but no jobId (re-run scenario), start a new scan
    else if (websiteUrl && params.isReRun === 'true') {
      const startNewScan = async () => {
        try {
          const scanResponse = await startScan(websiteUrl);
          // Navigate to same screen with the new jobId to start polling
          router.replace({
            pathname: '/(main)/auditing-screen',
            params: {
              url: websiteUrl,
              jobId: scanResponse.job_id,
            },
          });
        } catch (error) {
          console.error('Failed to start re-run scan:', error);
        }
      };

      startNewScan();
    }
  }, [jobId, router, websiteUrl, params.isReRun, scanSteps.length, setDomain]);

  console.log(scanStatus)
  console.log(progress)

 

//for the cursor view effect in the typing status display format
  useEffect(() => {
  const interval = setInterval(() => {
    setCaretVisible(v => !v);
  }, 500);

  return () => clearInterval(interval);
}, []);




  //🔥 TEMPORARY: Simulate scan steps for testing animations
useEffect(() => {
  if (jobId) return; // don't simulate if real scanning is happening

  let step = 0;

  const simulate = () => {
    if (step < scanSteps.length) {
      if (!isTyping) {
        step++;
        setCompletedSteps(step);
      }
      setTimeout(simulate, 2500); // animate each step every 2.5 seconds..
    }
  };

  setTimeout(simulate, 1200);

  return () => {};
}, [jobId]);



const animatedSteps = useRef(
  scanSteps.map(() => new Animated.Value(-20)) 
).current;

const animatedOpacity = useRef(
  scanSteps.map(() => new Animated.Value(0))
).current;

const typedText = useRef(
  scanSteps.map(() => new Animated.Value(0))
).current;

  const [textProgress, setTextProgress] = useState(
  scanSteps.map(() => 0));



const fillProgress = useRef(new Animated.Value(0)).current;
const waveOffset = useRef(new Animated.Value(0)).current;


//Use Effect for the progress status stages to display they typing texts animation 
useEffect(() => {
  if (completedSteps > 0 && completedSteps <= scanSteps.length) {
    const index = completedSteps - 1;
    const textLength = scanSteps[index].text.length;

    // Slide + fade animation
    Animated.parallel([
      Animated.timing(animatedSteps[index], {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(animatedOpacity[index], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsTyping(true);

      const anim = Animated.timing(typedText[index], {
        toValue: textLength,
        duration: textLength * 100,
        useNativeDriver: false,
      });

      const listenerId = typedText[index].addListener(v => {
        setTextProgress(prev => {
          const next = [...prev];
          next[index] = Math.floor(v.value);
          return next;
        });
      });

      anim.start(() => {
        typedText[index].removeListener(listenerId);
        setIsTyping(false);
      });
    });
  }
}, [completedSteps]);




//UseEffect for the circle getting filled

useEffect(() => {
  const targetFill = completedSteps / scanSteps.length; 
  Animated.timing(fillProgress, {
    toValue: targetFill,
    duration: 800,
    useNativeDriver: false,
  }).start();
}, [completedSteps]);

//for wave movement inside the circle fill
useEffect(() => {
  Animated.loop(
    Animated.timing(waveOffset, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    })
  ).start();
}, []);





  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {fromReports ? t('auditing.reScanning') : t('auditing.scanning')}
          </Text>
          <Text style={styles.headerUrl}>{websiteUrl}</Text>
          {fromReports && (
            <Text style={styles.reScanNote}>{t('auditing.reScanNote')}</Text>
          )}
        </View>

        <View style={styles.content}>
          {completedSteps >= 2 && (
            <View style={styles.glowCircle} />   
          ) }
            
            <WaveCircle
              size={120}
              completedSteps={completedSteps}
              totalSteps={scanSteps.length}
            />

            <View style={{marginBottom: 40}}/>

          <View>
            <Text style={styles.hangTight}>Hang tight, it takes about 30-60 seconds</Text>
          </View>

          {/* Scanning Checklist */}
          <View style={styles.checklistContainer}>
            {scanSteps.slice(0, completedSteps).map((step, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.checklistItem,
                  {
                    opacity: animatedOpacity[index],
                    transform: [{ translateY: animatedSteps[index] }],
                  }
                ]}
              >
                <MaterialCommunityIcons
                  name="check-decagram"
                  size={24}
                  color="#58A279"
                  style={styles.checklistIcon}
                />
                <Text style={[styles.checklistText, { color: "#58A279" }]}>
                    {step.text.substring(0, textProgress[index])}
                    {textProgress[index] < step.text.length && caretVisible ? "|" : ""}
                </Text>
              </Animated.View>
            ))}
          </View>

        </View>
      </View>
    </SafeAreaView>
  )
}

export default AuditingScreen