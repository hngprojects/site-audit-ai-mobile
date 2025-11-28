import { profileService } from '@/lib/profile-service';
import { useAuthStore } from '@/store/auth-store';
import styles from '@/stylesheets/edit-profile-stylesheet';
import { getFullImageUrl } from '@/utils/image-url';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditProfileContent = () => {
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<{fullName?: string; email?: string; phoneNumber?: string}>({});
  const hasInitialized = useRef(false);

  // Load fresh profile data when screen is focused
  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        if (token) {
          try {
            const profile = await profileService.getProfile(token);
            useAuthStore.setState({ user: profile });
            setFullName(profile.fullName || '');
            setEmail(profile.email || '');
            setPhoneNumber(profile.phoneNumber || '');
            setProfileImage(profile.profileImage || null);
            hasInitialized.current = true;
          } catch {
            // If API call fails, use existing user data if available
            const currentUser = useAuthStore.getState().user;
            if (!hasInitialized.current && currentUser) {
              setFullName(currentUser.fullName || '');
              setEmail(currentUser.email || '');
              setPhoneNumber(currentUser.phoneNumber || '');
              setProfileImage(currentUser.profileImage || null);
              hasInitialized.current = true;
            }
          }
        } else {
          // Fallback to user data if no token
          const currentUser = useAuthStore.getState().user;
          if (!hasInitialized.current && currentUser) {
            setFullName(currentUser.fullName || '');
            setEmail(currentUser.email || '');
            setPhoneNumber(currentUser.phoneNumber || '');
            setProfileImage(currentUser.profileImage || null);
            hasInitialized.current = true;
          }
        }
      };

      loadProfile();
    }, [token])
  );

  const validateForm = () => {
    const newErrors: {fullName?: string; email?: string; phoneNumber?: string} = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Incorrect email format';
    }

    if (phoneNumber && phoneNumber.trim() && !/^\+?[\d\s\-\(\)]+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !token) return;

    setIsLoading(true);
    try {
      const updateData: {
        first_name?: string;
        last_name?: string;
        email?: string;
        phone_number?: string;
      } = {};

      if (fullName !== user?.fullName) {
        const nameParts = fullName.trim().split(' ');
        if (nameParts.length > 0) {
          updateData.first_name = nameParts[0];
          updateData.last_name = nameParts.slice(1).join(' ') || undefined;
        }
      }
      if (email !== user?.email) {
        updateData.email = email.trim();
      }
      if (phoneNumber !== user?.phoneNumber) {
        updateData.phone_number = phoneNumber.trim() || undefined;
      }

      const updatedUser = await profileService.updateProfile(updateData, token);
      
      // Update Zustand store with the latest user data
      useAuthStore.setState({ user: updatedUser });
      
      // Update local state to reflect changes
      setFullName(updatedUser.fullName);
      setEmail(updatedUser.email);
      setPhoneNumber(updatedUser.phoneNumber || '');
      setProfileImage(updatedUser.profileImage || null);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile has been updated successfully',
      });
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
        Toast.show({
          type: 'warning',
          text1: 'Permissions Required',
          text2: 'Camera and media library permissions are required to change your profile photo.',
        });
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission || !token) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.fileSize && asset.fileSize > 3 * 1024 * 1024) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Image size must be less than 3MB. Please choose a smaller image.',
          });
          return;
        }
        await uploadImage(asset.uri);
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to take photo. Please try again.',
      });
    }
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission || !token) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        if (asset.fileSize && asset.fileSize > 3 * 1024 * 1024) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Image size must be less than 3MB. Please choose a smaller image.',
          });
          return;
        }
        await uploadImage(asset.uri);
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to select image. Please try again.',
      });
    }
  };

  const uploadImage = async (imageUri: string) => {
    if (!token) return;

    setIsUploadingImage(true);
    try {
      const imageUrl = await profileService.uploadProfileImage(imageUri, token);
      setProfileImage(imageUrl);
      
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          profileImage: imageUrl,
        };
        useAuthStore.setState({ user: updatedUser });
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Profile photo updated successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error instanceof Error ? error.message : 'Failed to upload image. Please try again.',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleChangePhoto = () => {
    // For action sheets, we'll keep using Alert for now as Toast doesn't support user interaction
    // But we can show toasts after actions
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: handleTakePhoto },
        { text: 'Choose from Gallery', onPress: handleChooseFromGallery },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}
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
              {profileImage && profileImage.trim() ? (
                <Image
                  source={{ uri: getFullImageUrl(profileImage) || '' }}
                  style={styles.profileImage}
                  resizeMode="cover"
                  onError={() => {
                    setProfileImage(null);
                  }}
                />
              ) : (
                <View style={styles.profileImagePlaceholder}>
                  <Text style={styles.profileImageInitials}>
                    {fullName && fullName.trim()
                      ? fullName
                          .trim()
                          .split(' ')
                          .filter(n => n.length > 0)
                          .map(n => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : email && email.trim()
                      ? email[0].toUpperCase()
                      : 'U'}
                  </Text>
                </View>
              )}
              {isUploadingImage && (
                <View style={styles.imageUploadOverlay}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
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
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                onChangeText={(text: string) => {
                  setEmail(text);
                  if (errors.email) setErrors({...errors, email: undefined});
                }}
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
                placeholder="Enter your phone number (optional)"
                placeholderTextColor="#B9B9B9"
                keyboardType="phone-pad"
              />
              {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.saveButton, (isLoading || isUploadingImage) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={isLoading || isUploadingImage}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Changes</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isLoading || isUploadingImage}
            >
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
        <ActivityIndicator size="large" color="#ff5a3d" />
      </View>
    );
  }

  return <EditProfileContent />;
}
