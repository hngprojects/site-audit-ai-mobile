import * as authActions from '@/actions/auth-actions';
import EditProfileSkeleton from '@/components/profile/edit-profile-skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth-store';
import styles from '@/stylesheets/edit-profile-stylesheet';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditProfileContent = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const { updateUser: updateUserStore } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState<{fullName?: string; email?: string; phoneNumber?: string}>({});

  useEffect(() => {
    const loadUserData = async () => {
      if (!token || !user) {
        setIsLoadingData(false);
        return;
      }

      try {
        const userData = await authActions.getUser(token);
        if (userData) {
          setFullName(userData.fullName || '');
          setEmail(userData.email || '');
          // Note: phone_number is not in the User type, so we'll need to handle it separately
          // For now, we'll leave it empty and let the user enter it
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadUserData();
  }, [token, user]);

  const validateForm = () => {
    const newErrors: {fullName?: string; email?: string; phoneNumber?: string} = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email is read-only, but we validate it anyway
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Incorrect email format';
    }

    // Phone number is optional but if provided, should be valid
    if (phoneNumber.trim() && !/^\+?[\d\s\-\(\)]+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !token) return;

    setIsLoading(true);
    try {
      // Split full name into first_name and last_name
      const nameParts = fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const updatedUser = await authActions.updateUser(token, {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber.trim(),
      });

      // Update the store with the new user data
      updateUserStore(updatedUser);

      Alert.alert(
        'Success',
        'Profile has been changed successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: () => console.log('Take photo') },
        { text: 'Choose from Gallery', onPress: () => console.log('Choose from gallery') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  if (isLoadingData) {
    return <EditProfileSkeleton />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Edit Profile</Text>
        </View>

        <View style={styles.content}>
          {/* Profile Image Section */}
          <View style={styles.profileImageSection}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage} />
              <TouchableOpacity style={styles.editImageButton} onPress={handleChangePhoto}>
                <Feather name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleChangePhoto}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                value={fullName}
                onChangeText={(text: string) => {
                  setFullName(text);
                  if (errors.fullName) setErrors({...errors, fullName: undefined});
                }}
                placeholder="Enter your full name"
                placeholderTextColor="#B9B9B9"
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError, { opacity: 0.6 }]}
                value={email}
                editable={false}
                placeholder="Enter your email"
                placeholderTextColor="#B9B9B9"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={[styles.input, errors.phoneNumber && styles.inputError]}
                value={phoneNumber}
                onChangeText={(text: string) => {
                  setPhoneNumber(text);
                  if (errors.phoneNumber) setErrors({...errors, phoneNumber: undefined});
                }}
                placeholder="Enter your phone number"
                placeholderTextColor="#B9B9B9"
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default function EditProfile() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <EditProfileContent />;
}

