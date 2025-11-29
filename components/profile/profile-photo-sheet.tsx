import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfilePhotoSheetProps {
    visible: boolean;
    onClose: () => void;
    onTakePhoto: () => void;
    onChoosePhoto: () => void;
    onDeletePhoto: () => void;
    hasPhoto: boolean;
}

const ProfilePhotoSheet: React.FC<ProfilePhotoSheetProps> = ({
    visible,
    onClose,
    onTakePhoto,
    onChoosePhoto,
    onDeletePhoto,
    hasPhoto,
}) => {
    const [slideAnim] = useState(new Animated.Value(0));
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, slideAnim]);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [400, 0],
    });

    const handleTakePhoto = () => {
        onTakePhoto();
        onClose();
    };

    const handleChoosePhoto = () => {
        onChoosePhoto();
        onClose();
    };

    const handleDeletePhoto = () => {
        onDeletePhoto();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={[
                                styles.modalContent,
                                {
                                    transform: [{ translateY }],
                                    paddingBottom: insets.bottom + 20,
                                },
                            ]}
                        >
                            <View style={styles.modalHeader}>
                                <View style={styles.dragHandle} />
                                <Text style={styles.title}>Edit Profile Picture</Text>
                            </View>

                            {/* First Section */}
                            <View style={styles.section}>
                                <TouchableOpacity
                                    style={styles.optionRow}
                                    onPress={handleTakePhoto}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.optionText}>Take photo</Text>
                                    <Feather name="camera" size={20} color="#1A2373" />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.optionRow}
                                    onPress={handleChoosePhoto}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.optionText}>Choose photo</Text>
                                    <Feather name="image" size={20} color="#1A2373" />
                                </TouchableOpacity>
                            </View>

                            {/* Second Section */}
                            <View style={styles.section}>
                                {hasPhoto && (
                                    <TouchableOpacity
                                        style={styles.optionRow}
                                        onPress={handleDeletePhoto}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={styles.deleteOptionText}>Delete photo</Text>
                                        <Feather name="trash-2" size={20} color="#D32F2F" />
                                    </TouchableOpacity>
                                )}

                                <TouchableOpacity
                                    style={styles.optionRow}
                                    onPress={onClose}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.optionText}>Cancel</Text>
                                    <Feather name="x" size={20} color="#1A2373" />
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        marginTop: 8,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontFamily: 'RethinkSans-Bold',
        color: '#1c1c1c',
        textAlign: 'center',
    },
    section: {
        marginBottom: 16,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    optionText: {
        fontSize: 16,
        fontFamily: 'RethinkSans-Regular',
        color: '#1c1c1c',
    },
    deleteOptionText: {
        fontSize: 16,
        fontFamily: 'RethinkSans-Regular',
        color: '#D32F2F',
    },
});

export default ProfilePhotoSheet;

