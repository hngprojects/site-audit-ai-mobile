import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheets/edit-profile-stylesheet';

const EditProfileSkeleton: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Skeleton width={24} height={24} borderRadius={4} />
          <Skeleton width={120} height={24} style={{ marginLeft: 16 }} />
        </View>

        <View style={styles.content}>
          {/* Profile Image Section */}
          <View style={styles.profileImageSection}>
            <View style={styles.profileImageContainer}>
              <Skeleton width={100} height={100} borderRadius={50} />
            </View>
            <Skeleton width={100} height={16} style={{ marginTop: 12, alignSelf: 'center' }} />
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Skeleton width={80} height={14} style={{ marginBottom: 8 }} />
              <Skeleton width="100%" height={48} borderRadius={8} />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Skeleton width={100} height={14} style={{ marginBottom: 8 }} />
              <Skeleton width="100%" height={48} borderRadius={8} />
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <Skeleton width={110} height={14} style={{ marginBottom: 8 }} />
              <Skeleton width="100%" height={48} borderRadius={8} />
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Skeleton width="100%" height={48} borderRadius={8} style={{ marginBottom: 12 }} />
            <Skeleton width="100%" height={48} borderRadius={8} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfileSkeleton;

