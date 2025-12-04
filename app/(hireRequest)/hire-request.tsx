import AuthModal from '@/components/auth/auth-modal';
import { useAuditInfoStore } from '@/store/audit-website-details-store';
import { useAuthStore } from '@/store/auth-store';
import styles from '@/stylesheets/hire-request-stylesheet';
import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const HireRequest = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isAuthenticated } = useAuthStore();
  const { auditInfo } = useAuditInfoStore();
  const [modalVisible, setModalVisible] = useState(false);

  // Get job_id from route params if available
  const jobId = Array.isArray(params.jobId) ? params.jobId[0] : params.jobId;

  const handleReviewPress = () => {
    if (isAuthenticated) {
      router.push({
        pathname: '/(hireRequest)/request-form',
        params: jobId ? { jobId } : {},
      });
    } else {
      setModalVisible(true);
    }
  };

  const handleReRunScan = () => {
    router.push({ pathname: '/(main)/auditing-screen', params: { url: auditInfo.domain } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#1A2373" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Website Review</Text>
      </View>
      <View style={styles.content}>
        <Image
          source={require('../../assets/images/review.png')}
          style={styles.reviewHeaderPicture}
        />
        <Text style={styles.mainTitle}>
          Get Personalized Human Insights for <Text style={styles.freeText}>FREE</Text>
        </Text>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>

            All the issues can feel like a lot. Let a real person take a quick look and guide you—simple, calm, and free.

          </Text>
          <Text style={styles.descriptionText2}>
            We’ll pair you with professionals who checks your website and explains things in a simple way at no cost.
          </Text>
          <Image
            source={require('../../assets/images/review-picture.png')}
            style={styles.reviewPicture}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleReviewPress}>
            <Text style={styles.primaryButtonText}>Review My Website</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleReRunScan}>
            <Text style={styles.secondaryButtonText}>Re-Run Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
      <AuthModal visible={modalVisible} onClose={() => setModalVisible(false)} redirect={jobId ? `/(hireRequest)/request-form?jobId=${jobId}` : "/(hireRequest)/request-form"} />
    </SafeAreaView>
  )
}

export default HireRequest