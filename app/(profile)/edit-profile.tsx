import * as authActions from '@/actions/auth-actions';
import EditProfileSkeleton from '@/components/profile/edit-profile-skeleton';
import { useAuth } from '@/hooks/use-auth';
import { handleAuthError } from '@/lib/auth-error-handler';
import { useAuthStore } from '@/store/auth-store';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheets/edit-profile-stylesheet';

const EditProfileContent = () => {
  const router = useRouter();
  const { user, token } = useAuth();
  const { updateUser: updateUserStore } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | undefined>(user?.profilePicture);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; phoneNumber?: string }>({});

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
          setProfilePicture(userData.profilePicture);
          // Note: phone_number is not in the User type, so we'll need to handle it separately
          // For now, we'll leave it empty and let the user enter it
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        const wasLoggedOut = await handleAuthError(error);
        if (wasLoggedOut) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please sign in again.',
            [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
          );
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, user]);

  const validateForm = () => {
    const newErrors: { fullName?: string; email?: string; phoneNumber?: string } = {};

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
      const wasLoggedOut = await handleAuthError(error);
      if (wasLoggedOut) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please sign in again.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update profile. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleChangePhoto = () => {
    if (!token) return;

    const options: { text: string; onPress?: () => void | Promise<void>; style?: 'default' | 'cancel' | 'destructive' }[] = [
      { text: 'Take Photo', onPress: handleTakePhoto },
      { text: 'Choose from Gallery', onPress: handlePickImage },
    ];

    if (profilePicture) {
      options.push({ text: 'Delete Photo', onPress: handleDeletePhoto, style: 'destructive' });
    }

    options.push({ text: 'Cancel', style: 'cancel' });

    Alert.alert('Change Profile Photo', 'Choose an option', options);
  };

  const handleTakePhoto = async () => {
    if (!token) return;

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to take a photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const handlePickImage = async () => {
    if (!token) return;

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Gallery permission is required to select a photo.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const uploadImage = async (imageUri: string) => {
    if (!token) return;

    setIsUploadingImage(true);
    try {
      const profilePictureUrl = await authActions.uploadProfilePicture(token, imageUri);
      setProfilePicture(profilePictureUrl);

      // Update user in store with new profile picture
      const userData = await authActions.getUser(token);
      if (userData) {
        updateUserStore(userData);
      }

      Alert.alert('Success', 'Profile picture updated successfully');
    } catch (error) {
      const wasLoggedOut = await handleAuthError(error);
      if (wasLoggedOut) {
        Alert.alert(
          'Session Expired',
          'Your session has expired. Please sign in again.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Failed to upload profile picture. Please try again.';
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!token) return;

    Alert.alert(
      'Delete Profile Picture',
      'Are you sure you want to delete your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await authActions.deleteProfilePicture(token);
              setProfilePicture(undefined);

              // Update user in store
              const userData = await authActions.getUser(token);
              if (userData) {
                updateUserStore(userData);
              }

              Alert.alert('Success', 'Profile picture deleted successfully');
            } catch (error) {
              const wasLoggedOut = await handleAuthError(error);
              if (wasLoggedOut) {
                Alert.alert(
                  'Session Expired',
                  'Your session has expired. Please sign in again.',
                  [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
                );
              } else {
                const errorMessage = error instanceof Error ? error.message : 'Failed to delete profile picture. Please try again.';
                Alert.alert('Error', errorMessage);
              }
            }
          },
        },
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
              {isUploadingImage ? (
                <View style={[styles.profileImage, { justifyContent: 'center', alignItems: 'center' }]}>
                  <ActivityIndicator size="large" color="#1A2373" />
                </View>
              ) : profilePicture ? (
                <Image
                  source={{ uri: profilePicture }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.profileImage} />
              )}
              <TouchableOpacity
                style={styles.editImageButton}
                onPress={handleChangePhoto}
                disabled={isUploadingImage}
              >
                <Feather name="camera" size={18} color="white" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleChangePhoto} disabled={isUploadingImage}>
              <Text style={styles.changePhotoText}>
                {isUploadingImage ? 'Uploading...' : 'Change Photo'}
              </Text>
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
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
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
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined });
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

