import { COUNTRIES, PHONE_NUMBER_LENGTHS } from '@/constants/countries';
import { profileService } from '@/lib/profile-service';
import { useAuthStore } from '@/store/auth-store';
import styles from '@/stylesheets/edit-profile-stylesheet';
import { getFullImageUrl } from '@/utils/image-url';
import { useTranslation } from '@/utils/translations';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const EditProfileContent = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, token } = useAuthStore();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; phoneNumber?: string }>({});
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    dial_code: '+234'
  });

  // Countries data imported from constants

  // Filter countries based on search
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.dial_code.includes(countrySearch) ||
    country.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

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
    const newErrors: { fullName?: string; email?: string; phoneNumber?: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = t('editProfile.nameRequired');
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = t('editProfile.nameMinLength');
    } else {
      // Disallow emojis and punctuation: only allow letters, numbers, and spaces
      let hasInvalidChars = false;
      try {
        hasInvalidChars = /[^\p{L}\p{N}\s]/gu.test(fullName);
      } catch {
        hasInvalidChars = /[^A-Za-z0-9 ]/g.test(fullName);
      }
      if (hasInvalidChars) {
        newErrors.fullName = t('editProfile.nameInvalidChars');
      }
    }

    if (!email.trim()) {
      newErrors.email = t('auth.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t('auth.invalidEmail');
    }

    if (phoneNumber && phoneNumber.trim()) {
      // Basic phone number validation - check if it contains only valid characters
      const phoneRegex = /^[\d\s\-\(\)\+]+$/;
      const digitsOnly = phoneNumber.replace(/\D/g, '');
      const maxLength = PHONE_NUMBER_LENGTHS[selectedCountry.code] || PHONE_NUMBER_LENGTHS.default;

      if (!phoneRegex.test(phoneNumber)) {
        newErrors.phoneNumber = t('editProfile.phoneInvalid');
      } else if (digitsOnly.length < 7) {
        newErrors.phoneNumber = t('editProfile.phoneTooShort').replace('{country}', selectedCountry.name);
      }
      // Note: We don't check for "too long" here because maxLength prevents input beyond the limit
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
        text1: t('common.success'),
        text2: t('editProfile.profileUpdated'),
      });
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : t('editProfile.updateError'),
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
          text1: t('editProfile.permissionsRequired'),
          text2: t('editProfile.cameraPermission'),
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
            text1: t('common.error'),
            text2: t('editProfile.imageSizeError'),
          });
          return;
        }
        await uploadImage(asset.uri);
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('editProfile.takePhotoError'),
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
            text1: t('common.error'),
            text2: t('editProfile.imageSizeError'),
          });
          return;
        }
        await uploadImage(asset.uri);
      }
    } catch {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: t('editProfile.selectImageError'),
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
        text1: t('common.success'),
        text2: t('editProfile.photoUpdated'),
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('common.error'),
        text2: error instanceof Error ? error.message : t('editProfile.uploadError'),
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleChangePhoto = () => {
    // For action sheets, we'll keep using Alert for now as Toast doesn't support user interaction
    // But we can show toasts after actions
    Alert.alert(
      t('editProfile.changePhoto'),
      t('editProfile.chooseOption'),
      [
        { text: t('photoSheet.takePhoto'), onPress: handleTakePhoto },
        { text: t('editProfile.chooseFromGallery'), onPress: handleChooseFromGallery },
        { text: t('common.cancel'), style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 16, paddingBottom: 100 }}
        >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#1A2373" />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t('editProfile.title')}</Text>
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
                {isUploadingImage ? t('common.loading') : t('editProfile.changePhoto')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('editProfile.fullName')}</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                value={fullName}
                onChangeText={(text: string) => {
                  setFullName(text);
                  if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                }}
                placeholder={t('editProfile.enterFullName')}
                placeholderTextColor="#B9B9B9"
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('editProfile.email')}</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={email}
                placeholder={t('editProfile.enterEmail')}
                placeholderTextColor="#B9B9B9"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={false}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={[styles.phoneInputContainer, errors.phoneNumber && styles.inputError]}>
                <TouchableOpacity
                  style={styles.countryPickerButton}
                  onPress={() => setShowCountryPicker(true)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                  <Text style={styles.countryCodeText}>{selectedCountry.dial_code}</Text>
                </TouchableOpacity>
                <TextInput
                  style={styles.phoneNumberInput}
                  value={phoneNumber.replace(selectedCountry.dial_code, '').trim()}
                  onChangeText={(text) => {
                    // Remove any non-digit characters
                    const cleanText = text.replace(/\D/g, '');
                    const maxLength = PHONE_NUMBER_LENGTHS[selectedCountry.code] || PHONE_NUMBER_LENGTHS.default;

                    // Limit input to maximum length for the selected country
                    const limitedText = cleanText.slice(0, maxLength);
                    const fullNumber = selectedCountry.dial_code + limitedText;

                    setPhoneNumber(fullNumber);
                    if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined });
                  }}
                  placeholder={t('editProfile.phonePlaceholder')}
                  placeholderTextColor="#B9B9B9"
                  keyboardType="phone-pad"
                  maxLength={PHONE_NUMBER_LENGTHS[selectedCountry.code] || PHONE_NUMBER_LENGTHS.default}
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>
              {errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}
            </View>

            <Modal
              visible={showCountryPicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowCountryPicker(false)}
            >
              <TouchableOpacity
                style={styles.countryModalBackdrop}
                activeOpacity={1}
                onPress={() => setShowCountryPicker(false)}
              >
                <View style={styles.countryModalContent}>
                  <View style={styles.countryModalHeader}>
                    <Text style={styles.countryModalTitle}>{t('editProfile.selectCountry')}</Text>
                    <TouchableOpacity
                      onPress={() => setShowCountryPicker(false)}
                      style={styles.countryModalClose}
                    >
                      <Text style={styles.countryModalCloseText}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.countrySearchContainer}>
                    <TextInput
                      style={styles.countrySearchInput}
                      placeholder={t('editProfile.searchCountries')}
                      placeholderTextColor="#B9B9B9"
                      value={countrySearch}
                      onChangeText={setCountrySearch}
                    />
                  </View>

                  <ScrollView style={styles.countryList} showsVerticalScrollIndicator={false}>
                    {filteredCountries.map((country) => (
                      <TouchableOpacity
                        key={country.code}
                        style={styles.countryItem}
                        onPress={() => {
                          setSelectedCountry(country);
                          setShowCountryPicker(false);
                          setCountrySearch('');
                          // Update phone number with new country code
                          const currentNumber = phoneNumber.replace(/^\+\d+/, '');
                          setPhoneNumber(country.dial_code + currentNumber);
                        }}
                      >
                        <Text style={styles.countryFlag}>{country.flag}</Text>
                        <View style={styles.countryInfo}>
                          <Text style={styles.countryName}>{country.name}</Text>
                          <Text style={styles.countryDialCode}>{country.dial_code}</Text>
                        </View>
                        {selectedCountry.code === country.code && (
                          <Text style={styles.countrySelected}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </Modal>
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
                <Text style={styles.saveButtonText}>{t('editProfile.saveChanges')}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={isLoading || isUploadingImage}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
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
